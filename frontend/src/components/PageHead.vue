<script setup>
/** 统一的页面标题区：英文小标 + 中文大标 + 说明 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  no: { type: String, default: '' },
})
</script>

<template>
  <header class="ph">
    <div class="ph__meta">
      <span v-if="no" class="num">{{ no }}</span>
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    </div>

    <div class="ph__body">
      <h1 class="ph__title">{{ title }}</h1>
      <p v-if="lead" class="ph__lead">{{ lead }}</p>
      <div v-if="$slots.aside" class="ph__aside"><slot name="aside" /></div>
    </div>

    <hr class="rule ph__rule" />
  </header>
</template>

<style scoped>
.ph {
  padding-top: calc(var(--nav-h) + var(--s5));
  padding-bottom: var(--s4);
}

.ph__meta {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s3);
}

.ph__body {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--s4);
  align-items: end;
}

.ph__title {
  font-family: var(--font-cn);
  font-size: clamp(30px, 4.4vw, 60px);
  font-weight: 400;
  line-height: 1.22;
  letter-spacing: 0.03em;
}

.ph__lead {
  max-width: 46ch;
  font-size: var(--fs-body);
  line-height: 1.9;
  color: var(--ink-60);
}

.ph__aside {
  grid-column: 2;
}

.ph__rule {
  margin-top: var(--s4);
}

@media (max-width: 860px) {
  .ph__body {
    grid-template-columns: 1fr;
    gap: var(--s3);
  }
  .ph__aside {
    grid-column: 1;
  }
}
</style>
