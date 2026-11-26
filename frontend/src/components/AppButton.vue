<script setup>
/** 通用按钮：solid 青釉实心 / line 细线 / text 纯文字 */
defineProps({
  variant: { type: String, default: 'line' }, // solid | line | text
  size: { type: String, default: 'md' }, // sm | md | lg
  tag: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="tag"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'is-disabled': disabled }]"
  >
    <span class="btn__label"><slot /></span>
    <span v-if="$slots.arrow" class="btn__arrow"><slot name="arrow" /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-sans);
  letter-spacing: 0.08em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 300ms var(--ease), color 300ms var(--ease),
    border-color 300ms var(--ease), opacity 300ms var(--ease);
  white-space: nowrap;
}

.btn--sm {
  font-size: 13px;
  padding: 8px 16px;
}
.btn--md {
  font-size: 14px;
  padding: 13px 26px;
}
.btn--lg {
  font-size: 15px;
  padding: 17px 38px;
}

.btn--solid {
  background: var(--celadon);
  color: var(--paper-4);
  border-color: var(--celadon);
}
.btn--solid:hover {
  background: var(--celadon-deep);
  border-color: var(--celadon-deep);
}

.btn--line {
  border-color: var(--ink);
  border-width: 1.5px;
  color: var(--ink);
  background: rgba(36, 27, 18, 0.05);
}
.btn--line:hover {
  background: var(--ink);
  color: var(--paper-4);
}

.btn--text {
  padding-inline: 0;
  color: var(--ink);
  border: 0;
}
.btn--text .btn__label {
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}
.btn--text:hover .btn__label {
  border-color: var(--ink);
}

.btn__arrow {
  transition: transform 400ms var(--ease);
}
.btn:hover .btn__arrow {
  transform: translateX(4px);
}

.is-disabled {
  opacity: 0.35;
  pointer-events: none;
}
</style>
