<script setup>
import { mainNav, accountNav } from '@/data/nav'
</script>

<template>
  <footer class="ftr">
    <div class="shell ftr__inner">
      <div class="ftr__brand">
        <p class="ftr__cn">垚 · 陶</p>
        <p class="ftr__en">YAO CERAMICS · HANDMADE IN JINGDEZHEN</p>
        <p class="ftr__line">让泥土，成为陪伴。</p>
      </div>

      <div class="ftr__cols">
        <div class="col">
          <p class="eyebrow">逛逛</p>
          <RouterLink v-for="n in mainNav.slice(0, 4)" :key="n.to" :to="n.to" class="lnk">
            {{ n.label }}
          </RouterLink>
        </div>

        <div class="col">
          <p class="eyebrow">我的</p>
          <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="lnk">
            {{ a.label }}
          </RouterLink>
        </div>

        <div class="col">
          <p class="eyebrow">说明</p>
          <p class="lnk lnk--static">全手工制作，每件存在色差与尺寸差异</p>
          <p class="lnk lnk--static">定制约 25–30 天</p>
          <p class="lnk lnk--static">现货 3 天内发出</p>
        </div>
      </div>
    </div>

    <div class="shell ftr__bottom">
      <span>© 2026 垚 · 陶</span>
      <span class="micro">本站商品图与纹样说明仍在补充中</span>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  border-top: 1px solid var(--line);
  margin-top: var(--s7);
  padding-top: var(--s5);
  padding-bottom: var(--s4);
}

.ftr__inner {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr;
  gap: var(--s5) var(--s4);
}

.ftr__cn {
  font-family: var(--font-cn);
  font-size: 26px;
  letter-spacing: 0.18em;
}

.ftr__en {
  margin-top: 6px;
  font-size: 9px;
  letter-spacing: 0.26em;
  color: var(--ink-40);
}

.ftr__line {
  margin-top: var(--s3);
  font-family: var(--font-cn);
  font-size: 15px;
  color: var(--ink-60);
  letter-spacing: 0.1em;
}

.ftr__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s3);
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lnk {
  font-size: 13px;
  color: var(--ink-60);
  transition: color 300ms var(--ease);
  line-height: 1.6;
}

.lnk:hover {
  color: var(--ink);
}

.lnk--static {
  cursor: default;
}

.ftr__bottom {
  margin-top: var(--s5);
  padding-top: var(--s3);
  border-top: 1px solid var(--line-soft);
  display: flex;
  justify-content: space-between;
  gap: var(--s2);
  font-size: var(--fs-micro);
  color: var(--ink-40);
  flex-wrap: wrap;
}

@media (max-width: 860px) {
  .ftr__inner {
    grid-template-columns: 1fr;
  }
  .ftr__cols {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
