<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import { findStory, stories } from '@/data/stories'

const route = useRoute()
const story = computed(() => findStory(route.params.slug))
const next = computed(() => {
  if (!story.value) return null
  const i = stories.findIndex((s) => s.slug === story.value.slug)
  return stories[(i + 1) % stories.length]
})
</script>

<template>
  <article v-if="story" class="page shell">
    <Breadcrumb
      :items="[{ label: '工艺故事', to: '/story' }, { label: story.title }]"
    />

    <header class="head">
      <div class="head__meta">
        <span class="num">{{ story.index }}</span>
        <span class="micro">{{ story.date }}</span>
      </div>
      <h1 class="head__title">{{ story.title }}</h1>
      <p class="head__en">{{ story.en }}</p>
      <p class="head__excerpt">{{ story.excerpt }}</p>
    </header>

    <div class="cover">
      <FigureFrame ratio="16/9" label="题图 · 工作室摄影" caption="摄影 / 待补" />
    </div>

    <div class="body">
      <div class="body__aside">
        <p class="eyebrow">CONTENTS</p>
        <ol class="toc">
          <li v-for="(s, i) in story.sections" :key="s.heading">
            <span class="num">0{{ i + 1 }}</span>
            <span>{{ s.heading }}</span>
          </li>
        </ol>
      </div>

      <div class="body__main">
        <section v-for="(s, i) in story.sections" :key="s.heading" class="sec">
          <span class="num">0{{ i + 1 }}</span>
          <h2 class="sec__title">{{ s.heading }}</h2>
          <p class="sec__text">{{ s.body }}</p>
          <div v-if="i % 2 === 0" class="sec__img">
            <FigureFrame ratio="3/2" :label="`${s.heading} · 配图`" />
          </div>
        </section>
      </div>
    </div>

    <nav v-if="next" class="next">
      <p class="eyebrow">NEXT</p>
      <RouterLink :to="`/story/${next.slug}`" class="next__link">
        <span class="next__title">{{ next.title }}</span>
        <span class="next__arrow">→</span>
      </RouterLink>
    </nav>
  </article>

  <div v-else class="page shell">
    <p class="title-cn">没有找到这一篇</p>
    <RouterLink to="/story" class="link">← 回到工艺故事</RouterLink>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.head {
  max-width: 780px;
  padding-top: var(--s5);
  padding-bottom: var(--s4);
}

.head__meta {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s3);
}

.head__title {
  font-family: var(--font-cn);
  font-size: clamp(32px, 4.6vw, 60px);
  font-weight: 400;
  line-height: 1.24;
  letter-spacing: 0.03em;
}

.head__en {
  margin-top: var(--s2);
  font-size: 10px;
  letter-spacing: 0.26em;
  color: var(--ink-40);
}

.head__excerpt {
  margin-top: var(--s3);
  color: var(--ink-60);
  line-height: 1.95;
  font-size: 15px;
}

.cover {
  margin-top: var(--s3);
}

.body {
  margin-top: var(--s6);
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: var(--s5);
  align-items: start;
}

.body__aside {
  position: sticky;
  top: calc(var(--nav-h) + var(--s4));
}

.toc {
  margin-top: var(--s3);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toc li {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--ink-60);
  letter-spacing: 0.06em;
}

.body__main {
  max-width: 640px;
}

.sec {
  padding-bottom: var(--s5);
}

.sec__title {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.sec__text {
  margin-top: var(--s2);
  color: var(--ink-60);
  line-height: 2.05;
  font-size: 15px;
}

.sec__img {
  margin-top: var(--s3);
}

.next {
  margin-top: var(--s6);
  padding-top: var(--s4);
  border-top: 1px solid var(--line);
}

.next__link {
  margin-top: var(--s2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s3);
  padding-block: var(--s2);
}

.next__title {
  font-family: var(--font-cn);
  font-size: clamp(22px, 2.6vw, 32px);
  letter-spacing: 0.04em;
}

.next__arrow {
  transition: transform 400ms var(--ease);
}

.next__link:hover .next__arrow {
  transform: translateX(6px);
}

.link {
  font-size: 13px;
  color: var(--ink-60);
}

@media (max-width: 900px) {
  .body {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
  .body__aside {
    position: static;
  }
}
</style>
