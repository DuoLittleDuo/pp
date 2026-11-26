<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import { useOrdersStore } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const orders = useOrdersStore()
const ui = useUiStore()

const ok = computed(() => route.query.ok !== '0')
const order = computed(() => orders.find(route.query.order))

onMounted(() => {
  // 模拟支付：进到这个页面就把订单标成已支付
  if (ok.value && order.value && order.value.status === '待支付') {
    orders.pay(order.value.id)
  }
  // 让右下角的垚垚欢呼一下
  ui.playAgent(ok.value ? 'cheer' : 'thinking', true)
})
</script>

<template>
  <div class="page shell">
    <div class="card">
      <p class="eyebrow">{{ ok ? 'PAYMENT COMPLETE' : 'PAYMENT FAILED' }}</p>

      <h1 class="title">
        {{ ok ? '下单了' : '支付没有完成' }}
      </h1>

      <p class="lead">
        {{
          ok
            ? '这是模拟支付，没有真的扣款。订单已经记在「我的订单」里，可以随时取消。'
            : '订单还在，可以回到订单详情重新支付，或者取消。'
        }}
      </p>

      <dl v-if="order" class="info">
        <div><dt>订单号</dt><dd>{{ order.code }}</dd></div>
        <div><dt>金额</dt><dd>¥{{ order.amount.toFixed(2) }}</dd></div>
        <div><dt>状态</dt><dd>{{ order.status }}</dd></div>
      </dl>

      <div class="acts">
        <AppButton tag="RouterLink" to="/account/orders" variant="solid" size="md">
          看我的订单
        </AppButton>
        <AppButton tag="RouterLink" to="/shop" variant="text" size="md">
          继续逛
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: calc(var(--nav-h) + var(--s6));
  display: grid;
  place-items: center;
  min-height: 72vh;
}

.card {
  max-width: 560px;
  width: 100%;
  padding: var(--s5) var(--s4);
  border: 1px solid var(--line);
  background: var(--paper-4);
  text-align: center;
}

.title {
  margin-top: var(--s2);
  font-family: var(--font-cn);
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 400;
  letter-spacing: 0.06em;
}

.lead {
  margin-top: var(--s3);
  color: var(--ink-60);
  line-height: 1.95;
}

.info {
  margin-top: var(--s4);
  text-align: left;
  border-top: 1px solid var(--line-soft);
}

.info div {
  display: flex;
  justify-content: space-between;
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
  font-variant-numeric: tabular-nums;
}

.acts {
  margin-top: var(--s4);
  display: flex;
  justify-content: center;
  gap: var(--s3);
  flex-wrap: wrap;
}
</style>
