<script setup>
import { computed, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import AppButton from '@/components/AppButton.vue'
import { useOrdersStore } from '@/stores/orders'
import { accountNav } from '@/data/nav'

const orders = useOrdersStore()
const tab = ref('全部')
const tabs = ['全部', '待支付', '已支付', '已发货', '已完成', '已取消']

const list = computed(() =>
  tab.value === '全部'
    ? orders.list
    : orders.list.filter((o) => o.status === tab.value)
)

function fmt(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '我的', to: '/account' }, { label: '我的订单' }]" />

    <PageHead no="06.1" eyebrow="MY ORDERS" title="我的订单" lead="按状态分组。定做商品会多一段「制作中」的进度。" />

    <nav class="subnav">
      <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="subnav__item">
        {{ a.label }}
      </RouterLink>
    </nav>

    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t"
        type="button"
        class="tab"
        :class="{ 'is-on': tab === t }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div v-if="list.length" class="list">
      <article v-for="o in list" :key="o.id" class="order">
        <header class="order__head">
          <div>
            <p class="order__code">{{ o.code }}</p>
            <p class="micro">{{ fmt(o.createdAt) }}</p>
          </div>
          <span class="status" :class="`status--${o.status}`">{{ o.status }}</span>
        </header>

        <ul class="order__items">
          <li v-for="(it, i) in o.items" :key="i">
            <span class="order__name">{{ it.name }}</span>
            <span class="order__spec">{{ it.spec }}</span>
            <span class="order__qty">× {{ it.qty }}</span>
          </li>
        </ul>

        <footer class="order__foot">
          <span class="order__amount">合计 ¥{{ o.amount.toFixed(2) }}</span>
          <RouterLink :to="`/account/orders/${o.id}`" class="order__link">订单详情 →</RouterLink>
        </footer>
      </article>
    </div>

    <div v-else class="empty">
      <p class="muted">这里还没有订单。</p>
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

.subnav__item:hover {
  color: var(--ink);
}

.tabs {
  display: flex;
  gap: var(--s3);
  padding-block: var(--s3);
  flex-wrap: wrap;
}

.tab {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--ink-40);
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
  transition: all 260ms var(--ease);
}

.tab.is-on {
  color: var(--ink);
  border-bottom-color: var(--ink);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.order {
  border: 1px solid var(--line);
  padding: var(--s3);
  background: var(--paper-4);
}

.order__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s2);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}

.order__code {
  font-size: 13px;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
}

.status {
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border: 1px solid var(--line);
  color: var(--ink-60);
}

.status--已支付,
.status--已发货 {
  color: var(--celadon-deep);
  border-color: rgba(88, 118, 109, 0.4);
}

.status--已完成 {
  color: var(--celadon);
  border-color: var(--celadon);
}

.status--待支付 {
  color: var(--clay);
  border-color: rgba(164, 103, 75, 0.35);
}

.status--已取消 {
  color: var(--ink-40);
}

.order__items {
  padding-block: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order__items li {
  display: grid;
  grid-template-columns: 1fr 1fr 60px;
  gap: var(--s2);
  font-size: 13px;
  align-items: baseline;
}

.order__spec {
  color: var(--ink-40);
  font-size: var(--fs-micro);
}

.order__qty {
  text-align: right;
  color: var(--ink-40);
}

.order__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}

.order__amount {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.order__link {
  font-size: 12px;
  color: var(--ink-60);
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}

.empty {
  padding: var(--s6) 0;
  display: flex;
  align-items: center;
  gap: var(--s3);
}

@media (max-width: 700px) {
  .order__items li {
    grid-template-columns: 1fr auto;
  }
  .order__spec {
    grid-column: 1 / -1;
  }
}
</style>
