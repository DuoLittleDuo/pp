<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 动态天幕 —— 页首一块会自己流动的暖色天空
 * 分层正弦波 + 太阳光晕 + 浮尘，纯 canvas，不改布局。
 * 系统开了「减少动效」就只画一帧静态。
 */
const props = defineProps({
  height: { type: String, default: '46vh' },
})

const wrap = ref(null)
const canvas = ref(null)

let ctx = null
let raf = 0
let t = 0
let w = 0
let h = 0
let dpr = 1

const LAYERS = [
  { amp: 0.05, freq: 1.1, speed: 0.16, y: 0.62, color: 'rgba(208, 160, 96, 0.55)' },
  { amp: 0.07, freq: 0.8, speed: 0.11, y: 0.74, color: 'rgba(184, 133, 72, 0.5)' },
  { amp: 0.05, freq: 1.5, speed: 0.08, y: 0.84, color: 'rgba(154, 104, 50, 0.45)' },
  { amp: 0.09, freq: 0.6, speed: 0.05, y: 0.95, color: 'rgba(122, 79, 38, 0.4)' },
]

const DUST = Array.from({ length: 26 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.6 + Math.random() * 1.6,
  s: 0.02 + Math.random() * 0.05,
  o: 0.12 + Math.random() * 0.3,
}))

function resize() {
  const el = wrap.value
  const cv = canvas.value
  if (!el || !cv) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = el.clientWidth
  h = el.clientHeight
  cv.width = Math.round(w * dpr)
  cv.height = Math.round(h * dpr)
  cv.style.width = w + 'px'
  cv.style.height = h + 'px'
  ctx = cv.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  draw()
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)

  // 天空
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#eccb98')
  sky.addColorStop(0.42, '#ddb277')
  sky.addColorStop(0.78, '#c99a5b')
  sky.addColorStop(1, '#a97240')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  // 太阳光晕
  const sx = w * 0.72
  const sy = h * 0.3
  const sr = Math.min(w, h) * 0.42
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
  glow.addColorStop(0, 'rgba(255, 236, 196, 0.85)')
  glow.addColorStop(0.28, 'rgba(250, 214, 150, 0.42)')
  glow.addColorStop(0.6, 'rgba(240, 190, 118, 0.16)')
  glow.addColorStop(1, 'rgba(240, 190, 118, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  ctx.beginPath()
  ctx.arc(sx, sy, Math.min(w, h) * 0.1, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 243, 214, 0.9)'
  ctx.fill()

  // 分层波
  LAYERS.forEach((L, i) => {
    const base = h * L.y
    const amp = h * L.amp
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 6) {
      const phase = (x / w) * Math.PI * 2 * L.freq + t * L.speed * 6 + i
      const y = base + Math.sin(phase) * amp + Math.cos(phase * 0.6) * amp * 0.4
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = L.color
    ctx.fill()
  })

  // 浮尘
  DUST.forEach((d) => {
    const y = (d.y + t * d.s) % 1
    const x = (d.x + Math.sin(t * 0.6 + d.y * 9) * 0.02) * w
    ctx.beginPath()
    ctx.arc(x, y * h, d.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 246, 224, ${d.o})`
    ctx.fill()
  })
}

function loop() {
  t += 0.016
  draw()
  raf = requestAnimationFrame(loop)
}

let ro = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  if (!reduce) raf = requestAnimationFrame(loop)
  ro = new ResizeObserver(resize)
  if (wrap.value) ro.observe(wrap.value)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <div ref="wrap" class="canopy" :style="{ height }">
    <canvas ref="canvas" class="canopy__cv" aria-hidden="true" />
    <div class="canopy__slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.canopy {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.canopy__cv {
  position: absolute;
  inset: 0;
}

.canopy__slot {
  position: relative;
  z-index: 1;
  width: 100%;
}
</style>