<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import FigureFrame from '@/components/FigureFrame.vue'
import ChapterRail from '@/components/ChapterRail.vue'
import AgentFace from '@/components/AgentFace.vue'
import MarqueeStrip from '@/components/MarqueeStrip.vue'
import RadialHub from '@/components/RadialHub.vue'
import { products } from '@/data/products'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const chapters = [
  { id: 'ch01', no: '01', label: '封面' },
  { id: 'ch02', no: '02', label: '这一期' },
  { id: 'ch03', no: '03', label: '从泥到器' },
  { id: 'ch04', no: '04', label: '留下一道纹样' },
  { id: 'ch05', no: '05', label: '认识垚垚' },
  { id: 'ch06', no: '06', label: '从这里展开' },
]

const active = ref(0)
const featured = computed(() => products.filter((p) => p.featured).slice(0, 3))

let io = null
let fitTimer = 0

/**
 * 覆盖式滚动要求每一章都能装进一屏。
 * 装不下的章节（内容太长 / 窗口太矮）自动退回普通滚动，避免下面的内容被永久盖住。
 */
function fitChapters() {
  const vh = window.innerHeight
  document.querySelectorAll('.ch').forEach((el) => {
    el.classList.toggle('is-flow', el.scrollHeight > vh + 4)
  })
}

function scheduleFit() {
  clearTimeout(fitTimer)
  fitTimer = window.setTimeout(fitChapters, 120)
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const idx = Number(e.target.dataset.ch)
        if (!Number.isNaN(idx)) active.value = idx
      })
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  )
  document.querySelectorAll('[data-ch]').forEach((el) => io.observe(el))

  requestAnimationFrame(fitChapters)
  window.addEventListener('resize', scheduleFit, { passive: true })
  window.addEventListener('load', scheduleFit)

  // 直接带 #ch01…#ch06 进来时，按章节序号跳到对应位置
  const m = window.location.hash.match(/^#ch0?(\d+)$/)
  if (m) {
    const idx = Math.max(0, Number(m[1]) - 1)
    window.setTimeout(
      () => window.scrollTo({ top: idx * window.innerHeight, behavior: 'auto' }),
      80
    )
  }
})

onUnmounted(() => {
  io?.disconnect()
  clearTimeout(fitTimer)
  window.removeEventListener('resize', scheduleFit)
  window.removeEventListener('load', scheduleFit)
})

const steps = [
  { no: '01', title: '醒泥', text: '泥里有气，气不放掉，烧出来就裂。摊开、洒水、盖上湿布，放几天。' },
  { no: '02', title: '拉坯', text: '一只杯子大约三分钟。壁厚 3mm 上下，太薄撑不住釉，太厚端着沉。' },
  { no: '03', title: '修坯上釉', text: '半干时修底足，素烧一次让坯体结实，再上薄薄一层釉。' },
  { no: '04', title: '还原烧', text: '1280℃ 烧十几个小时。窑里氧气不足，釉里的铁被还原，青色才出来。' },
]

/** 三件重点器物的图幅，故意不一样，制造错落感 */
function itemRatio(i) {
  return i === 1 ? '1/1' : '4/5'
}
</script>

<template>
  <div class="home">
    <ChapterRail :chapters="chapters" :active="active" />

    <div class="stack">
      <!-- ============ 01 封面 ============ -->
      <section id="ch01" class="ch ch--cover" data-ch="0">
        <div class="cover__field" aria-hidden="true" />
        <div class="cover shell">
          <div class="cover__meta">
            <span class="num">01 / 05</span>
            <span class="eyebrow">COVER · 2026 秋</span>
          </div>

          <div class="cover__stage">
            <div class="cover__left">
              <h1 class="cover__title display enter-up">
                THE ART<br /><span class="cover__title-2">OF CLAY</span>
              </h1>

              <div class="cover__cn enter-up d2">
                <p class="title-cn">让泥土，成为陪伴。</p>
                <p class="cover__lead">
                  非遗陶器，手工制作。可以买走一只，也可以留下一道自己的纹样。
                </p>
                <div class="cover__acts">
                  <AppButton tag="RouterLink" to="/shop" variant="line" size="md">
                    探索器物
                    <template #arrow>→</template>
                  </AppButton>
                  <AppButton tag="RouterLink" to="/customize" variant="text" size="md">
                    开始定制
                  </AppButton>
                </div>
              </div>
            </div>

            <div class="cover__right enter-fade d1">
              <FigureFrame
                src="/assets/products/ZG-SB-01.webp"
                ratio="13/12"
                label="封面主视觉"
                caption="山河绞胎 · 犬用陶瓷食盆"
                eager
              />
              <p class="cover__series micro">手作陶器 · 2026</p>
            </div>
          </div>

          <div class="cover__foot">
            <ul class="cover__index">
              <li><span class="num">01</span><span>器物 · 35 件手作</span></li>
              <li><span class="num">02</span><span>工艺 · 六种做法</span></li>
              <li><span class="num">03</span><span>纹样 · 可以定做</span></li>
            </ul>

            <span class="cover__scroll">
              <span class="micro">向下滚动</span>
              <span class="cover__arrow" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      <!-- ============ 02 这一期 ============ -->
      <section id="ch02" class="ch" data-ch="1">
        <div class="shell issue">
          <header class="ch__head">
            <div class="ch__meta">
              <span class="num">02 / 05</span>
              <span class="eyebrow">THIS ISSUE</span>
            </div>
            <h2 class="ch__title">这一期，四件器物</h2>
            <p class="ch__lead">
              不按商品目录排。这一期挑了三件放在前面——一只薄杯、一只公道杯、一只柴烧花器。
            </p>
            <RouterLink to="/shop" class="ch__more">逛全部陶器 →</RouterLink>
          </header>

          <div class="issue__grid">
            <article
              v-for="(p, i) in featured"
              :key="p.id"
              class="item"
              :class="`item--${i + 1}`"
            >
              <RouterLink :to="`/shop/${p.id}`" class="item__link">
                <FigureFrame :src="p.thumb || p.images[0]" :ratio="itemRatio(i)" :label="p.name" hover />
                <div class="item__row">
                  <h3 class="item__name">{{ p.name }}</h3>
                  <span class="item__price">¥{{ p.price }}</span>
                </div>
                <p class="item__meta">{{ p.series }} · {{ p.glaze }}</p>
              </RouterLink>
            </article>
          </div>

          <p class="issue__note small">
            全手工制作，同一款之间会有色差和尺寸差异。定做约 25–30 天，现货 3 天内发出。
          </p>

          <MarqueeStrip
            class="issue__ticker"
            reverse
            :speed="48"
            :items="['绞胎', '五色陶土', '窑变', '柘红素陶', '刻花', '素陶原色']"
          />
        </div>
      </section>

      <!-- ============ 03 从泥到器 ============ -->
      <section id="ch03" class="ch" data-ch="2">
        <div class="shell craft">
          <div class="craft__visual">
            <FigureFrame ratio="3/2" label="工序摄影 · 拉坯"  />
            <div class="craft__visual-foot">
              <span class="num">03 / 05</span>
              <span class="micro">从泥到器，四道工序</span>
            </div>
          </div>

          <div class="craft__text">
            <p class="eyebrow">FROM CLAY TO VESSEL</p>
            <h2 class="ch__title">从泥到器</h2>
            <p class="ch__lead">
              一件器物在窑里待十几个小时，人在旁边守着。这一段过程很少被看见，但它决定了最后的手感。
            </p>

            <ol class="steps">
              <li v-for="s in steps" :key="s.no" class="step">
                <span class="step__no num">{{ s.no }}</span>
                <div>
                  <h3 class="step__title">{{ s.title }}</h3>
                  <p class="step__text">{{ s.text }}</p>
                </div>
              </li>
            </ol>

            <RouterLink to="/story" class="ch__more">读工艺故事 →</RouterLink>
          </div>
        </div>
      </section>

      <!-- ============ 04 留下一道纹样 ============ -->
      <section id="ch04" class="ch" data-ch="3">
        <div class="shell custom">
          <header class="ch__head ch__head--center">
            <div class="ch__meta">
              <span class="num">04 / 05</span>
              <span class="eyebrow">MAKE IT YOURS</span>
            </div>
            <h2 class="ch__title">留下一道纹样</h2>
            <p class="ch__lead">
              选器型、选纹样、选颜色，在页面上直接看效果。做好之后可以存下来，也可以直接下单。
            </p>
          </header>

          <div class="custom__grid">
            <div class="custom__cell custom__cell--a">
              <FigureFrame ratio="4/5" label="器型 · 食盆 / 水碗 / 纪念罐" />
              <p class="custom__cap">01 选器型</p>
            </div>
            <div class="custom__cell custom__cell--b">
              <FigureFrame ratio="1/1" label="工艺纹样 · 六类" />
              <p class="custom__cap">02 选纹样</p>
            </div>
            <div class="custom__cell custom__cell--c">
              <FigureFrame
                src="/assets/products/ZG-SB-06.webp"
                ratio="13/12"
                label="成品效果"
                caption="人宠同系 · 一屋两碗礼盒"
              />
              <p class="custom__cap">03 看效果</p>
            </div>
          </div>

          <div class="custom__acts">
            <AppButton tag="RouterLink" to="/customize" variant="solid" size="lg">
              开始定制
              <template #arrow>→</template>
            </AppButton>
            <AppButton tag="RouterLink" to="/patterns" variant="text" size="md">
              先看看纹样库
            </AppButton>
          </div>
        </div>
      </section>

      <!-- ============ 05 认识垚垚 ============ -->
      <section id="ch05" class="ch" data-ch="4">
        <div class="shell meet">
          <div class="meet__face">
            <div class="meet__ring">
              <AgentFace :size="150" mood="happy" />
            </div>
            <p class="meet__tag micro">YAO · 一直在页面右下角</p>
          </div>

          <div class="meet__text">
            <div class="ch__meta">
              <span class="num">05 / 05</span>
              <span class="eyebrow">MEET YAO</span>
            </div>
            <h2 class="ch__title">认识垚垚</h2>
            <p class="ch__lead">
              她不是页面里的一个板块，是飘在右下角的一只小家伙。可以拖、可以甩，
              问她哪只食盆适合猫、釉色为什么不一样，也可以让她陪你挑一件。
            </p>
            <p class="small">
              她记得你们聊过什么，也会跟着页面换动作——你在翻器物的时候，她在旁边待着。
            </p>

            <div class="meet__acts">
              <AppButton variant="solid" size="md" @click="ui.openAgent()">
                和垚垚聊聊
              </AppButton>
              <RouterLink to="/story" class="ch__more">先看看工艺 →</RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ 06 从一个点展开 ============ -->
      <section id="ch06" class="ch" data-ch="5">
        <div class="shell hubsec">
          <header class="hubsec__head">
            <div class="ch__meta">
              <span class="num">06</span>
              <span class="eyebrow">EVERYTHING FROM ONE POINT</span>
            </div>
            <h2 class="ch__title">从一个点，展开</h2>
            <p class="ch__lead">
              中间那枚窑印是基准点。逛陶器、自己定做、纹样库、工艺故事、我的，
              五件事从它往外散出去。停在哪一条，哪一条就亮。
            </p>
          </header>

          <RadialHub :size="640" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 章节堆叠：下一章从下面滑上来盖住上一章 ---------- */
.stack {
  position: relative;
}

.ch {
  position: sticky;
  top: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--nav-h);
  padding-bottom: var(--s5);
  background: var(--cream);
  border-top: 1px solid var(--line-soft);
  transition: background-color 600ms var(--ease);
}

/* 每一章一个大色块，翻页时有颜色变化 */
.ch[data-ch='0'] {
  background: var(--field-1);
  --ch-accent: var(--clay);
}
.ch[data-ch='1'] {
  background: var(--field-2);
  --ch-accent: var(--c-bowl);
}
.ch[data-ch='2'] {
  background: var(--field-3);
  --ch-accent: var(--celadon);
}
.ch[data-ch='3'] {
  background: var(--field-4);
  --ch-accent: var(--c-obj);
}
.ch[data-ch='4'] {
  background: var(--field-5);
  --ch-accent: var(--c-jar);
}
.ch[data-ch='5'] {
  background: var(--field-6);
  --ch-accent: var(--accent);
}

/* ---------- 06 放射式展开 ---------- */
.hubsec {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s3);
}

.hubsec__head {
  max-width: 640px;
  text-align: center;
}

.hubsec__head .ch__meta {
  justify-content: center;
}

.hubsec__head .ch__title {
  margin-top: var(--s2);
}

.hubsec__head .ch__lead {
  margin-top: var(--s1);
  margin-inline: auto;
  max-width: 46ch;
  font-size: 14px;
}

/* 章首一条细色带 */
.ch::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--pad);
  width: 56px;
  height: 3px;
  background: var(--ch-accent, var(--clay));
}

/* 章节编号和"更多"链接跟着章节色走 */
.ch .num {
  color: var(--ch-accent, var(--clay));
}

.ch__more:hover {
  border-color: var(--ch-accent, var(--ink));
}

.ch--cover {
  border-top: 0;
}

/* 内容装不进一屏时（由脚本判断），这一章退回普通滚动 */
.ch.is-flow {
  position: relative;
  min-height: auto;
  padding-block: var(--s6);
}

/* ---------- 共用的小标题结构 ---------- */
.ch__head {
  max-width: 720px;
  margin-bottom: var(--s5);
}

.ch__head--center {
  margin-inline: auto;
  text-align: center;
}

.ch__meta {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s3);
}

.ch__head--center .ch__meta {
  justify-content: center;
}

.ch__title {
  font-family: var(--font-cn);
  font-size: clamp(26px, 3.2vw, 44px);
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.ch__lead {
  margin-top: var(--s3);
  max-width: 46ch;
  color: var(--ink-60);
  line-height: 1.9;
}

.ch__head--center .ch__lead {
  margin-inline: auto;
}

.ch__more {
  display: inline-block;
  margin-top: var(--s3);
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  padding-bottom: 3px;
  transition: border-color 300ms var(--ease);
}
.ch__more:hover {
  border-color: var(--ink);
}

/* ================= 01 封面 ================= */
/* 标题后面一团柔和的色晕，给整页定一个暖调 */
.cover__field {
  position: absolute;
  left: -12vw;
  top: 8vh;
  width: 78vw;
  height: 78vw;
  max-width: 1100px;
  max-height: 1100px;
  border-radius: 50%;
  background:
    radial-gradient(
      circle at 26% 30%,
      rgba(179, 90, 53, 0.3) 0%,
      rgba(221, 178, 119, 0) 50%
    ),
    radial-gradient(
      circle at 64% 58%,
      rgba(63, 102, 89, 0.24) 0%,
      rgba(221, 178, 119, 0) 46%
    ),
    radial-gradient(
      circle at 46% 74%,
      rgba(192, 138, 62, 0.22) 0%,
      rgba(221, 178, 119, 0) 42%
    );
  pointer-events: none;
  z-index: 0;
  filter: blur(4px);
}

.cover {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.cover__meta {
  display: flex;
  align-items: center;
  gap: var(--s2);
}

.cover__stage {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  align-items: center;
  gap: 0;
}

.cover__left {
  position: relative;
  z-index: 2;
  margin-right: -2vw;
}

.cover__title {
  font-size: var(--fs-mega);
  font-weight: 700;
  line-height: 0.78;
  letter-spacing: -0.045em;
  color: var(--ink);
  text-transform: uppercase;
}

/* 第二行往右推，制造错位 */
.cover__title-2 {
  padding-left: 0.18em;
}

.cover__cn {
  margin-top: var(--s4);
  padding-left: 0.2em;
}

.cover__lead {
  margin-top: var(--s2);
  max-width: 34ch;
  color: var(--ink-60);
  line-height: 1.9;
}

.cover__acts {
  margin-top: var(--s4);
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

.cover__right {
  position: relative;
  padding-top: 4vh;
}

.cover__series {
  margin-top: 10px;
  text-align: left;
  letter-spacing: 0.14em;
}

.cover__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--s4);
  padding-top: var(--s2);
  border-top: 1px solid var(--line-soft);
}

.cover__index {
  display: flex;
  gap: clamp(18px, 3vw, 54px);
  flex-wrap: wrap;
}

.cover__index li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: var(--fs-micro);
  letter-spacing: 0.08em;
  color: var(--ink-60);
}

.cover__index li:nth-child(1) .num {
  color: var(--c-bowl);
}
.cover__index li:nth-child(2) .num {
  color: var(--celadon);
}
.cover__index li:nth-child(3) .num {
  color: var(--c-obj);
}

.cover__scroll {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  letter-spacing: 0.2em;
}

.cover__arrow {
  display: block;
  width: 1px;
  height: 34px;
  background: linear-gradient(to bottom, var(--ink-40), transparent);
}

/* ================= 02 这一期 ================= */
.issue__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--s3);
  row-gap: var(--s5);
}

.item:nth-child(1) {
  grid-column: 1 / 5;
}
.item:nth-child(2) {
  grid-column: 6 / 10;
  transform: translateY(10vh);
}
.item:nth-child(3) {
  grid-column: 10 / 13;
  transform: translateY(3vh);
}

.item__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--s2);
  margin-top: var(--s2);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
}

.item__name {
  font-family: var(--font-cn);
  font-size: 19px;
  font-weight: 400;
  letter-spacing: 0.06em;
}

.item__price {
  font-size: 14px;
  color: var(--ink-60);
  font-variant-numeric: tabular-nums;
}

.item__meta {
  margin-top: 8px;
  font-size: var(--fs-micro);
  letter-spacing: 0.06em;
  color: var(--ink-40);
}

.issue__note {
  margin-top: var(--s4);
  max-width: 58ch;
  padding-top: var(--s3);
  border-top: 1px solid var(--line-soft);
}

/* ================= 03 从泥到器 ================= */
.craft {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: var(--s5);
  align-items: center;
}

.craft__visual-foot {
  margin-top: var(--s2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.steps {
  margin-top: var(--s4);
  display: flex;
  flex-direction: column;
}

.step {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--s2);
  padding-block: var(--s3);
  border-top: 1px solid var(--line-soft);
}

.step:last-child {
  border-bottom: 1px solid var(--line-soft);
}

.step__title {
  font-family: var(--font-cn);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.step__text {
  margin-top: 6px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--ink-60);
}

/* ================= 04 定做 ================= */
.custom__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--s3);
  align-items: end;
}

.custom__cell--a {
  grid-column: 1 / 5;
}
.custom__cell--b {
  grid-column: 5 / 9;
  transform: translateY(-6vh);
}
.custom__cell--c {
  grid-column: 9 / 13;
  transform: translateY(-2vh);
}

.custom__cap {
  margin-top: 12px;
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  color: var(--ink-40);
}

.custom__acts {
  margin-top: var(--s5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

/* ================= 05 认识垚垚 ================= */
.meet {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: var(--s5);
  align-items: center;
}

.meet__face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s3);
}

.meet__ring {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(54, 68, 94, 0.22);
  background: radial-gradient(
    circle at 38% 30%,
    rgba(255, 255, 255, 0.8),
    rgba(218, 226, 236, 0.75) 62%,
    rgba(198, 210, 224, 0.9)
  );
  box-shadow: 0 0 0 10px rgba(54, 68, 94, 0.05);
}

.meet__tag {
  letter-spacing: 0.2em;
}

.meet__acts {
  margin-top: var(--s4);
  display: flex;
  align-items: center;
  gap: var(--s3);
  flex-wrap: wrap;
}

/* ================= 窄屏：放弃堆叠，回到普通滚动 ================= */
@media (max-width: 1023px) {
  .ch {
    position: relative;
    min-height: auto;
    padding-block: var(--s6);
  }

  .cover__stage,
  .craft,
  .meet {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }

  .cover__left {
    margin-right: 0;
  }

  .cover__title {
    font-size: clamp(52px, 15vw, 96px);
  }

  .item:nth-child(1),
  .item:nth-child(2),
  .item:nth-child(3),
  .issue__note {
    grid-column: 1 / -1;
    transform: none;
  }

  .custom__cell--a,
  .custom__cell--b,
  .custom__cell--c {
    grid-column: span 4;
    transform: none;
  }
}

@media (max-width: 720px) {
  .issue__grid {
    row-gap: var(--s4);
  }
  .custom__cell--a,
  .custom__cell--b,
  .custom__cell--c {
    grid-column: 1 / -1;
  }
}

/* 系统要求减少动态效果：不做堆叠 */
@media (prefers-reduced-motion: reduce) {
  .ch {
    position: relative;
    min-height: auto;
    padding-block: var(--s6);
  }
  .item:nth-child(2),
  .custom__cell--b,
  .custom__cell--c {
    transform: none;
  }
}
</style>
