<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import AppButton from '@/components/AppButton.vue'
import { crafts, findCraft, worksOf } from '@/data/patterns'

const route = useRoute()
const craft = computed(() => findCraft(route.params.id))
const works = computed(() => (craft.value ? worksOf(craft.value) : []))

const others = computed(() =>
  crafts.filter((c) => c.id !== route.params.id).slice(0, 3)
)
</script>

<template>
  <div v-if="craft" class="page shell">
    <Breadcrumb
      :items="[{ label: '纹样库', to: '/patterns' }, { label: craft.name }]"
    />

    <div class="top">
      <div class="top__img">
        <FigureFrame
          :src="craft.image"
          ratio="1/1"
          :label="`${craft.name} · 图案待补`"
          caption="图案 / 待补"
        />
      </div>

      <div class="top__info">
        <p class="eyebrow">{{ craft.en }}</p>
        <h1 class="top__name">{{ craft.name }}</h1>
        <p class="top__tagline">{{ craft.tagline }}</p>

        <div class="block">
          <p class="block__label">怎么做出来的</p>
          <p class="block__text">{{ craft.what }}</p>
        </div>

        <div class="block">
          <p class="block__label">意思</p>
          <p class="block__text">{{ craft.meaning }}</p>
        </div>

        <div class="block">
          <p class="block__label">适合的器物</p>
          <div class="tags">
            <span v-for="s in craft.shapes" :key="s" class="tag">{{ s }}</span>
          </div>
        </div>

        <div class="block">
          <p class="block__label">常见釉色</p>
          <div class="tags">
            <span v-for="c in craft.colors" :key="c" class="tag">{{ c }}</span>
          </div>
        </div>

        <div class="block">
          <p class="block__label">要注意</p>
          <p class="block__text">{{ craft.care }}</p>
        </div>

        <div class="acts">
          <AppButton tag="RouterLink" to="/customize" variant="solid" size="md">
            拿去做定做
            <template #arrow>→</template>
          </AppButton>
          <AppButton tag="RouterLink" to="/shop" variant="text" size="md">
            先看看成品
          </AppButton>
        </div>
      </div>
    </div>

    <!-- 用了这种工艺的作品 -->
    <section v-if="works.length" class="works">
      <div class="works__head">
        <p class="eyebrow">MADE WITH {{ craft.en }}</p>
        <h2 class="works__title">用这种工艺做的 {{ works.length }} 件</h2>
      </div>

      <div class="works__grid">
        <RouterLink v-for="p in works" :key="p.id" :to="`/shop/${p.id}`" class="work">
          <FigureFrame :src="p.thumb || p.images[0]" :ratio="p.ratio" :label="p.name" hover />
          <p class="work__name">{{ p.name }}</p>
          <p class="micro">¥{{ p.price }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="others">
      <p class="eyebrow">OTHER CRAFTS</p>
      <div class="others__grid">
        <RouterLink v-for="c in others" :key="c.id" :to="`/patterns/${c.id}`" class="other">
          <FigureFrame :src="c.image" ratio="1/1" :label="c.name" hover />
          <p class="other__name">{{ c.name }}</p>
          <p class="micro">{{ c.en }}</p>
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="page shell">
    <p class="title-cn">没有找到这个工艺</p>
    <RouterLink to="/patterns" class="link">← 回到纹样库</RouterLink>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: var(--s5);
  margin-top: var(--s4);
  align-items: start;
}

.top__img {
  position: sticky;
  top: calc(var(--nav-h) + var(--s3));
}

.top__name {
  margin-top: 8px;
  font-family: var(--font-cn);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  letter-spacing: 0.08em;
}

.top__tagline {
  margin-top: var(--s2);
  font-family: var(--font-cn);
  font-size: 17px;
  color: var(--ink-60);
  letter-spacing: 0.04em;
}

.block {
  margin-top: var(--s4);
  padding-top: var(--s3);
  border-top: 1px solid var(--line-soft);
}

.block__label {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: var(--ink-40);
  margin-bottom: 8px;
}

.block__text {
  color: var(--ink-60);
  line-height: 1.95;
  font-size: 14.5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  border: 1px solid var(--line);
  color: var(--ink-60);
}

.acts {
  margin-top: var(--s4);
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

/* 作品 */
.works {
  margin-top: var(--s7);
  padding-top: var(--s4);
  border-top: 1px solid var(--line);
}

.works__title {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.works__grid {
  margin-top: var(--s4);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s4) var(--s3);
}

.work__name {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 15px;
  letter-spacing: 0.04em;
  line-height: 1.45;
}

/* 其它工艺 */
.others {
  margin-top: var(--s6);
  padding-top: var(--s4);
  border-top: 1px solid var(--line-soft);
}

.others__grid {
  margin-top: var(--s3);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s3);
}

.other__name {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 16px;
  letter-spacing: 0.06em;
}

.link {
  font-size: 13px;
  color: var(--ink-60);
}

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
  }
  .top__img {
    position: static;
  }
  .works__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .others__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
