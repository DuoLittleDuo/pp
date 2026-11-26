<script setup>
/** 首页右侧竖排章节条：01–05，滚动时高亮 */
defineProps({
  chapters: { type: Array, default: () => [] }, // [{ id, no, label }]
  active: { type: Number, default: 0 },
})
</script>

<template>
  <nav class="rail" aria-label="章节">
    <span class="rail__line" />
    <a
      v-for="(c, i) in chapters"
      :key="c.id"
      :href="`#${c.id}`"
      class="rail__item"
      :class="{ 'is-active': i === active }"
    >
      <span class="rail__no">{{ c.no }}</span>
      <span class="rail__label">{{ c.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.rail {
  position: fixed;
  right: clamp(14px, 1.8vw, 34px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: flex-end;
}

.rail__line {
  position: absolute;
  right: 3px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: var(--line);
}

.rail__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 14px;
  --rail: var(--clay);
}

/* 每一章一个颜色，和章节底色呼应 */
.rail__item:nth-child(2) {
  --rail: var(--clay);
}
.rail__item:nth-child(3) {
  --rail: var(--c-bowl);
}
.rail__item:nth-child(4) {
  --rail: var(--celadon);
}
.rail__item:nth-child(5) {
  --rail: var(--c-obj);
}
.rail__item:nth-child(6) {
  --rail: var(--c-jar);
}
.rail__item:nth-child(7) {
  --rail: var(--accent);
}

.rail__no {
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--ink-40);
  font-variant-numeric: tabular-nums;
  transition: color 320ms var(--ease);
}

.rail__label {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--ink-40);
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 320ms var(--ease), transform 320ms var(--ease),
    color 320ms var(--ease);
  white-space: nowrap;
}

.rail__item::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 7px;
  height: 1px;
  background: var(--ink-40);
  transition: background-color 320ms var(--ease), width 320ms var(--ease);
}

.rail__item:hover .rail__label,
.rail__item.is-active .rail__label {
  opacity: 1;
  transform: none;
}

.rail__item.is-active .rail__no {
  color: var(--rail);
}

.rail__item.is-active::after {
  background: var(--rail);
  width: 13px;
}

.rail__item.is-active .rail__label {
  color: var(--rail);
}

@media (max-width: 1100px) {
  .rail {
    display: none;
  }
}
</style>
