<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import AppButton from '@/components/AppButton.vue'
import { useDesignsStore } from '@/stores/designs'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { accountNav } from '@/data/nav'

const designs = useDesignsStore()
const cart = useCartStore()
const ui = useUiStore()

function fmt(iso) {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function craftNameOf(d) {
  return d.craftName || d.patternName || '—'
}

function addToCart(d) {
  cart.add({
    productId: `custom-${d.shape}-${d.craftId || d.patternId || ''}`,
    name: `定做 ${d.shapeName} · ${craftNameOf(d)}`,
    sku: 'CUSTOM',
    price: d.price,
    qty: 1,
    spec: `${d.color} · ${d.shapeName}`,
    image: '',
    custom: {
      shape: d.shape,
      shapeName: d.shapeName,
      craftId: d.craftId || d.patternId,
      craftName: craftNameOf(d),
      color: d.color,
      colorHex: d.colorHex,
      scale: d.scale,
      offsetY: d.offsetY,
      price: d.price,
      version: d.version,
    },
  })
  ui.say('已放进购物袋')
}

function remove(d) {
  designs.remove(d.id)
  ui.say('方案已删除')
}
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '我的', to: '/account' }, { label: '我的定做' }]" />

    <PageHead
      no="06.3"
      eyebrow="MY DESIGNS"
      title="我的定做"
      lead="存下来的方案都在这里。可以再次下单，也可以删掉。"
    />

    <nav class="subnav">
      <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="subnav__item">
        {{ a.label }}
      </RouterLink>
    </nav>

    <div v-if="designs.list.length" class="list">
      <article v-for="d in designs.list" :key="d.id" class="row">
        <div class="row__img">
          <FigureFrame ratio="1/1" :label="`${d.shapeName} · ${craftNameOf(d)}`" />
        </div>

        <div class="row__info">
          <p class="row__name">{{ d.name }}</p>
          <p class="micro">{{ d.id }} · 存于 {{ fmt(d.createdAt) }}</p>

          <dl class="cfg">
            <div><dt>器型</dt><dd>{{ d.shapeName }}</dd></div>
            <div><dt>工艺</dt><dd>{{ craftNameOf(d) }}</dd></div>
            <div><dt>颜色</dt><dd>{{ d.color }}</dd></div>
            <div><dt>大小</dt><dd>{{ Number(d.scale).toFixed(2) }}×</dd></div>
          </dl>

          <p class="row__price">¥{{ d.price }}</p>

          <div class="row__acts">
            <AppButton variant="solid" size="sm" @click="addToCart(d)">放进购物袋</AppButton>
            <AppButton tag="RouterLink" to="/customize" variant="line" size="sm">再改一改</AppButton>
            <button type="button" class="del" @click="remove(d)">删除</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty">
      <p class="muted">还没有保存的方案。</p>
      <AppButton tag="RouterLink" to="/customize" variant="line" size="md">去定做一件</AppButton>
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

.list {
  padding-top: var(--s4);
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--s4);
  padding-bottom: var(--s4);
  border-bottom: 1px solid var(--line-soft);
}

.row__name {
  font-family: var(--font-cn);
  font-size: 18px;
  letter-spacing: 0.06em;
}

.cfg {
  margin-top: var(--s2);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px var(--s3);
  max-width: 420px;
}

.cfg div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-block: 6px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 12px;
}

.cfg dt {
  color: var(--ink-40);
}

.cfg dd {
  margin: 0;
}

.row__price {
  margin-top: var(--s2);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
}

.row__acts {
  margin-top: var(--s2);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.del {
  font-size: 12px;
  color: var(--ink-40);
  border-bottom: 1px solid var(--line);
}

.del:hover {
  color: var(--clay);
}

.empty {
  padding: var(--s6) 0;
  display: flex;
  align-items: center;
  gap: var(--s3);
}

@media (max-width: 760px) {
  .row {
    grid-template-columns: 1fr;
  }
  .row__img {
    width: 140px;
  }
}
</style>
