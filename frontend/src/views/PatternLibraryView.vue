<script setup>
import { computed, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import { crafts, countOf } from '@/data/patterns'

const active = ref('')

const list = computed(() =>
  active.value ? crafts.filter((c) => c.id === active.value) : crafts
)
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '纹样库' }]" />

    <PageHead
      no="02"
      eyebrow="PATTERNS & CRAFT"
      title="纹样库"
      lead="先按工艺分六类。每一类写了它怎么做、为什么是这个样子、适合放在哪些器物上。具体图案还在整理，之后会一张张贴上来。"
    />

    <div class="filters">
      <button type="button" class="chip" :class="{ 'is-on': active === '' }" @click="active = ''">
        全部 {{ crafts.length }}
      </button>
      <button
        v-for="c in crafts"
        :key="c.id"
        type="button"
        class="chip"
        :class="{ 'is-on': active === c.id }"
        :style="active === c.id ? { background: c.color, borderColor: c.color } : null"
        @click="active = active === c.id ? '' : c.id"
      >
        {{ c.name }}
      </button>
    </div>

    <div class="grid">
      <article
        v-for="c in list"
        :key="c.id"
        class="card"
        :style="{ '--craft': c.color, '--craft-field': c.field }"
      >
        <RouterLink :to="`/patterns/${c.id}`" class="card__link">
          <!-- 有图就显示图；没图就用工艺色做一块版式，比空框有设计感 -->
          <FigureFrame
            v-if="c.image"
            :src="c.image"
            ratio="1/1"
            :label="c.name"
            hover
          />
          <div
            v-else
            class="card__plate"
            :style="{ '--plate': c.color }"
            :aria-label="`${c.name} · 图案待补`"
          >
            <span class="card__plate-en">{{ c.en }}</span>
            <span class="card__plate-cn">{{ c.name }}</span>
            <span class="card__plate-note">图案待补</span>
          </div>

          <div class="card__row">
            <h3 class="card__name">{{ c.name }}</h3>
            <span class="card__count" :style="{ background: c.color }">
              {{ countOf(c) }} 件
            </span>
          </div>
          <p class="card__en">{{ c.en }}</p>
          <p class="card__tagline">{{ c.tagline }}</p>
        </RouterLink>

        <div class="card__foot">
          <span class="tag">适合 {{ c.shapes.join(' / ') }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: var(--s4);
  padding-bottom: var(--s3);
  border-bottom: 1px solid var(--line);
}

.chip {
  font-size: 12px;
  padding: 6px 14px;
  border: 1px solid var(--line);
  color: var(--ink-60);
  letter-spacing: 0.06em;
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

.grid {
  margin-top: var(--s4);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--s5) var(--s3);
}

.card {
  position: relative;
  padding: var(--s3);
  padding-top: var(--s4);
  background: var(--craft-field, transparent);
  transition: background-color 400ms var(--ease);
}

/* 没图时用工艺色做的版式块 */
.card__plate {
  position: relative;
  aspect-ratio: 1 / 1;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 8px;
  background: var(--plate);
  background-image: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 255, 255, 0) 46%,
    rgba(0, 0, 0, 0.16) 100%
  );
  color: #fff;
  overflow: hidden;
  transition: transform 900ms var(--ease);
}

.card__plate::after {
  content: '';
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  pointer-events: none;
}

.card__plate-en {
  font-size: 9px;
  letter-spacing: 0.3em;
  opacity: 0.85;
}

.card__plate-cn {
  font-family: var(--font-cn);
  font-size: clamp(22px, 2vw, 30px);
  letter-spacing: 0.16em;
  writing-mode: vertical-rl;
  line-height: 1.5;
}

.card__plate-note {
  font-size: 9px;
  letter-spacing: 0.18em;
  opacity: 0.7;
}

.card:hover .card__plate {
  transform: scale(1.02);
}

/* 每张卡顶部一道工艺色 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--craft, var(--clay));
}

.card__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}

.card__name {
  font-family: var(--font-cn);
  font-size: 19px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--craft, var(--ink));
}

.card__count {
  font-size: 10px;
  color: #fff;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  font-variant-numeric: tabular-nums;
}

.card__en {
  margin-top: 2px;
  font-size: 9px;
  letter-spacing: 0.22em;
  color: var(--ink-40);
}

.card__tagline {
  margin-top: 10px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--ink-60);
}

.card__foot {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
}

.tag {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ink-40);
}

.note {
  margin-top: var(--s6);
  padding-top: var(--s3);
  border-top: 1px solid var(--line-soft);
  font-size: var(--fs-micro);
  line-height: 1.9;
  color: var(--ink-40);
}

.note code {
  font-family: ui-monospace, Consolas, monospace;
  font-size: 11px;
  padding: 1px 5px;
  background: var(--cream-2);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
