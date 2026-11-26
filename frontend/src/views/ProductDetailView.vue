<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import AppButton from '@/components/AppButton.vue'
import { findProduct, products, categories, categoryColor } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const fav = useFavoritesStore()
const ui = useUiStore()

const product = computed(() => findProduct(route.params.id))
const qty = ref(1)
const view = ref(0)

const gallery = computed(() => product.value?.images || [])
const soldOut = computed(() => product.value?.stock === 0)

const related = computed(() => {
  if (!product.value) return []
  return products
    .filter((p) => p.categoryCode === product.value.categoryCode && p.id !== product.value.id)
    .slice(0, 3)
})

const catInfo = computed(() =>
  categories.find((c) => c.code === product.value?.categoryCode)
)

function addToCart(goCheckout = false) {
  if (!product.value) return
  cart.add({
    productId: product.value.id,
    name: product.value.name,
    sku: product.value.sku,
    price: product.value.price,
    qty: qty.value,
    spec: `${product.value.glaze} · ${product.value.size}`,
    image: product.value.images[0] || '',
    custom: null,
  })
  ui.say(`已放进购物袋：${product.value.name}`)
  if (goCheckout) router.push('/checkout')
}
</script>

<template>
  <div v-if="product" class="page shell">
    <Breadcrumb
      :items="[
        { label: '逛陶器', to: '/shop' },
        { label: product.categoryShort },
        { label: product.usage || product.name },
      ]"
    />

    <div class="detail">
      <!-- 左：图片 -->
      <div class="gallery">
        <div class="gallery__main">
          <FigureFrame
            :src="gallery[view]"
            :ratio="product.ratio"
            :label="product.name"
            :caption="`${product.sku} · 0${view + 1} / 0${Math.max(gallery.length, 1)}`"
          />
        </div>

        <div v-if="gallery.length > 1" class="gallery__thumbs">
          <button
            v-for="(src, i) in gallery"
            :key="i"
            type="button"
            class="thumb"
            :class="{ 'is-on': i === view }"
            @click="view = i"
          >
            <FigureFrame :src="src" ratio="1/1" :label="product.name" />
          </button>
        </div>
      </div>

      <!-- 右：购买 -->
      <div class="buy">
        <p class="buy__cat">
          <span
            class="buy__cat-tag"
            :style="{ background: categoryColor[product.categoryCode] }"
          >
            {{ product.category }}
          </span>
          <span class="eyebrow">{{ product.craft }}</span>
        </p>
        <h1 class="buy__name">{{ product.name }}</h1>
        <p class="buy__code micro">编号 {{ product.sku }}</p>

        <p class="buy__price">¥{{ product.price }}</p>
        <p class="buy__intro">{{ product.intro }}</p>

        <dl class="specs">
          <div class="spec"><dt>类目</dt><dd>{{ product.category }}</dd></div>
          <div class="spec"><dt>工艺</dt><dd>{{ product.craft }}</dd></div>
          <div class="spec"><dt>釉色</dt><dd>{{ product.glaze }}</dd></div>
          <div class="spec"><dt>尺寸</dt><dd>{{ product.size }}</dd></div>
          <div v-if="product.capacity !== '—'" class="spec">
            <dt>容量</dt><dd>{{ product.capacity }}</dd>
          </div>
          <div class="spec"><dt>材质</dt><dd>{{ product.material }}</dd></div>
          <div class="spec"><dt>烧成</dt><dd>{{ product.process }}</dd></div>
          <div class="spec">
            <dt>库存</dt>
            <dd>{{ product.stock > 0 ? `${product.stock} 件` : '暂时售罄' }}</dd>
          </div>
          <div class="spec"><dt>发货</dt><dd>{{ product.leadTime }}</dd></div>
        </dl>

        <div class="qty">
          <span class="qty__label">数量</span>
          <div class="stepper">
            <button type="button" :disabled="qty <= 1" @click="qty--">−</button>
            <span>{{ qty }}</span>
            <button type="button" :disabled="soldOut" @click="qty++">+</button>
          </div>
        </div>

        <div class="acts">
          <AppButton variant="solid" size="lg" :disabled="soldOut" @click="addToCart(false)">
            {{ soldOut ? '暂时售罄' : '放进购物袋' }}
          </AppButton>
          <AppButton variant="line" size="lg" :disabled="soldOut" @click="addToCart(true)">
            立即购买
          </AppButton>
          <button class="fav" type="button" @click="fav.toggleProduct(product.id)">
            {{ fav.hasProduct(product.id) ? '♥ 已收藏' : '♡ 收藏' }}
          </button>
        </div>

        <RouterLink v-if="product.customizable" to="/customize" class="custom-link">
          这件可以定做 · 刻名字或换纹样 →
        </RouterLink>

        <p class="buy__note">
          手作器物，实物的釉色与尺寸会有细微差异。可以进洗碗机，不建议进微波炉。
        </p>
      </div>
    </div>

    <!-- 下方 -->
    <div class="lower">
      <section class="block">
        <p class="eyebrow">STORY</p>
        <h2 class="block__title">这件是怎么来的</h2>
        <p class="block__text">{{ product.story }}</p>
      </section>

      <section class="block">
        <p class="eyebrow">DETAILS</p>
        <h2 class="block__title">尺寸与材质</h2>
        <ul class="list">
          <li><span>尺寸</span><span>{{ product.size }}</span></li>
          <li><span>容量</span><span>{{ product.capacity }}</span></li>
          <li><span>材质</span><span>{{ product.material }}</span></li>
          <li><span>烧成</span><span>{{ product.process }}</span></li>
          <li><span>产地</span><span>景德镇 · 工作室手作</span></li>
        </ul>
      </section>

      <section class="block">
        <p class="eyebrow">CARE</p>
        <h2 class="block__title">使用与配送</h2>
        <p class="block__text">{{ product.note }}</p>
        <ul class="list">
          <li><span>发货</span><span>{{ product.leadTime }}</span></li>
          <li><span>包装</span><span>双层珍珠棉 + 硬纸盒，易碎件单独加固</span></li>
          <li><span>售后</span><span>运输破损可换新，7 天内可申请</span></li>
        </ul>
      </section>
    </div>

    <section v-if="related.length" class="also">
      <div class="also__head">
        <p class="eyebrow">ALSO IN {{ catInfo?.en }}</p>
        <h2 class="block__title">同类目</h2>
      </div>
      <div class="also__grid">
        <RouterLink v-for="p in related" :key="p.id" :to="`/shop/${p.id}`" class="also__item">
          <FigureFrame :src="p.thumb || p.images[0]" :ratio="p.ratio" :label="p.name" hover />
          <p class="also__name">{{ p.name }}</p>
          <p class="micro">¥{{ p.price }}</p>
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="page shell notfound">
    <p class="title-cn">没有找到这件器物</p>
    <RouterLink to="/shop" class="link">← 回到逛陶器</RouterLink>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.detail {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: var(--s5);
  margin-top: var(--s4);
}

.gallery__thumbs {
  margin-top: var(--s2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s2);
}

.thumb {
  border: 1px solid transparent;
  padding: 3px;
  opacity: 0.6;
  transition: border-color 260ms var(--ease), opacity 260ms var(--ease);
}

.thumb.is-on,
.thumb:hover {
  border-color: var(--line);
  opacity: 1;
}

.gallery__hint {
  margin-top: 10px;
  letter-spacing: 0.06em;
}

.buy {
  position: sticky;
  top: calc(var(--nav-h) + var(--s3));
  align-self: start;
  padding-top: var(--s2);
}

.buy__cat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buy__cat-tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #fff;
  padding: 2px 9px;
  border-radius: 2px;
}

.buy__name {
  margin-top: 8px;
  font-family: var(--font-cn);
  font-size: clamp(24px, 2.6vw, 34px);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.35;
}

.buy__code {
  margin-top: 6px;
  letter-spacing: 0.12em;
}

.buy__price {
  margin-top: var(--s3);
  font-size: 22px;
  font-variant-numeric: tabular-nums;
}

.buy__intro {
  margin-top: var(--s3);
  color: var(--ink-60);
  line-height: 1.9;
}

.specs {
  margin-top: var(--s3);
  border-top: 1px solid var(--line-soft);
}

.spec {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: var(--s2);
  padding-block: 9px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.spec dt {
  color: var(--ink-40);
  letter-spacing: 0.1em;
}

.spec dd {
  margin: 0;
  color: var(--ink);
  text-align: right;
}

.qty {
  margin-top: var(--s3);
  display: flex;
  align-items: center;
  gap: var(--s3);
}

.qty__label {
  font-size: 13px;
  color: var(--ink-40);
  letter-spacing: 0.1em;
}

.stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
}

.stepper button {
  width: 36px;
  height: 36px;
  font-size: 15px;
  color: var(--ink-60);
}

.stepper button:disabled {
  opacity: 0.3;
}

.stepper span {
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.acts {
  margin-top: var(--s4);
  display: flex;
  align-items: center;
  gap: var(--s2);
  flex-wrap: wrap;
}

.fav {
  font-size: 13px;
  color: var(--ink-60);
  letter-spacing: 0.06em;
  padding: 8px;
}

.fav:hover {
  color: var(--clay);
}

.custom-link {
  display: inline-block;
  margin-top: var(--s3);
  font-size: 13px;
  color: var(--celadon-deep);
  border-bottom: 1px solid var(--line);
  padding-bottom: 3px;
}

.buy__note {
  margin-top: var(--s3);
  font-size: var(--fs-micro);
  color: var(--ink-40);
  line-height: 1.8;
}

.lower {
  margin-top: var(--s7);
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: var(--s5);
}

.block__title {
  margin-top: 10px;
  margin-bottom: var(--s2);
  font-family: var(--font-cn);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.block__text {
  color: var(--ink-60);
  line-height: 1.95;
  font-size: 14px;
}

.list {
  margin-top: var(--s2);
}

.list li {
  display: flex;
  justify-content: space-between;
  gap: var(--s2);
  padding-block: 10px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.list li span:first-child {
  color: var(--ink-40);
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.list li span:last-child {
  text-align: right;
}

.also {
  margin-top: var(--s7);
  padding-top: var(--s4);
  border-top: 1px solid var(--line);
}

.also__grid {
  margin-top: var(--s4);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s3);
}

.also__name {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 15px;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.notfound {
  padding-top: calc(var(--nav-h) + var(--s6));
  display: flex;
  flex-direction: column;
  gap: var(--s3);
  align-items: flex-start;
}

.link {
  font-size: 13px;
  color: var(--ink-60);
}

@media (max-width: 1023px) {
  .detail {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
  .buy {
    position: static;
  }
  .lower {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
  .also__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
