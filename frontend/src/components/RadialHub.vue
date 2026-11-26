<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 放射式展开 ——「一个窑心，五个方向」
 *
 * 基准点：正中一枚窑印（慢转的刻度环 + 陶土圆盘 + 垚字）
 * 五个入口沿不同角度、不同长度的半径向外射出，长度与角度都不对称，
 * 像拉坯时泥从中心往外扩。进入视口时半径自己"长"出来。
 * 鼠标停在哪条，哪条变亮、其余退后，中心字换成对应说明。
 */

const props = defineProps({
  size: { type: Number, default: 720 },
})

const CX = 400
const CY = 400

const items = [
  {
    key: 'shop',
    cn: '逛陶器',
    en: 'SHOP',
    to: '/shop',
    angle: 100,
    len: 322,
    desc: '35 件手作器物，按类目筛',
  },
  {
    key: 'custom',
    cn: '自己定做',
    en: 'CUSTOMIZE',
    to: '/customize',
    angle: 20,
    len: 344,
    desc: '选器型、工艺、颜色，实时看效果',
  },
  {
    key: 'patterns',
    cn: '纹样库',
    en: 'PATTERNS',
    to: '/patterns',
    angle: -50,
    len: 266,
    desc: '六种工艺怎么做、什么来头',
  },
  {
    key: 'craft',
    cn: '工艺故事',
    en: 'CRAFT',
    to: '/story',
    angle: -130,
    len: 298,
    desc: '从泥到器，人守在窑边',
  },
  {
    key: 'account',
    cn: '我的',
    en: 'ACCOUNT',
    to: '/account',
    angle: 170,
    len: 236,
    desc: '订单、收藏、定做方案',
  },
]

const active = ref(-1)
const shown = ref(false)

function pt(it) {
  const rad = (it.angle * Math.PI) / 180
  return {
    x: CX + Math.cos(rad) * it.len,
    y: CY - Math.sin(rad) * it.len,
    // 文字锚点：按左右分side
    ax: Math.cos(rad) >= 0 ? 'start' : 'end',
  }
}

const rail = computed(() =>
  items.map((it) => {
    const p = pt(it)
    return { ...it, ...p }
  })
)

const centerText = computed(() =>
  active.value >= 0 ? items[active.value].desc : '从这里展开'
)

const root = ref(null)
let io = null

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) shown.value = true
      })
    },
    { threshold: 0.35 }
  )
  if (root.value) io.observe(root.value)
})

onUnmounted(() => io?.disconnect())
</script>

<template>
  <div ref="root" class="hub" :class="{ 'is-in': shown }" :style="{ '--hub': size + 'px' }">
    <svg class="hub__svg" :viewBox="`0 0 ${CX * 2} ${CY * 2}`" aria-hidden="true">
      <!-- 年轮：以基准点为中心的同心圆 -->
      <g class="rings">
        <circle :cx="CX" :cy="CY" r="86" />
        <circle :cx="CX" :cy="CY" r="150" />
        <circle :cx="CX" :cy="CY" r="214" />
        <circle :cx="CX" :cy="CY" r="278" />
        <circle :cx="CX" :cy="CY" r="342" />
      </g>

      <!-- 五条半径 -->
      <g class="rails">
        <line
          v-for="(it, i) in rail"
          :key="it.key"
          :x1="CX"
          :y1="CY"
          :x2="it.x"
          :y2="it.y"
          :class="{ 'is-on': active === i, 'is-off': active !== -1 && active !== i }"
          :style="{ transitionDelay: 120 + i * 90 + 'ms' }"
        />
      </g>

      <!-- 端点 -->
      <g class="dots">
        <circle
          v-for="(it, i) in rail"
          :key="it.key"
          :cx="it.x"
          :cy="it.y"
          r="4"
          :class="{ 'is-on': active === i }"
          :style="{ transitionDelay: 220 + i * 90 + 'ms' }"
        />
      </g>
    </svg>

    <!-- 基准点 -->
    <div class="hub__core">
      <div class="hub__tick" />
      <div class="hub__disc">
        <span class="hub__mark">垚</span>
      </div>
      <p class="hub__caption">{{ centerText }}</p>
    </div>

    <!-- 五个入口 -->
    <RouterLink
      v-for="(it, i) in rail"
      :key="it.key"
      :to="it.to"
      class="hub__item"
      :class="{ 'is-on': active === i, 'is-off': active !== -1 && active !== i }"
      :style="{
        left: (it.x / (CX * 2)) * 100 + '%',
        top: (it.y / (CY * 2)) * 100 + '%',
        transform:
          it.ax === 'end'
            ? 'translate(calc(-100% - 12px), -50%)'
            : 'translate(12px, -50%)',
        textAlign: it.ax === 'end' ? 'right' : 'left',
        alignItems: it.ax === 'end' ? 'flex-end' : 'flex-start',
        transitionDelay: 240 + i * 90 + 'ms',
      }"
      @mouseenter="active = i"
      @mouseleave="active = -1"
      @focus="active = i"
      @blur="active = -1"
    >
      <span class="hub__cn">{{ it.cn }}</span>
      <span class="hub__en">{{ it.en }}</span>
    </RouterLink>
  </div>
</template>

<style scoped>
.hub {
  position: relative;
  width: min(var(--hub), 82vw);
  height: min(var(--hub), 82vw);
  margin-inline: auto;
}

.hub__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 年轮 */
.rings circle {
  fill: none;
  stroke: var(--ink);
  stroke-width: 0.8;
  opacity: 0.13;
}

.rings circle:nth-child(2n) {
  stroke-dasharray: 2 7;
}

/* 半径 */
.rails line {
  stroke: var(--ink);
  stroke-width: 1.6;
  opacity: 0.32;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  transition: stroke-dashoffset 900ms var(--ease-out), opacity 320ms var(--ease),
    stroke-width 320ms var(--ease);
}

.hub.is-in .rails line {
  stroke-dashoffset: 0;
}

.rails line.is-on {
  opacity: 1;
  stroke-width: 3;
  stroke: var(--accent);
}

.rails line.is-off {
  opacity: 0.1;
}

.dots circle {
  fill: var(--ink);
  opacity: 0;
  transition: opacity 400ms var(--ease), fill 320ms var(--ease),
    r 320ms var(--ease);
}

.hub.is-in .dots circle {
  opacity: 0.75;
}

.dots circle.is-on {
  fill: var(--accent);
  r: 6;
  opacity: 1;
}

/* 基准点 */
.hub__core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  pointer-events: none;
}

.hub__tick {
  position: absolute;
  width: 152px;
  height: 152px;
  top: -14px;
  border-radius: 50%;
  border: 1px dashed rgba(36, 27, 18, 0.32);
  animation: spin 46s linear infinite;
}

.hub__tick::after {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: var(--accent);
}

.hub__disc {
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(
    circle at 36% 28%,
    var(--paper-4) 0%,
    var(--paper-3) 62%,
    var(--paper-5) 100%
  );
  border: 1px solid rgba(36, 27, 18, 0.32);
  box-shadow: 0 24px 40px -30px rgba(36, 27, 18, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.hub__mark {
  font-family: var(--font-cn);
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ink);
  transform: translateY(1px);
}

.hub__caption {
  position: absolute;
  top: calc(100% + 18px);
  width: 220px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--ink-70);
  line-height: 1.7;
}

/* 五个入口 */
.hub__item {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  opacity: 0;
  transition: opacity 600ms var(--ease), transform 600ms var(--ease-out),
    color 300ms var(--ease);
}

.hub.is-in .hub__item {
  opacity: 1;
}

.hub__item.is-off {
  opacity: 0.25;
}

.hub__item.is-on {
  color: var(--accent);
}

.hub__cn {
  font-family: var(--font-cn);
  font-size: clamp(20px, 2.2vw, 30px);
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.hub__en {
  font-size: 9px;
  letter-spacing: 0.28em;
  color: var(--ink-50);
  white-space: nowrap;
}

.hub__item.is-on .hub__en {
  color: var(--accent);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hub__tick {
    animation: none;
  }
  .rails line {
    stroke-dashoffset: 0;
  }
  .hub__item {
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .hub {
    height: min(var(--hub), 88vw);
  }
  .hub__cn {
    font-size: 17px;
  }
  .hub__disc {
    width: 84px;
    height: 84px;
  }
  .hub__mark {
    font-size: 30px;
  }
  .hub__tick {
    width: 120px;
    height: 120px;
  }
  .hub__caption {
    width: 150px;
    font-size: 11px;
  }
}
</style>