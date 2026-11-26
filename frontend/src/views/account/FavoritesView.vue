<script setup>
import { computed } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import AppButton from '@/components/AppButton.vue'
import { products } from '@/data/products'
import { patterns } from '@/data/patterns'
import { useFavoritesStore } from '@/stores/favorites'
import { accountNav } from '@/data/nav'

const fav = useFavoritesStore()

const favProducts = computed(() => products.filter((p) => fav.hasProduct(p.id)))
const favPatterns = computed(() => patterns.filter((p) => fav.hasPattern(p.id)))
const total = computed(() => favProducts.value.length + favPatterns.value.length)
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '我的', to: '/account' }, { label: '我的收藏' }]" />

    <PageHead no="06.2" eyebrow="FAVORITES" title="我的收藏" :lead="`共 ${total} 项。`" />

    <nav class="subnav">
      <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="subnav__item">
        {{ a.label }}
      </RouterLink>
    </nav>

    <section v-if="favProducts.length" class="section">
      <p class="eyebrow">器物</p>
      <div class="grid">
        <article v-for="p in favProducts" :key="p.id" class="card">
          <RouterLink :to="`/shop/${p.id}`">
            <FigureFrame :src="p.thumb || p.images[0]" ratio="4/5" :label="p.name" hover />
            <p class="card__name">{{ p.name }}</p>
            <p class="micro">¥{{ p.price }}</p>
          </RouterLink>
          <button type="button" class="card__btn" @click="fav.toggleProduct(p.id)">取消收藏</button>
        </article>
      </div>
    </section>

    <section v-if="favPatterns.length" class="section">
      <p class="eyebrow">纹样</p>
      <div class="grid">
        <article v-for="p in favPatterns" :key="p.id" class="card">
          <RouterLink :to="`/patterns/${p.id}`">
            <FigureFrame ratio="1/1" :label="p.name" hover />
            <p class="card__name">{{ p.name }}</p>
            <p class="micro">{{ p.category }}</p>
          </RouterLink>
          <button type="button" class="card__btn" @click="fav.togglePattern(p.id)">取消收藏</button>
        </article>
      </div>
    </section>

    <div v-if="!total" class="empty">
      <p class="muted">还没有收藏。</p>
      <AppButton tag="RouterLink" to="/shop" variant="line" size="md">去逛陶器</AppButton>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.subnav {
  display: flex;
  gap: var(--s4);
  flex-wrap: wrap;
  padding-top: var(--s2);
  padding-bottom: var(--s3);
  border-bottom: 1px solid var(--line);
}

.subnav__item {
  font-size: 13px;
  color: var(--ink-60);
  letter-spacing: 0.08em;
}

.section {
  padding-top: var(--s4);
}

.grid {
  margin-top: var(--s3);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s4) var(--s3);
}

.card__name {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 16px;
  letter-spacing: 0.05em;
}

.card__btn {
  margin-top: 8px;
  font-size: 11px;
  color: var(--ink-40);
  border-bottom: 1px solid var(--line);
  padding-bottom: 1px;
}

.card__btn:hover {
  color: var(--clay);
}

.empty {
  padding: var(--s6) 0;
  display: flex;
  align-items: center;
  gap: var(--s3);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
