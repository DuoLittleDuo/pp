<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import { stories } from '@/data/stories'
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '工艺故事' }]" />

    <PageHead
      no="03"
      eyebrow="CRAFT STORIES"
      title="工艺故事"
      lead="不写大段说明文。每一篇只讲一件事：泥为什么裂、柴窑为什么烧三天、一道线为什么试了四个月。"
    />

    <div class="list">
      <article v-for="s in stories" :key="s.slug" class="row">
        <div class="row__img">
          <FigureFrame ratio="3/2" :label="`${s.title} · 配图`" />
        </div>

        <div class="row__text">
          <div class="row__meta">
            <span class="num">{{ s.index }}</span>
            <span class="micro">{{ s.date }}</span>
          </div>
          <h2 class="row__title">{{ s.title }}</h2>
          <p class="row__en">{{ s.en }}</p>
          <p class="row__excerpt">{{ s.excerpt }}</p>
          <RouterLink :to="`/story/${s.slug}`" class="row__more">读这一篇 →</RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.list {
  padding-top: var(--s5);
  display: flex;
  flex-direction: column;
  gap: var(--s6);
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--s5);
  align-items: center;
}

.row:nth-child(even) .row__img {
  order: 2;
}

.row__meta {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s2);
}

.row__title {
  font-family: var(--font-cn);
  font-size: clamp(24px, 2.8vw, 36px);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.row__en {
  margin-top: 8px;
  font-size: 10px;
  letter-spacing: 0.24em;
  color: var(--ink-40);
}

.row__excerpt {
  margin-top: var(--s3);
  color: var(--ink-60);
  line-height: 1.95;
  max-width: 42ch;
}

.row__more {
  display: inline-block;
  margin-top: var(--s3);
  font-size: 13px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 3px;
  transition: border-color 300ms var(--ease);
}

.row__more:hover {
  border-color: var(--ink);
}

@media (max-width: 900px) {
  .row {
    grid-template-columns: 1fr;
    gap: var(--s3);
  }
  .row:nth-child(even) .row__img {
    order: 0;
  }
}
</style>
