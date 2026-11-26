<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import AppButton from '@/components/AppButton.vue'
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '样式页' }]" />

    <header class="head">
      <p class="eyebrow">STYLE GUIDE · 内部页</p>
      <h1 class="title-cn">样式页</h1>
      <p class="muted lead">
        这一页不是给客户看的，是方便你验收颜色、字号和组件。看完可以删掉。
      </p>
    </header>

    <!-- 颜色 -->
    <section class="block">
      <p class="eyebrow">颜色</p>
      <div class="swatches">
        <div v-for="c in [
          ['奶油白', '#F5F1E8', 'var(--cream)'],
          ['沙岩米', '#E5DCCF', 'var(--sand)'],
          ['陶土棕', '#A4674B', 'var(--clay)'],
          ['深墨灰', '#292824', 'var(--ink)'],
          ['青釉绿', '#58766D', 'var(--celadon)'],
          ['分割线', '#D5CEC2', 'var(--line)'],
        ]" :key="c[0]" class="sw">
          <span class="sw__chip" :style="{ background: c[2] }" />
          <span class="sw__name">{{ c[0] }}</span>
          <span class="sw__hex">{{ c[1] }}</span>
        </div>
      </div>
    </section>

    <!-- 字号 -->
    <section class="block">
      <p class="eyebrow">字号</p>
      <div class="type">
        <p class="display">THE ART OF CLAY</p>
        <p class="title-cn">让泥土，成为陪伴。</p>
        <p class="h2">章节标题 · 从泥到器</p>
        <p class="body">正文：一件器物在窑里待十几个小时，人在旁边守着。</p>
        <p class="eyebrow">EYEBROW · 小号英文标题</p>
        <p class="num">01 / 05</p>
      </div>
    </section>

    <!-- 按钮 -->
    <section class="block">
      <p class="eyebrow">按钮</p>
      <div class="row">
        <AppButton variant="solid">实心按钮</AppButton>
        <AppButton variant="line">细线按钮</AppButton>
        <AppButton variant="text">文字按钮</AppButton>
        <AppButton variant="line" disabled>禁用</AppButton>
      </div>
    </section>

    <!-- 分割线 -->
    <section class="block">
      <p class="eyebrow">分割线</p>
      <hr class="rule" />
      <p class="micro">1px · #D5CEC2</p>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding-top: calc(var(--nav-h) + var(--s5));
}

.head {
  padding-bottom: var(--s4);
  border-bottom: 1px solid var(--line);
}

.lead {
  margin-top: var(--s2);
  max-width: 46ch;
}

.block {
  padding-block: var(--s5);
  border-bottom: 1px solid var(--line-soft);
}

.swatches {
  margin-top: var(--s3);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--s3);
}

.sw {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sw__chip {
  display: block;
  aspect-ratio: 1;
  border: 1px solid var(--line);
}

.sw__name {
  font-size: 12px;
}

.sw__hex {
  font-size: 10px;
  color: var(--ink-40);
  letter-spacing: 0.08em;
}

.type {
  margin-top: var(--s3);
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.h2 {
  font-family: var(--font-cn);
  font-size: var(--fs-h2);
  letter-spacing: 0.04em;
}

.body {
  font-size: var(--fs-body);
  color: var(--ink-60);
}

.row {
  margin-top: var(--s3);
  display: flex;
  gap: var(--s3);
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 860px) {
  .swatches {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
