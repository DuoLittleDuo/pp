<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const emit = defineEmits(['done'])

const headEl = ref(null)
const pupil = reactive({ x: 0, y: 0 })
const tilt = ref(0)
const bubble = ref('')
const bubbleVisible = ref(false)

const lines = [
  '你好，我是垚垚。',
  '一起看看，泥土怎么变成日常里的陪伴。',
  '这边是刚出窑的几只杯子，要我带你逛吗？',
]

let rafId = 0
let lineIndex = 0
let bubbleTimer = 0

function updatePupil(clientX, clientY) {
  const el = headEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = clientX - cx
  const dy = clientY - cy
  const dist = Math.hypot(dx, dy) || 1
  // 60px 内不动，60~420px 之间逐渐增强
  const strength = Math.min(1, Math.max(0, (dist - 60) / 360))
  const max = 13
  pupil.x = (dx / dist) * max * strength
  pupil.y = (dy / dist) * max * strength
  // 头部只做很轻的倾斜
  tilt.value = (dx / Math.max(dist, 1)) * strength * 3
}

function onMouseMove(e) {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => updatePupil(e.clientX, e.clientY))
}

function onTouch(e) {
  const t = e.touches?.[0]
  if (t) updatePupil(t.clientX, t.clientY)
}

function poke() {
  bubble.value = '嗯？想聊点什么都可以。'
  bubbleVisible.value = true
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    bubbleVisible.value = false
  }, 3200)
}

function nextLine() {
  bubble.value = lines[lineIndex % lines.length]
  bubbleVisible.value = true
  lineIndex += 1
  bubbleTimer = setTimeout(nextLine, 4600)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  bubble.value = lines[0]
  bubbleVisible.value = true
  lineIndex = 1
  bubbleTimer = setTimeout(nextLine, 4600)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouch)
  cancelAnimationFrame(rafId)
  clearTimeout(bubbleTimer)
})
</script>

<template>
  <div class="welcome" role="dialog" aria-modal="true" aria-label="欢迎">
    <div class="welcome__skip">
      <button type="button" class="skip" @click="emit('done')">跳过</button>
    </div>

    <div class="welcome__stage">
      <p class="welcome__eyebrow eyebrow">YAO · YOUR COMPANION</p>

      <div class="head-wrap">
        <div class="bubble" :class="{ 'is-on': bubbleVisible }" aria-live="polite">
          {{ bubble }}
        </div>

        <button
          ref="headEl"
          class="head"
          type="button"
          :style="{ transform: `rotate(${tilt}deg)` }"
          aria-label="垚垚，点一下"
          @click="poke"
        >
          <span class="eye">
            <span class="pupil" :style="{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }" />
          </span>
          <span class="eye">
            <span class="pupil" :style="{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }" />
          </span>
        </button>
      </div>

      <p class="welcome__name">垚垚<span class="dot">·</span>你的陶器伙伴</p>

      <button class="enter" type="button" @click="emit('done')">
        <span>进入陶的世界</span>
        <svg viewBox="0 0 24 12" width="26" height="12" aria-hidden="true">
          <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="1" />
          <path d="M15 1.5 21 6l-6 4.5" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      </button>
    </div>

    <p class="welcome__foot micro">全手工制作 · 每件略有差异</p>
  </div>
</template>

<style scoped>
.welcome {
  position: fixed;
  inset: 0;
  z-index: var(--z-welcome);
  background: var(--cream);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--s5) var(--s3);
  animation: fadeIn 700ms var(--ease) both;
}

.welcome__skip {
  position: absolute;
  top: clamp(16px, 3vw, 34px);
  right: clamp(16px, 4vw, 44px);
}

.skip {
  font-size: var(--fs-micro);
  letter-spacing: 0.18em;
  color: var(--ink-40);
  padding: 8px;
  transition: color 300ms var(--ease);
}
.skip:hover {
  color: var(--ink);
}

.welcome__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s3);
}

.welcome__eyebrow {
  letter-spacing: 0.34em;
}

/* ---------- 头 ---------- */
.head-wrap {
  position: relative;
  display: grid;
  place-items: center;
  padding-top: 74px;
}

.bubble {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 8px);
  max-width: min(420px, 78vw);
  padding: 10px 20px;
  background: #fdfaf3;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--ink-60);
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 620ms var(--ease), transform 620ms var(--ease);
  box-shadow: 0 18px 34px -26px rgba(41, 40, 36, 0.5);
}

.bubble.is-on {
  opacity: 1;
  transform: translate(-50%, 0);
}

.head {
  position: relative;
  width: clamp(200px, 24vw, 288px);
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  padding: 0 20% 6%;
  gap: 4%;
  background: radial-gradient(circle at 34% 26%, #fdfaf3 0%, #eee3d1 48%, #ddcdb6 100%);
  border: 1px solid rgba(164, 103, 75, 0.32);
  box-shadow: 0 40px 70px -46px rgba(41, 40, 36, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 300ms var(--ease), box-shadow 300ms var(--ease);
  animation: breathe 7s ease-in-out infinite;
}

.head:hover {
  box-shadow: 0 46px 78px -46px rgba(41, 40, 36, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 0 10px rgba(164, 103, 75, 0.07);
}

.eye {
  width: 100%;
  height: clamp(46px, 6vw, 66px);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.pupil {
  width: 26%;
  height: 100%;
  min-width: 14px;
  border-radius: 999px;
  background: var(--ink);
  box-shadow: 0 6px 14px rgba(41, 40, 36, 0.24);
  transform-origin: 50% 55%;
  animation: blink 5.8s infinite;
  will-change: transform;
}

.welcome__name {
  font-family: var(--font-cn);
  font-size: 15px;
  letter-spacing: 0.2em;
  color: var(--ink-60);
}

.dot {
  margin-inline: 8px;
  color: var(--clay);
}

/* ---------- 进入按钮 ---------- */
.enter {
  margin-top: var(--s2);
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 15px 34px;
  border: 1px solid var(--ink);
  color: var(--ink);
  font-size: 14px;
  letter-spacing: 0.16em;
  transition: background-color 380ms var(--ease), color 380ms var(--ease);
}

.enter:hover {
  background: var(--ink);
  color: var(--cream);
}

.welcome__foot {
  position: absolute;
  bottom: clamp(16px, 3vw, 32px);
  letter-spacing: 0.2em;
}

@media (max-width: 640px) {
  .bubble {
    white-space: normal;
    border-radius: 18px;
    line-height: 1.6;
  }
}
</style>
