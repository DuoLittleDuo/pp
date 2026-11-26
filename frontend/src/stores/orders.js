import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { load, save, makeCode } from '@/utils/storage'

/**
 * 订单
 * 状态流转：待支付 → 已支付/待发货 → 已发货 → 已完成；任一步可取消
 */
export const useOrdersStore = defineStore('orders', () => {
  const list = ref(load('orders', []))

  watch(list, (v) => save('orders', v), { deep: true })

  function create({ items, amount, address, payMethod = '模拟支付' }) {
    const order = {
      id: makeCode('O'),
      code: makeCode('O'),
      createdAt: new Date().toISOString(),
      status: '待支付',
      items: JSON.parse(JSON.stringify(items)),
      amount,
      address: JSON.parse(JSON.stringify(address || {})),
      payMethod,
      paidAt: null,
      shippedAt: null,
      tracking: '',
    }
    list.value.unshift(order)
    return order
  }

  function find(id) {
    return list.value.find((o) => o.id === id || o.code === id)
  }

  function pay(id) {
    const o = find(id)
    if (!o) return
    o.status = '已支付'
    o.paidAt = new Date().toISOString()
  }

  function cancel(id) {
    const o = find(id)
    if (!o) return
    o.status = '已取消'
  }

  function ship(id, tracking = '') {
    const o = find(id)
    if (!o) return
    o.status = '已发货'
    o.shippedAt = new Date().toISOString()
    o.tracking = tracking
  }

  function confirm(id) {
    const o = find(id)
    if (!o) return
    o.status = '已完成'
  }

  return { list, create, find, pay, cancel, ship, confirm }
})
