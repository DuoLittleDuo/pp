<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import AppButton from '@/components/AppButton.vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '购物袋' }]" />

    <PageHead
      no="04"
      eyebrow="BAG"
      title="购物袋"
      :lead="cart.isEmpty ? '还是空的。先去逛逛，或者自己定做一件。' : `共 ${cart.count} 件。`"
    />

    <div v-if="cart.isEmpty" class="empty">
      <AppButton tag="RouterLink" to="/shop" variant="line" size="md">
        去逛陶器
      </AppButton>
      <AppButton tag="RouterLink" to="/customize" variant="text" size="md">
        自己定做
      </AppButton>
    </div>

    <div v-else class="layout">
      <div class="list">
        <div class="list__head">
          <span>器物</span>
          <span>数量</span>
          <span>小计</span>
        </div>

        <article v-for="it in cart.items" :key="it.key" class="row">
          <div class="row__main">
            <div class="row__img">
              <FigureFrame ratio="1/1" :label="it.name" :src="it.image" />
            </div>
            <div class="row__info">
              <p class="row__name">{{ it.name }}</p>
              <p class="row__spec">{{ it.spec }}</p>
              <p v-if="it.custom" class="row__custom">
                定做：{{ it.custom.shapeName }} · {{ it.custom.craftName || it.custom.patternName }} ·
                {{ it.custom.color }} · {{ Number(it.custom.scale).toFixed(2) }}×
              </p>
              <p class="row__unit">单价 ¥{{ it.price }}</p>
              <button type="button" class="row__del" @click="cart.removeItem(it.key)">
                移出购物袋
              </button>
            </div>
          </div>

          <div class="row__qty">
            <div class="stepper">
              <button type="button" :disabled="it.qty <= 1" @click="cart.setQty(it.key, it.qty - 1)">−</button>
              <span>{{ it.qty }}</span>
              <button type="button" @click="cart.setQty(it.key, it.qty + 1)">+</button>
            </div>
          </div>

          <div class="row__sum">¥{{ (it.price * it.qty).toFixed(2) }}</div>
        </article>
      </div>

      <aside class="summary">
        <p class="eyebrow">SUMMARY</p>
        <div class="summary__row">
          <span>商品合计</span>
          <span>{{ cart.amountText }}</span>
        </div>
        <div class="summary__row">
          <span>运费</span>
          <span>结算时计算</span>
        </div>
        <div class="summary__row summary__row--total">
          <span>应付</span>
          <span>{{ cart.amountText }}</span>
        </div>

        <AppButton tag="RouterLink" to="/checkout" variant="solid" size="lg" class="summary__btn">
          去结算
          <template #arrow>→</template>
        </AppButton>

        <p class="summary__note">
          定做商品需要 25–30 天制作，现货 3 天内发出。可以一起下单，会分开寄出。
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.empty {
  padding: var(--s6) 0;
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: var(--s5);
  padding-top: var(--s3);
  align-items: start;
}

.list__head {
  display: grid;
  grid-template-columns: 1fr 120px 100px;
  gap: var(--s3);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: var(--ink-40);
}

.list__head span:nth-child(2),
.list__head span:nth-child(3) {
  text-align: right;
}

.row {
  display: grid;
  grid-template-columns: 1fr 120px 100px;
  gap: var(--s3);
  align-items: center;
  padding-block: var(--s3);
  border-bottom: 1px solid var(--line-soft);
}

.row__main {
  display: flex;
  gap: var(--s3);
  align-items: flex-start;
}

.row__img {
  width: 92px;
  flex-shrink: 0;
}

.row__name {
  font-family: var(--font-cn);
  font-size: 16px;
  letter-spacing: 0.05em;
}

.row__spec,
.row__unit {
  margin-top: 4px;
  font-size: var(--fs-micro);
  color: var(--ink-40);
  letter-spacing: 0.06em;
}

.row__custom {
  margin-top: 6px;
  font-size: 11px;
  color: var(--celadon-deep);
  line-height: 1.7;
}

.row__del {
  margin-top: 8px;
  font-size: 11px;
  color: var(--ink-40);
  border-bottom: 1px solid var(--line);
  padding-bottom: 1px;
}
.row__del:hover {
  color: var(--clay);
}

.row__qty {
  display: flex;
  justify-content: flex-end;
}

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
}

.stepper button {
  width: 30px;
  height: 30px;
  color: var(--ink-60);
}
.stepper button:disabled {
  opacity: 0.3;
}

.stepper span {
  min-width: 32px;
  text-align: center;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.row__sum {
  text-align: right;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

/* 汇总 */
.summary {
  position: sticky;
  top: calc(var(--nav-h) + var(--s3));
  padding: var(--s3);
  border: 1px solid var(--line);
  background: var(--paper-4);
}

.summary__row {
  display: flex;
  justify-content: space-between;
  gap: var(--s2);
  padding-block: 10px;
  font-size: 13px;
  color: var(--ink-60);
  border-bottom: 1px solid var(--line-soft);
}

.summary__row--total {
  color: var(--ink);
  font-size: 15px;
  padding-top: var(--s2);
  border-bottom: 0;
}

.summary__btn {
  width: 100%;
  justify-content: center;
  margin-top: var(--s2);
}

.summary__note {
  margin-top: var(--s3);
  font-size: var(--fs-micro);
  line-height: 1.8;
  color: var(--ink-40);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .summary {
    position: static;
  }
  .list__head {
    display: none;
  }
  .row {
    grid-template-columns: 1fr auto;
    row-gap: var(--s2);
  }
  .row__main {
    grid-column: 1 / -1;
  }
  .row__qty {
    justify-content: flex-start;
  }
}
</style>
