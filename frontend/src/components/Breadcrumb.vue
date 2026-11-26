<script setup>
/** 面包屑：首页 / 逛陶器 / 山雾杯 */
defineProps({
  items: { type: Array, default: () => [] }, // [{ label, to }]
})
</script>

<template>
  <nav class="crumb" aria-label="位置">
    <ol>
      <li>
        <RouterLink to="/">首页</RouterLink>
      </li>
      <li v-for="(it, i) in items" :key="i" class="crumb__li">
        <span class="crumb__sep">/</span>
        <RouterLink v-if="it.to" :to="it.to">{{ it.label }}</RouterLink>
        <span v-else class="crumb__now">{{ it.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.crumb ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  color: var(--ink-40);
}

.crumb a {
  transition: color 300ms var(--ease);
}
.crumb a:hover {
  color: var(--ink);
}

.crumb__sep {
  margin-inline: 4px;
  opacity: 0.5;
}

.crumb__now {
  color: var(--ink-60);
}
</style>
