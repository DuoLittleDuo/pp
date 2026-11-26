<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AppButton from '@/components/AppButton.vue'
import { useOrdersStore } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const orders = useOrdersStore()
const ui = useUiStore()

const order = computed(() => orders.find(route.params.id))

const steps = ['待支付', '已支付', '已发货', '已完成']
const stepIndex = computed(() => {
  if (!order.value) return 0
  if (order.value.status === '已取消') return -1
  const i = steps.indexOf(order.value.status)
  return i < 0 ? 0 : i
})

function fmt(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function pay() {
  orders.pay(order.value.id)
  ui.say('已标记为已支付（模拟）')
}
function cancel() {
  orders.cancel(order.value.id)
  ui.say('订单已取消')
}
function confirm() {
  orders.confirm(order.value.id)
  ui.say('已确认收货')
}
function ship() {
  orders.ship(order.value.id, 'SF' + Date.now().toString().slice(-10))
  ui.say('已模拟发货')
}
</script>

<template>
  <div v-if="order" class="page shell">
    <Breadcrumb
      :items="[
        { label: '我的', to: '/account' },
        { label: '我的订单', to: '/account/orders' },
        { label: order.code },
      ]"
    />

    <header class="head">
      <div>
        <p class="eyebrow">ORDER</p>
        <h1 class="head__code">{{ order.code }}</h1>
        <p class="micro">下单时间 {{ fmt(order.createdAt) }}</p>
      </div>
      <span class="status">{{ order.status }}</span>
    </header>

    <!-- 进度 -->
    <ol v-if="order.status !== '已取消'" class="progress">
      <li
        v-for="(s, i) in steps"
        :key="s"
        class="progress__item"
        :class="{ 'is-done': i <= stepIndex, 'is-now': i === stepIndex }"
      >
        <span class="progress__dot" />
        <span class="progress__label">{{ s }}</span>
      </li>
    </ol>
    <p v-else class="canceled">这一单已取消。</p>

    <div class="grid">
      <section class="block">
        <h2 class="block__title">商品</h2>
        <ul class="items">
          <li v-for="(it, i) in order.items" :key="i" class="item">
            <div>
              <p class="item__name">{{ it.name }}</p>
              <p class="item__spec">{{ it.spec }}</p>
              <p v-if="it.custom" class="item__custom">
                定做配置：{{ it.custom.shapeName }} / {{ it.custom.craftName || it.custom.patternName }} /
                {{ it.custom.color }} / {{ Number(it.custom.scale).toFixed(2) }}×
              </p>
            </div>
            <span class="item__qty">× {{ it.qty }}</span>
            <span class="item__sum">¥{{ (it.price * it.qty).toFixed(2) }}</span>
          </li>
        </ul>

        <div class="total">
          <span>合计</span>
          <span>¥{{ order.amount.toFixed(2) }}</span>
        </div>
      </section>

      <section class="block">
        <h2 class="block__title">收货信息</h2>
        <dl class="info">
          <div><dt>收货人</dt><dd>{{ order.address.name || '—' }}</dd></div>
          <div><dt>手机号</dt><dd>{{ order.address.phone || '—' }}</dd></div>
          <div><dt>地址</dt><dd>{{ order.address.city }} {{ order.address.detail }}</dd></div>
          <div><dt>备注</dt><dd>{{ order.address.note || '无' }}</dd></div>
          <div><dt>支付方式</dt><dd>{{ order.payMethod }}</dd></div>
          <div><dt>物流单号</dt><dd>{{ order.tracking || '—' }}</dd></div>
        </dl>

        <div class="acts">
          <AppButton v-if="order.status === '待支付'" variant="solid" size="sm" @click="pay">
            模拟支付
          </AppButton>
          <AppButton v-if="order.status === '待支付'" variant="line" size="sm" @click="cancel">
            取消订单
          </AppButton>
          <AppButton v-if="order.status === '已支付'" variant="line" size="sm" @click="ship">
            模拟发货
          </AppButton>
          <AppButton v-if="order.status === '已发货'" variant="solid" size="sm" @click="confirm">
            确认收货
          </AppButton>
        </div>

        <p class="note">这些按钮是第一版用来走通流程的模拟操作，正式上线时由后台和支付渠道驱动。</p>
      </section>
    </div>
  </div>

  <div v-else class="page shell">
    <p class="title-cn">没有找到这个订单</p>
    <RouterLink to="/account/orders" class="link">← 回到我的订单</RouterLink>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s3);
  padding-top: var(--s4);
  padding-bottom: var(--s3);
  border-bottom: 1px solid var(--line);
}

.head__code {
  margin-top: 8px;
  font-family: var(--font-cn);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 400;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.status {
  font-size: 12px;
  letter-spacing: 0.12em;
  padding: 5px 14px;
  border: 1px solid var(--line);
  color: var(--ink-60);
}

/* 进度 */
.progress {
  display: flex;
  gap: 0;
  padding-block: var(--s4);
  border-bottom: 1px solid var(--line-soft);
}

.progress__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  color: var(--ink-40);
}

.progress__item::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--line);
}

.progress__dot {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--cream);
  border: 1px solid var(--line);
  z-index: 1;
}

.progress__item.is-done .progress__dot {
  background: var(--celadon);
  border-color: var(--celadon);
}

.progress__item.is-now .progress__label {
  color: var(--ink);
}

.progress__label {
  font-size: 12px;
  letter-spacing: 0.1em;
}

.canceled {
  padding-block: var(--s3);
  color: var(--clay);
  font-size: 14px;
  border-bottom: 1px solid var(--line-soft);
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--s5);
  padding-top: var(--s4);
}

.block__title {
  font-family: var(--font-cn);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.08em;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--s3);
}

.items li {
  display: grid;
  grid-template-columns: 1fr 50px 90px;
  gap: var(--s2);
  align-items: baseline;
  padding-block: 12px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.item__name {
  font-family: var(--font-cn);
  font-size: 15px;
  letter-spacing: 0.04em;
}

.item__spec {
  margin-top: 4px;
  font-size: var(--fs-micro);
  color: var(--ink-40);
}

.item__custom {
  margin-top: 6px;
  font-size: 11px;
  color: var(--celadon-deep);
  line-height: 1.7;
}

.item__qty,
.item__sum {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.total {
  display: flex;
  justify-content: space-between;
  padding-top: var(--s3);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.info div {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: var(--s2);
  padding-block: 10px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.info dt {
  color: var(--ink-40);
  letter-spacing: 0.1em;
}

.info dd {
  margin: 0;
}

.acts {
  margin-top: var(--s3);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.note {
  margin-top: var(--s3);
  font-size: var(--fs-micro);
  line-height: 1.8;
  color: var(--ink-40);
}

.link {
  font-size: 13px;
  color: var(--ink-60);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
}
</style>
