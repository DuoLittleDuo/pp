import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { load, save } from '@/utils/storage'

/** 收藏：陶器和纹样分开存 */
export const useFavoritesStore = defineStore('favorites', () => {
  const products = ref(load('fav:products', []))
  const patterns = ref(load('fav:patterns', []))

  watch(products, (v) => save('fav:products', v), { deep: true })
  watch(patterns, (v) => save('fav:patterns', v), { deep: true })

  const count = computed(() => products.value.length + patterns.value.length)

  function hasProduct(id) {
    return products.value.includes(id)
  }
  function hasPattern(id) {
    return patterns.value.includes(id)
  }
  function toggleProduct(id) {
    products.value = hasProduct(id)
      ? products.value.filter((x) => x !== id)
      : [...products.value, id]
    return hasProduct(id)
  }
  function togglePattern(id) {
    patterns.value = hasPattern(id)
      ? patterns.value.filter((x) => x !== id)
      : [...patterns.value, id]
    return hasPattern(id)
  }

  return {
    products,
    patterns,
    count,
    hasProduct,
    hasPattern,
    toggleProduct,
    togglePattern,
  }
})
