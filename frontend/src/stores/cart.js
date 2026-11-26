import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save, money } from '@/utils/storage'

/**
 * 购物袋
 * 每一项：{ key, productId, name, en, price, qty, spec, custom, image }
 * custom 为定做配置快照（null 表示普通商品）
 */
export const useCartStore = defineStore('cart', () => {
  const items = ref(load('cart', []))

  watch(items, (v) => save('cart', v), { deep: true })

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const amount = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.qty, 0)
  )
  const amountText = computed(() => money(amount.value))
  const isEmpty = computed(() => items.value.length === 0)

  function add(item) {
    // 同商品 + 同规格 + 同定做配置 → 合并数量
    const same = items.value.find(
      (i) =>
        i.productId === item.productId &&
        i.spec === item.spec &&
        JSON.stringify(i.custom || null) === JSON.stringify(item.custom || null)
    )
    if (same) {
      same.qty += item.qty || 1
      return same
    }
    const key =
      item.key ||
      `${item.productId}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`
    const row = { qty: 1, ...item, key }
    items.value.push(row)
    return row
  }

  function setQty(key, qty) {
    const row = items.value.find((i) => i.key === key)
    if (!row) return
    row.qty = Math.max(1, Math.min(99, Number(qty) || 1))
  }

  function removeItem(key) {
    items.value = items.value.filter((i) => i.key !== key)
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    count,
    amount,
    amountText,
    isEmpty,
    add,
    setQty,
    removeItem,
    clear,
  }
})
