<script setup>
import { computed, ref } from 'vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import SkyCanopy from '@/components/SkyCanopy.vue'
import { products, categoryList, categoryColor } from '@/data/products'
import { useFavoritesStore } from '@/stores/favorites'

const fav = useFavoritesStore()

const cat = ref('')
const onlyCustom = ref(false)
const onlySame = ref(false)
const sort = ref('推荐')

const sorts = ['推荐', '价格从低到高', '价格从高到低', '有货优先']

const filtered = computed(() => {
  let list = products.slice()
  if (cat.value) list = list.filter((p) => p.categoryCode === cat.value)
  if (onlyCustom.value) list = list.filter((p) => p.customizable)
  if (onlySame.value) list = list.filter((p) => p.tags.includes('人宠同系'))

  if (sort.value === '价格从低到高') list.sort((a, b) => a.price - b.price)
  else if (sort.value === '价格从高到低') list.sort((a, b) => b.price - a.price)
  else if (sort.value === '有货优先') list.sort((a, b) => b.stock - a.stock)

  return list
})

const activeCount = computed(
  () => (cat.value ? 1 : 0) + (onlyCustom.value ? 1 : 0) + (onlySame.value ? 1 : 0)
)

function reset() {
  cat.value = ''
  onlyCustom.value = false
  onlySame.value = false
}
</script>

<template>
  <div class="shop-page">
    <SkyCanopy height="40vh">
      <div class="shell canopy-inner">
        <Breadcrumb :items="[{ label: '逛陶器' }]" />
        <p class="canopy-word">SHOP</p>
      </div>
    </SkyCanopy>

    <div class="page shell">
    <Breadcrumb :items="[{ label: '逛陶器' }]" />

    <PageHead
      no="01"
      eyebrow="SHOP · ALL PIECES"
      title="逛陶器"
      lead="食盆、水碗、挂牌、摆件、纪念罐，五个类目一共 35 件。都是陶，手作，每件会有差异。"
    />

    <div class="body">
      <aside class="side">
        <div class="side__top">
          <span class="eyebrow">筛选</span>
          <button v-if="activeCount" class="reset" type="button" @click="reset">
            清除 ({{ activeCount }})
          </button>
        </div>

        <div class="group">
          <p class="group__title">类目</p>
          <div class="chips">
            <button
              v-for="c in categoryList"
              :key="c.code"
              type="button"
              class="chip"
              :class="{ 'is-on': cat === c.code }"
              :style="cat === c.code ? { background: c.color, borderColor: c.color } : null"
              @click="cat = cat === c.code ? '' : c.code"
            >
              {{ c.short }}
            </button>
          </div>
        </div>

        <div class="group">
          <p class="group__title">条件</p>
          <label class="check">
            <input v-model="onlyCustom" type="checkbox" />
            <span>只看能定做的</span>
          </label>
          <label class="check">
            <input v-model="onlySame" type="checkbox" />
            <span>只看人宠同系</span>
          </label>
        </div>

        <div class="group">
          <p class="group__title">说明</p>
          <p class="small">
            手作器物会有色差和尺寸差异。定做类约 7–15 天，现货 3 天内发出。
          </p>
        </div>
      </aside>

      <div class="main">
        <div class="bar">
          <p class="micro">共 {{ filtered.length }} 件</p>
          <div class="sorts">
            <button
              v-for="s in sorts"
              :key="s"
              type="button"
              class="sort"
              :class="{ 'is-on': sort === s }"
              @click="sort = s"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <div v-if="filtered.length" class="grid">
          <article v-for="p in filtered" :key="p.id" class="card">
            <RouterLink :to="`/shop/${p.id}`" class="card__link">
              <div class="card__img">
                <FigureFrame
                  :src="p.thumb || p.images[0]"
                  :ratio="p.ratio"
                  :label="p.name"
                  hover
                />
                <span v-if="p.stock === 0" class="card__sold">售罄</span>
                <span v-else-if="p.tags.includes('人宠同系')" class="card__tag">
                  人宠同系
                </span>
              </div>

              <div class="card__row">
                <h3 class="card__name">{{ p.name }}</h3>
                <span class="card__price">¥{{ p.price }}</span>
              </div>
              <p class="card__meta">
                <span class="card__cat" :style="{ background: categoryColor[p.categoryCode] }">
                  {{ p.categoryShort }}
                </span>
                {{ p.sku }}
              </p>
            </RouterLink>

            <button
              class="card__fav"
              type="button"
              :aria-label="fav.hasProduct(p.id) ? '取消收藏' : '收藏'"
              @click="fav.toggleProduct(p.id)"
            >
              <span :class="{ 'is-on': fav.hasProduct(p.id) }">
                {{ fav.hasProduct(p.id) ? '已收藏' : '收藏' }}
              </span>
            </button>
          </article>
        </div>

        <p v-else class="empty">这个条件下暂时没有器物。试试清除筛选。</p>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-page {
  position: relative;
}

.canopy-inner {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--s2);
  padding-bottom: var(--s3);
}

.canopy-word {
  font-family: var(--font-display);
  font-size: clamp(64px, 13vw, 200px);
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.05em;
  color: var(--ink);
  margin: 0;
  margin-bottom: -0.12em;
}

.page {
  padding-top: var(--s4);
}

/* ---------- 主体 ---------- */
.body {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: var(--s5);
  padding-top: var(--s4);
}

.side {
  position: sticky;
  top: calc(var(--nav-h) + var(--s3));
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  padding-right: var(--s3);
  border-right: 1px solid var(--line-soft);
}

.side__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reset {
  font-size: 11px;
  color: var(--clay);
  letter-spacing: 0.06em;
}

.group__title {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--ink-60);
  margin-bottom: 10px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-size: 12px;
  padding: 5px 12px;
  border: 1px solid var(--line);
  color: var(--ink-60);
  transition: all 260ms var(--ease);
}

.chip:hover {
  border-color: var(--ink-40);
  color: var(--ink);
}

.chip.is-on {
  background: var(--celadon);
  border-color: var(--celadon);
  color: var(--cream);
}

.card__cat {
  display: inline-block;
  padding: 1px 7px;
  margin-right: 7px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #fff;
  border-radius: 2px;
  vertical-align: 1px;
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-60);
  cursor: pointer;
  margin-bottom: 8px;
}

.check input {
  accent-color: var(--celadon);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  padding-bottom: var(--s2);
  border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
}

.sorts {
  display: flex;
  gap: var(--s3);
  flex-wrap: wrap;
}

.sort {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ink-40);
  transition: color 260ms var(--ease);
}

.sort.is-on,
.sort:hover {
  color: var(--ink);
}

.grid {
  margin-top: var(--s4);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s5) var(--s3);
}

.card {
  position: relative;
}

.card__img {
  position: relative;
}

.card__sold,
.card__tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 9px;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.card__sold {
  background: var(--ink);
  color: var(--cream);
}

.card__tag {
  background: rgba(221, 178, 119, 0.94);
  color: var(--clay);
}

.card__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s2);
  margin-top: 12px;
}

.card__name {
  font-family: var(--font-cn);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.card__price {
  font-size: 13px;
  color: var(--ink-60);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.card__meta {
  margin-top: 4px;
  font-size: var(--fs-micro);
  color: var(--ink-40);
  letter-spacing: 0.06em;
}

.card__fav {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  background: rgba(231, 196, 145, 0.9);
  color: var(--ink-60);
  opacity: 0;
  transition: opacity 260ms var(--ease), color 260ms var(--ease);
}

.card:hover .card__fav {
  opacity: 1;
}

.card__fav .is-on {
  color: var(--clay);
}

.empty {
  padding: var(--s6) 0;
  color: var(--ink-40);
  font-size: 14px;
}

@media (max-width: 1023px) {
  .body {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
  .side {
    position: static;
    border-right: 0;
    border-bottom: 1px solid var(--line-soft);
    padding-right: 0;
    padding-bottom: var(--s3);
  }
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .card__fav {
    opacity: 1;
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
