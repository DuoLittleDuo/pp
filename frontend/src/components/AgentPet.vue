<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AgentVideo from './AgentVideo.vue'

/**
 * 垚垚 · 桌宠
 * - 飘在页面右下角，可以拖、可以甩
 * - 松手会掉到地上，撞墙会弹
 * - 点她打开聊天；右键有菜单
 * - 换页面会自动播一段动作并说一句话
 */

const props = defineProps({
  action: { type: String, default: 'idle' },
  once: { type: Boolean, default: false },
})

const emit = defineEmits(['open', 'ended', 'action'])

const route = useRoute()

/* ---------------- 尺寸 ---------------- */
/**
 * 视频是 1280×720 的 16:9 画布，角色只占中间 16% 宽、36% 高。
 * 所以外层盒子做成竖版，视频放大后居中裁切，角色才会显大。
 */
const SIZE = reactive({ w: 250, h: 290 })
const scale = ref(1)

const boxW = computed(() => Math.round(SIZE.w * scale.value))
const boxH = computed(() => Math.round(SIZE.h * scale.value))

/* ---------------- 位置与物理 ---------------- */
const pos = reactive({ x: 0, y: 0 })
const vel = reactive({ x: 0, y: 0 })
const squash = ref(1)

const dragging = ref(false)
const moved = ref(false)

let raf = 0
let lastT = 0
let pointer = { x: 0, y: 0 }
let grabOffset = { x: 0, y: 0 }
let trail = []

const GRAVITY = 2400
const BOUNCE = 0.55
const FRICTION = 0.86
const SPRING = 260
const DAMP = 34

function vw() {
  return window.innerWidth
}
function vh() {
  return window.innerHeight
}
function floorY() {
  return vh() - boxH.value - 8
}
function clampX(x) {
  return Math.min(Math.max(x, 6), vw() - boxW.value - 6)
}

function savePos() {
  localStorage.setItem(
    'yao:pet',
    JSON.stringify({ x: pos.x, y: pos.y, scale: scale.value })
  )
}

function loadPos() {
  // 默认略小一点，别压住右侧内容；手机上更小
  scale.value = window.innerWidth < 720 ? 0.45 : 0.55
  try {
    const raw = JSON.parse(localStorage.getItem('yao:pet') || 'null')
    if (raw && typeof raw.x === 'number') {
      pos.x = clampX(raw.x)
      pos.y = Math.min(Math.max(raw.y, 0), floorY())
      if (raw.scale) scale.value = Math.min(Math.max(raw.scale, 0.5), 1.6)
      return
    }
  } catch {
    /* 忽略 */
  }
  pos.x = vw() - boxW.value - 28
  pos.y = floorY()
}

function resetPos() {
  vel.x = 0
  vel.y = 0
  pos.x = vw() - boxW.value - 28
  pos.y = floorY()
  savePos()
  say('回到这儿了。')
}

/* ---------------- 主循环 ---------------- */
function tick(now) {
  const dt = Math.min((now - lastT) / 1000, 0.05) || 0.016
  lastT = now

  if (dragging.value) {
    // 跟手 + 一点弹性，别硬贴
    const ax = (pointer.x - grabOffset.x - pos.x) * SPRING
    const ay = (pointer.y - grabOffset.y - pos.y) * SPRING
    vel.x += ax * dt
    vel.y += ay * dt
    vel.x *= 1 - Math.min(DAMP * dt, 1)
    vel.y *= 1 - Math.min(DAMP * dt, 1)
  } else {
    vel.y += GRAVITY * dt
    vel.x *= 1 - Math.min(1.6 * dt, 1)
  }

  pos.x += vel.x * dt
  pos.y += vel.y * dt

  // 左右墙
  if (pos.x < 6) {
    pos.x = 6
    vel.x = Math.abs(vel.x) * BOUNCE
  } else if (pos.x > vw() - boxW.value - 6) {
    pos.x = vw() - boxW.value - 6
    vel.x = -Math.abs(vel.x) * BOUNCE
  }

  // 天花板
  if (pos.y < 0) {
    pos.y = 0
    vel.y = Math.abs(vel.y) * BOUNCE
  }

  // 地面
  const fy = floorY()
  if (pos.y > fy) {
    const impact = vel.y
    pos.y = fy
    if (impact > 500) {
      squash.value = Math.max(0.72, 1 - impact / 6000)
      setTimeout(() => (squash.value = 1), 90)
    }
    vel.y = -impact * BOUNCE
    if (Math.abs(vel.y) < 120) vel.y = 0
    vel.x *= FRICTION
  }

  raf = requestAnimationFrame(tick)
}

/* ---------------- 拖拽 ---------------- */
function onPointerDown(e) {
  if (e.button !== 0) return
  dragging.value = true
  moved.value = false
  pointer = { x: e.clientX, y: e.clientY }
  grabOffset = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  trail = []
  el.value?.setPointerCapture?.(e.pointerId)
  hideBubble()
}

function onPointerMove(e) {
  if (!dragging.value) return
  const dx = e.clientX - pointer.x
  const dy = e.clientY - pointer.y
  if (Math.abs(dx) + Math.abs(dy) > 3) moved.value = true
  pointer = { x: e.clientX, y: e.clientY }
  trail.push({ x: e.clientX, y: e.clientY, t: performance.now() })
  if (trail.length > 12) trail.shift()
}

function onPointerUp(e) {
  if (!dragging.value) return
  dragging.value = false
  el.value?.releasePointerCapture?.(e.pointerId)

  // 用最近 120ms 的轨迹估初速，快甩才飞
  const now = performance.now()
  const recent = trail.filter((p) => now - p.t < 120)
  if (recent.length >= 2) {
    const a = recent[0]
    const b = recent[recent.length - 1]
    const dt = Math.max((b.t - a.t) / 1000, 0.016)
    const vx = (b.x - a.x) / dt
    const vy = (b.y - a.y) / dt
    if (Math.hypot(vx, vy) > 500) {
      vel.x = Math.max(-2600, Math.min(2600, vx))
      vel.y = Math.max(-2600, Math.min(2600, vy))
    }
  }

  savePos()

  if (!moved.value) {
    emit('open')
  }
}

/* ---------------- 说话 ---------------- */
const bubble = ref('')
const bubbleOn = ref(false)
let bubbleTimer = 0
let idleTimer = 0

function say(text, ms = 4200) {
  bubble.value = text
  bubbleOn.value = true
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => (bubbleOn.value = false), ms)
}

function hideBubble() {
  bubbleOn.value = false
}

const SCENE_LINES = {
  home: ['要不要我带你逛一圈？', '这几只绞胎的，纹路都不一样。'],
  shop: ['都是新出窑的，慢慢看。', '想找猫用的还是狗用的？'],
  product: ['这件我摸过，釉面很润。', '想看看尺寸吗？'],
  customize: ['先挑个器型试试？', '颜色可以随便换，看看效果。'],
  cart: ['要结算了吗？', '记得填收货地址。'],
  'pay-result': ['下单啦，谢谢你。', '出窑了我就通知你。'],
  account: ['你的订单都在这儿。', '上次存的那份方案还在。'],
  patterns: ['每种工艺摸起来都不一样。', '绞胎的花纹是泥自己的。'],
  story: ['这些故事都是真的。'],
  default: ['有事叫我。'],
}

const IDLE_LINES = [
  '我就待在这儿，不吵你。',
  '这批窑变，颜色比上次深。',
  '想看看新出的吗？',
  '摸得到颗粒感的那只，我最喜欢。',
]

function sceneLine() {
  const key = route.name === 'product' ? 'product' : String(route.name || 'default')
  const list = SCENE_LINES[key] || SCENE_LINES.default
  return list[Math.floor(Math.random() * list.length)]
}

/* ---------------- 右键菜单 ---------------- */
const menuOn = ref(false)
const menuPos = reactive({ x: 0, y: 0 })

function onContextMenu(e) {
  e.preventDefault()
  menuOn.value = true
  menuPos.x = Math.min(e.clientX, vw() - 150)
  menuPos.y = Math.min(e.clientY, vh() - 170)
}

function menuAction(kind) {
  menuOn.value = false
  if (kind === 'say') say('我在呢，想聊什么？')
  else if (kind === 'reset') resetPos()
  else if (kind === 'bigger') {
    scale.value = Math.min(1.6, scale.value + 0.15)
    savePos()
  } else if (kind === 'smaller') {
    scale.value = Math.max(0.5, scale.value - 0.15)
    savePos()
  } else if (kind === 'hide') {
    hidden.value = true
  }
}

const hidden = ref(false)

/* ---------------- 生命周期 ---------------- */
const el = ref(null)

function onResize() {
  pos.x = clampX(pos.x)
  pos.y = Math.min(pos.y, floorY())
}

onMounted(() => {
  loadPos()
  lastT = performance.now()
  raf = requestAnimationFrame(tick)
  window.addEventListener('resize', onResize)
  setTimeout(() => say('我在这儿。'), 1200)
  idleTimer = setInterval(() => {
    if (!bubbleOn.value && Math.random() > 0.55) say(IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)])
  }, 26000)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  clearTimeout(bubbleTimer)
  clearInterval(idleTimer)
  window.removeEventListener('resize', onResize)
})

// 换页面：说一句
watch(
  () => route.fullPath,
  () => {
    nextTick(() => say(sceneLine()))
  }
)

defineExpose({ say, resetPos })
</script>

<template>
  <div
    v-show="!hidden"
    ref="el"
    class="pet"
    :class="{ 'is-drag': dragging }"
    :style="{
      width: boxW + 'px',
      height: boxH + 'px',
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
    }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu="onContextMenu"
  >
    <div
      class="pet__inner"
      :style="{ transform: `scaleY(${squash}) scaleX(${1 / squash})` }"
    >
      <div class="pet__zoom">
        <AgentVideo :action="action" :once="once" @ended="emit('ended')" />
      </div>
    </div>

    <!-- 只让角色本体接收鼠标，透明的地方不挡下面的按钮 -->
    <div class="pet__hit" aria-hidden="true" />

    <div v-if="bubbleOn" class="bubble">{{ bubble }}</div>
  </div>

  <!-- 右键菜单 -->
  <div v-if="menuOn" class="menu-scrim" @click="menuOn = false" />
  <div
    v-if="menuOn"
    class="menu"
    :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }"
  >
    <button type="button" @click="menuAction('say')">说句话</button>
    <button type="button" @click="menuAction('bigger')">变大</button>
    <button type="button" @click="menuAction('smaller')">变小</button>
    <button type="button" @click="menuAction('reset')">回到右下角</button>
    <button type="button" @click="menuAction('hide')">先躲起来</button>
  </div>

  <!-- 躲起来之后的小把手 -->
  <button v-if="hidden" class="peek" type="button" @click="hidden = false">
    垚垚
  </button>
</template>

<style scoped>
.pet {
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--z-agent);
  cursor: grab;
  touch-action: none;
  user-select: none;
  will-change: transform;
  /* 透明区域不拦截点击，避免挡住底下的按钮 */
  pointer-events: none;
}

/* 角色本体所在的一块，只这里接收事件 */
.pet__hit {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 66%;
  height: 80%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: grab;
}

.pet.is-drag .pet__hit {
  cursor: grabbing;
}

.pet__inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: 50% 100%;
  transition: transform 90ms linear;
}

/* 把 16:9 的画面放大后居中裁切，让角色填满盒子 */
.pet__zoom {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 460%;
  aspect-ratio: 16 / 9;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 10px 16px rgba(41, 40, 36, 0.22));
}

/* 视频本身透明，容器也不该吃鼠标事件以外的东西 */
.pet :deep(.stage) {
  background: transparent;
  height: 100%;
}

.bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% - 6px);
  transform: translateX(-50%);
  max-width: 240px;
  padding: 9px 16px;
  background: var(--paper-4);
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink-60);
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 16px 30px -22px rgba(41, 40, 36, 0.6);
  animation: fadeIn 260ms var(--ease) both;
  pointer-events: none;
}

/* 右键菜单 */
.menu-scrim {
  position: fixed;
  inset: 0;
  z-index: 340;
}

.menu {
  position: fixed;
  z-index: 341;
  min-width: 132px;
  padding: 6px;
  background: var(--cream);
  border: 1px solid var(--line);
  box-shadow: 0 22px 44px -28px rgba(41, 40, 36, 0.55);
  display: flex;
  flex-direction: column;
}

.menu button {
  text-align: left;
  padding: 8px 12px;
  font-size: 12.5px;
  color: var(--ink-60);
  letter-spacing: 0.04em;
}

.menu button:hover {
  background: var(--cream-2);
  color: var(--ink);
}

/* 躲起来后的小把手 */
.peek {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: var(--z-agent);
  padding: 10px 16px;
  font-size: 12px;
  letter-spacing: 0.1em;
  background: var(--cream);
  border: 1px solid var(--line);
  color: var(--ink-60);
  border-radius: 999px;
  box-shadow: 0 18px 34px -26px rgba(41, 40, 36, 0.6);
}

.peek:hover {
  color: var(--ink);
}

@media (max-width: 720px) {
  .bubble {
    white-space: normal;
    border-radius: 16px;
    max-width: 190px;
    font-size: 12px;
  }
}
</style>
