<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import AppButton from '@/components/AppButton.vue'
import AgentFace from '@/components/AgentFace.vue'
import { useOrdersStore } from '@/stores/orders'
import { useFavoritesStore } from '@/stores/favorites'
import { useDesignsStore } from '@/stores/designs'
import { accountNav } from '@/data/nav'
import { useUiStore } from '@/stores/ui'

const orders = useOrdersStore()
const fav = useFavoritesStore()
const designs = useDesignsStore()
const ui = useUiStore()

const cards = [
  { label: '我的订单', to: '/account/orders', key: 'orders' },
  { label: '我的收藏', to: '/account/favorites', key: 'favorites' },
  { label: '我的定做', to: '/account/designs', key: 'designs' },
  { label: '收货地址', to: '/account/addresses', key: 'addresses' },
]
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '我的' }]" />

    <PageHead
      no="06"
      eyebrow="ACCOUNT"
      title="我的"
      lead="订单、收藏、定做方案和收货地址都在这里。第一版数据存在这台设备的浏览器里。"
    />

    <!-- 垚垚 -->
    <section class="hello">
      <AgentFace :size="72" mood="happy" />
      <div class="hello__text">
        <p class="hello__name">垚垚</p>
        <p class="small">要不要我帮你看看上次存的那份定做方案？</p>
      </div>
      <AppButton variant="line" size="sm" @click="ui.openAgent()">聊聊</AppButton>
    </section>

    <!-- 概览 -->
    <section class="overview">
      <RouterLink v-for="c in cards" :key="c.key" :to="c.to" class="tile">
        <p class="tile__label">{{ c.label }}</p>
        <p class="tile__num">
          <template v-if="c.key === 'orders'">{{ orders.list.length }}</template>
          <template v-else-if="c.key === 'favorites'">{{ fav.count }}</template>
          <template v-else-if="c.key === 'designs'">{{ designs.list.length }}</template>
          <template v-else>—</template>
        </p>
        <span class="tile__arrow">→</span>
      </RouterLink>
    </section>

    <!-- 二级导航 -->
    <nav class="subnav">
      <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="subnav__item">
        {{ a.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.hello {
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s3) var(--s4);
  border: 1px solid var(--line);
  background: var(--paper-4);
  margin-bottom: var(--s5);
}

.hello__text {
  flex: 1;
}

.hello__name {
  font-family: var(--font-cn);
  font-size: 16px;
  letter-spacing: 0.14em;
}

.overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s3);
}

.tile {
  position: relative;
  padding: var(--s4) var(--s3);
  border: 1px solid var(--line);
  transition: border-color 300ms var(--ease), background-color 300ms var(--ease);
}

.tile:hover {
  border-color: var(--ink-40);
  background: var(--cream-2);
}

.tile__label {
  font-size: 13px;
  letter-spacing: 0.12em;
  color: var(--ink-60);
}

.tile__num {
  margin-top: var(--s3);
  font-family: var(--font-display);
  font-size: 40px;
  line-height: 1;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.tile__arrow {
  position: absolute;
  right: var(--s3);
  bottom: var(--s3);
  color: var(--ink-40);
}

.subnav {
  margin-top: var(--s5);
  padding-top: var(--s3);
  border-top: 1px solid var(--line);
  display: flex;
  gap: var(--s4);
  flex-wrap: wrap;
}

.subnav__item {
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--ink-60);
  transition: color 260ms var(--ease);
}

.subnav__item:hover {
  color: var(--ink);
}

@media (max-width: 860px) {
  .overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
