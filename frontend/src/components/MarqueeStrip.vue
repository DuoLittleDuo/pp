<script setup>
/**
 * 横向滚动的字条 —— 杂志里那种一直走的工艺名
 * 纯 CSS 动画，鼠标悬停暂停。
 */
defineProps({
  items: { type: Array, default: () => [] },
  reverse: { type: Boolean, default: false },
  speed: { type: Number, default: 42 },
})
</script>

<template>
  <div class="ticker" :class="{ 'is-reverse': reverse }">
    <div class="ticker__track" :style="{ animationDuration: speed + 's' }">
      <span v-for="n in 2" :key="n" class="ticker__set">
        <span v-for="(it, i) in items" :key="`${n}-${i}`" class="ticker__item">
          {{ it }}
          <em class="ticker__dot" aria-hidden="true">·</em>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  overflow: hidden;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding-block: 14px;
}

.ticker__track {
  display: flex;
  width: max-content;
  animation: slide linear infinite;
}

.ticker:hover .ticker__track {
  animation-play-state: paused;
}

.is-reverse .ticker__track {
  animation-direction: reverse;
}

.ticker__set {
  display: flex;
  align-items: center;
}

.ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding-inline: 18px;
  font-family: var(--font-cn);
  font-size: clamp(18px, 1.8vw, 26px);
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--ink);
  white-space: nowrap;
}

.ticker__dot {
  font-style: normal;
  color: var(--accent);
}

@keyframes slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker__track {
    animation: none;
  }
}
</style>