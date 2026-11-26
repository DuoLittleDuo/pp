import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { load, save, makeCode } from '@/utils/storage'

/**
 * 我的定做
 * 一份方案 = 器型 + 纹样 + 颜色 + 位置/缩放/旋转 + 当时的报价
 * 下单时会把整份配置快照写进订单，保证商家能按原方案做
 */
export const useDesignsStore = defineStore('designs', () => {
  const list = ref(load('designs', []))

  watch(list, (v) => save('designs', v), { deep: true })

  function saveDesign(config) {
    const row = {
      id: makeCode('D'),
      createdAt: new Date().toISOString(),
      ...JSON.parse(JSON.stringify(config)),
    }
    list.value.unshift(row)
    return row
  }

  function remove(id) {
    list.value = list.value.filter((d) => d.id !== id)
  }

  function find(id) {
    return list.value.find((d) => d.id === id)
  }

  return { list, saveDesign, remove, find }
})
