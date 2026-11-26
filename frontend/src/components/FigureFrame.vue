<script setup>
/**
 * 图片位 —— 有图就显示图，没图就显示一个「按比例占好的空位」
 *
 * 用法：
 *   <FigureFrame ratio="4/5" label="主图" caption="摄影 / 待补" />
 *   <FigureFrame :src="p.images[0]" ratio="4/5" alt="山雾杯正面" />
 */
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  ratio: { type: String, default: '4/5' },
  label: { type: String, default: '' },
  caption: { type: String, default: '' },
  tone: { type: String, default: 'sand' }, // sand | cream | clay
  hover: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
})
</script>

<template>
  <figure class="fig" :class="[`fig--${tone}`, { 'fig--hover': hover }]">
    <div class="fig__box" :style="{ aspectRatio: ratio }">
      <img
        v-if="src"
        class="fig__img"
        :src="src"
        :alt="alt || label"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
      />
      <div v-else class="fig__empty">
        <span class="fig__mark">{{ ratio }}</span>
        <span v-if="label" class="fig__label">{{ label }}</span>
      </div>
    </div>
    <figcaption v-if="caption" class="fig__cap">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.fig {
  margin: 0;
  width: 100%;
}

.fig__box {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--sand);
}

.fig--cream .fig__box {
  background: var(--cream-2);
}

.fig--clay .fig__box {
  background: #d9c6b8;
}

.fig__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms var(--ease);
}

.fig--hover:hover .fig__img {
  transform: scale(1.03);
}

/* 空位：一圈极细的线 + 居中的小字，不喧哗 */
.fig__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--ink-40);
  border: 1px solid rgba(164, 103, 75, 0.18);
  background-image: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 55%
    );
}

.fig__mark {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--clay);
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

.fig__label {
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  opacity: 0.8;
}

.fig__cap {
  margin-top: 10px;
  font-size: var(--fs-micro);
  letter-spacing: 0.06em;
  color: var(--ink-40);
  line-height: 1.6;
}
</style>
