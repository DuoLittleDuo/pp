<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import AppButton from '@/components/AppButton.vue'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { load, save } from '@/utils/storage'

const router = useRouter()
const cart = useCartStore()
const orders = useOrdersStore()

const saved = load('address', null)
const form = ref(
  saved || {
    name: '',
    phone: '',
    province: '',
    city: '',
    detail: '',
    note: '',
  }
)

const payMethod = ref('模拟支付')
const methods = ['模拟支付', '微信（待接入）', '支付宝（待接入）']

const freight = computed(() => (cart.amount >= 300 ? 0 : 12))
const total = computed(() => cart.amount + freight.value)

const valid = computed(
  () => form.value.name && form.value.phone && form.value.city && form.value.detail
)

function submit() {
  if (!valid.value || cart.isEmpty) return
  save('address', form.value)

  const order = orders.create({
    items: cart.items,
    amount: total.value,
    address: { ...form.value },
    payMethod: payMethod.value,
  })

  cart.clear()
  router.push({ name: 'pay-result', query: { order: order.id, ok: '1' } })
}
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '购物袋', to: '/cart' }, { label: '结算' }]" />

    <PageHead
      no="05"
      eyebrow="CHECKOUT"
      title="结算"
      lead="第一版用的是模拟支付，不会真的扣款。填好地址、确认明细就可以提交。"
    />

    <div v-if="cart.isEmpty" class="empty">
      <p class="muted">购物袋是空的。</p>
      <AppButton tag="RouterLink" to="/shop" variant="line" size="md">去逛陶器</AppButton>
    </div>

    <div v-else class="layout">
      <div class="forms">
        <section class="block">
          <h2 class="block__title"><span class="num">01</span> 收货信息</h2>
          <div class="fields">
            <label class="field">
              <span>收货人</span>
              <input v-model="form.name" type="text" placeholder="姓名" />
            </label>
            <label class="field">
              <span>手机号</span>
              <input v-model="form.phone" type="tel" placeholder="11 位手机号" />
            </label>
            <label class="field">
              <span>省市</span>
              <input v-model="form.city" type="text" placeholder="例如 江西省 景德镇市" />
            </label>
            <label class="field field--full">
              <span>详细地址</span>
              <input v-model="form.detail" type="text" placeholder="街道、门牌号" />
            </label>
            <label class="field field--full">
              <span>备注（可选）</span>
              <input v-model="form.note" type="text" placeholder="例如：希望工作日送达" />
            </label>
          </div>
        </section>

        <section class="block">
          <h2 class="block__title"><span class="num">02</span> 支付方式</h2>
          <div class="pays">
            <label v-for="m in methods" :key="m" class="pay" :class="{ 'is-on': payMethod === m }">
              <input v-model="payMethod" type="radio" :value="m" />
              <span>{{ m }}</span>
            </label>
          </div>
          <p class="hint">真实支付和物流需要后端接入，第一版先跑通流程。</p>
        </section>

        <section class="block">
          <h2 class="block__title"><span class="num">03</span> 商品明细</h2>
          <ul class="items">
            <li v-for="it in cart.items" :key="it.key" class="item">
              <span class="item__name">{{ it.name }}</span>
              <span class="item__spec">{{ it.spec }}</span>
              <span class="item__qty">× {{ it.qty }}</span>
              <span class="item__sum">¥{{ (it.price * it.qty).toFixed(2) }}</span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="summary">
        <p class="eyebrow">TOTAL</p>
        <div class="srow"><span>商品合计</span><span>{{ cart.amountText }}</span></div>
        <div class="srow"><span>运费</span><span>{{ freight === 0 ? '免运费' : `¥${freight.toFixed(2)}` }}</span></div>
        <div class="srow srow--total"><span>应付</span><span>¥{{ total.toFixed(2) }}</span></div>

        <AppButton
          variant="solid"
          size="lg"
          class="summary__btn"
          :disabled="!valid"
          @click="submit"
        >
          提交订单
        </AppButton>

        <p v-if="!valid" class="warn">收货人、手机号、省市、详细地址都要填。</p>
        <p class="summary__note">提交后可在「我的 → 我的订单」里看到，也可以取消。</p>
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
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: var(--s5);
  padding-top: var(--s3);
  align-items: start;
}

.block {
  padding-bottom: var(--s5);
}

.block__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-cn);
  font-size: 19px;
  font-weight: 400;
  letter-spacing: 0.08em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--s3);
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field--full {
  grid-column: 1 / -1;
}

.field span {
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--ink-40);
}

.field input {
  padding: 11px 12px;
  background: var(--paper-4);
  border: 1px solid var(--line);
  font-size: 14px;
  outline: none;
  transition: border-color 260ms var(--ease);
}

.field input:focus {
  border-color: var(--celadon);
}

.pays {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pay {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--ink-60);
  cursor: pointer;
  transition: all 260ms var(--ease);
}

.pay.is-on {
  border-color: var(--celadon);
  color: var(--ink);
  background: rgba(88, 118, 109, 0.06);
}

.pay input {
  accent-color: var(--celadon);
}

.hint {
  margin-top: 12px;
  font-size: var(--fs-micro);
  color: var(--ink-40);
}

.items {
  display: flex;
  flex-direction: column;
}

.item {
  display: grid;
  grid-template-columns: 1fr 1fr 70px 90px;
  gap: var(--s2);
  align-items: center;
  padding-block: 12px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.item__spec {
  color: var(--ink-40);
  font-size: var(--fs-micro);
}

.item__qty,
.item__sum {
  text-align: right;
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

.srow {
  display: flex;
  justify-content: space-between;
  padding-block: 10px;
  font-size: 13px;
  color: var(--ink-60);
  border-bottom: 1px solid var(--line-soft);
}

.srow--total {
  color: var(--ink);
  font-size: 15px;
  border-bottom: 0;
}

.summary__btn {
  width: 100%;
  justify-content: center;
  margin-top: var(--s2);
}

.warn {
  margin-top: 10px;
  font-size: 11px;
  color: var(--clay);
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
  .fields {
    grid-template-columns: 1fr;
  }
  .item {
    grid-template-columns: 1fr auto;
    row-gap: 4px;
  }
  .item__qty {
    text-align: left;
  }
}
</style>
