<script setup>
import AppButton from '@/components/AppButton.vue'
</script>

<template>
  <div class="page shell">
    <p class="eyebrow">404</p>
    <h1 class="title">这一页没找到</h1>
    <p class="muted">可能是链接过期了，或者我们还没做这一页。</p>
    <div class="acts">
      <AppButton tag="RouterLink" to="/" variant="line" size="md">回首页</AppButton>
      <AppButton tag="RouterLink" to="/shop" variant="text" size="md">去逛陶器</AppButton>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: calc(var(--nav-h) + var(--s7));
  padding-bottom: var(--s7);
  min-height: 70vh;
}

.title {
  margin-top: var(--s2);
  font-family: var(--font-cn);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 400;
  letter-spacing: 0.05em;
}

.muted {
  margin-top: var(--s2);
}

.acts {
  margin-top: var(--s4);
  display: flex;
  gap: var(--s3);
  align-items: center;
}
</style>
