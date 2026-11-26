<script setup>
/**
 * 垚垚的脸 —— 纯 CSS 画的圆头，尺寸可调
 * 视频形象（actions/*.webm）在下一步接进来，位置在这里预留
 */
defineProps({
  size: { type: Number, default: 72 },
  mood: { type: String, default: 'idle' }, // idle | happy | thinking
})
</script>

<template>
  <span
    class="face"
    :class="`face--${mood}`"
    :style="{ width: size + 'px', height: size + 'px' }"
    aria-hidden="true"
  >
    <span class="eye"><i class="pupil" /></span>
    <span class="eye"><i class="pupil" /></span>
  </span>
</template>

<style scoped>
.face {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  padding: 0 22% 4%;
  gap: 4%;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 26%, var(--paper-4) 0%, #eee3d1 48%, #ddcdb6 100%);
  border: 1px solid rgba(164, 103, 75, 0.32);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.eye {
  width: 100%;
  height: 44%;
  display: grid;
  place-items: center;
}

.pupil {
  width: 26%;
  height: 100%;
  min-width: 3px;
  border-radius: 999px;
  background: var(--ink);
  animation: blink 6.4s infinite;
}

/* 开心时眼睛弯一点 */
.face--happy .pupil {
  height: 74%;
  border-radius: 999px 999px 999px 999px;
}

/* 思考时眼睛偏一边 */
.face--thinking .pupil {
  transform: translateX(18%);
}
</style>
