<script setup>
import { computed, ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AppButton from '@/components/AppButton.vue'
import { crafts } from '@/data/patterns'
import { useDesignsStore } from '@/stores/designs'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'

const designs = useDesignsStore()
const cart = useCartStore()
const ui = useUiStore()

/* ---------- 器型 ---------- */
const shapes = [
  {
    id: 'bowl',
    name: '食盆',
    base: 198,
    body: 'M40 88 L160 88 Q152 154 100 158 Q48 154 40 88 Z',
    rim: { cx: 100, cy: 88, rx: 60, ry: 11 },
  },
  {
    id: 'water',
    name: '水碗',
    base: 178,
    body: 'M28 100 L172 100 Q162 152 100 156 Q38 152 28 100 Z',
    rim: { cx: 100, cy: 100, rx: 72, ry: 12 },
  },
  {
    id: 'urn',
    name: '纪念罐',
    base: 428,
    body: 'M62 96 Q56 168 68 184 L132 184 Q144 168 138 96 Z',
    rim: { cx: 100, cy: 96, rx: 46, ry: 11 },
    lid: true,
  },
]

/* ---------- 釉色 ---------- */
const glazes = [
  { id: '绞胎本色', hex: '#b9a48c' },
  { id: '五色陶土', hex: '#b08a76' },
  { id: '窑变暮山', hex: '#7c7f74' },
  { id: '柘红素陶', hex: '#9d5f45' },
  { id: '月白', hex: '#e2ddd2' },
  { id: '无釉素陶', hex: '#c6b49c' },
]

/* ---------- 六种工艺对应的母题（示意） ---------- */
const motifs = {
  jiaotai: {
    d: 'M0 18 Q8 6 16 18 Q24 30 32 18',
    stroke: true,
    width: 1.6,
  },
  wuse: {
    d: 'M7 0 V32 M21 0 V32',
    stroke: true,
    width: 7,
  },
  yaobian: {
    d: 'M9 9 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M23 22 m-4.5 0 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0',
    stroke: false,
  },
  zhehong: {
    d: 'M7 7 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 M21 15 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 M12 25 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0',
    stroke: false,
  },
  kehua: {
    d: 'M2 10 H15 M17 22 H31',
    stroke: true,
    width: 1.2,
  },
  sutao: {
    d: 'M6 6 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M22 18 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0',
    stroke: false,
  },
}

/* ---------- 状态 ---------- */
const shapeId = ref('bowl')
const craftId = ref('jiaotai')
const glazeId = ref('绞胎本色')
const scale = ref(1)
const offsetY = ref(0)

const shape = computed(() => shapes.find((s) => s.id === shapeId.value) || shapes[0])
const craft = computed(() => crafts.find((c) => c.id === craftId.value) || crafts[0])
const glaze = computed(() => glazes.find((g) => g.id === glazeId.value) || glazes[0])
const motif = computed(() => motifs[craftId.value] || motifs.jiaotai)

const price = computed(() => {
  const fee = { jiaotai: 60, wuse: 40, yaobian: 80, zhehong: 30, kehua: 50, sutao: 20 }
  return shape.value.base + (fee[craftId.value] || 0)
})

const config = computed(() => ({
  shape: shapeId.value,
  shapeName: shape.value.name,
  craftId: craftId.value,
  craftName: craft.value.name,
  color: glazeId.value,
  colorHex: glaze.value.hex,
  scale: scale.value,
  offsetY: offsetY.value,
  price: price.value,
  version: 1,
}))

function resetAll() {
  shapeId.value = 'bowl'
  craftId.value = 'jiaotai'
  glazeId.value = '绞胎本色'
  scale.value = 1
  offsetY.value = 0
}

function saveDesign() {
  designs.saveDesign({ name: `${shape.value.name} · ${craft.value.name}`, ...config.value })
  ui.say('方案已存到「我的定做」')
}

function addToCart() {
  cart.add({
    productId: `custom-${shapeId.value}-${craftId.value}`,
    name: `定做 ${shape.value.name} · ${craft.value.name}`,
    sku: 'CUSTOM',
    price: price.value,
    qty: 1,
    spec: `${glazeId.value} · ${shape.value.name}`,
    image: '',
    custom: config.value,
  })
  ui.say('定做已放进购物袋')
}
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '自己定做' }]" />

    <header class="head">
      <div>
        <p class="eyebrow">CUSTOMIZE · MAKE IT YOURS</p>
        <h1 class="head__title">自己定做一件</h1>
      </div>
      <p class="head__lead">
        四步：选器型、选工艺、选颜色、调位置。右边会实时显示效果和价格。
        预览是示意图，实物烧制会有色差和手工差异。
      </p>
    </header>

    <div class="bench">
      <!-- 左：四步 -->
      <aside class="steps">
        <div class="step">
          <p class="step__no num">01</p>
          <p class="step__title">选器型</p>
          <div class="opts">
            <button
              v-for="s in shapes"
              :key="s.id"
              type="button"
              class="opt"
              :class="{ 'is-on': shapeId === s.id }"
              @click="shapeId = s.id"
            >
              {{ s.name }}
            </button>
          </div>
        </div>

        <div class="step">
          <p class="step__no num">02</p>
          <p class="step__title">选工艺</p>
          <div class="opts opts--grid">
            <button
              v-for="c in crafts"
              :key="c.id"
              type="button"
              class="opt opt--sm"
              :class="{ 'is-on': craftId === c.id }"
              @click="craftId = c.id"
            >
              {{ c.name }}
            </button>
          </div>
          <p class="step__hint">{{ craft.tagline }}</p>
        </div>

        <div class="step">
          <p class="step__no num">03</p>
          <p class="step__title">选颜色</p>
          <div class="swatches">
            <button
              v-for="g in glazes"
              :key="g.id"
              type="button"
              class="swatch"
              :class="{ 'is-on': glazeId === g.id }"
              :style="{ background: g.hex }"
              :aria-label="g.id"
              @click="glazeId = g.id"
            />
          </div>
          <p class="micro">{{ glazeId }}</p>
        </div>

        <div class="step">
          <p class="step__no num">04</p>
          <p class="step__title">调位置</p>
          <p class="step__hint">调整纹样在器身上的大小和上下位置</p>
          <label class="slider">
            <span>纹样大小</span>
            <input v-model.number="scale" type="range" min="0.6" max="1.6" step="0.05" />
            <span class="val">{{ scale.toFixed(2) }}×</span>
          </label>
          <label class="slider">
            <span>纹样上下</span>
            <input v-model.number="offsetY" type="range" min="-40" max="40" step="1" />
            <span class="val">{{ offsetY }}</span>
          </label>
          <button type="button" class="reset" @click="resetAll">重来</button>
        </div>
      </aside>

      <!-- 中：预览 -->
      <div class="preview">
        <div class="preview__stage">
          <svg
            viewBox="0 0 200 220"
            class="vessel"
            role="img"
            :aria-label="`${shape.name} · ${craft.name} · ${glazeId}`"
          >
            <defs>
              <clipPath id="vesselClip">
                <path :d="shape.body" />
              </clipPath>
              <pattern
                id="motifPat"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
                :patternTransform="`translate(0 ${offsetY}) scale(${scale})`"
              >
                <path
                  :d="motif.d"
                  :fill="motif.stroke ? 'none' : 'rgba(41,40,36,.30)'"
                  :stroke="motif.stroke ? 'rgba(41,40,36,.34)' : 'none'"
                  :stroke-width="motif.width || 1.2"
                  stroke-linecap="round"
                />
              </pattern>

              <!-- 器身明暗：左右暗、偏上亮，让平的色块变成有弧度的器皿 -->
              <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(30,25,20,.34)" />
                <stop offset="14%" stop-color="rgba(255,255,255,.10)" />
                <stop offset="26%" stop-color="rgba(255,255,255,.30)" />
                <stop offset="46%" stop-color="rgba(255,255,255,.16)" />
                <stop offset="70%" stop-color="rgba(30,25,20,.10)" />
                <stop offset="92%" stop-color="rgba(30,25,20,.30)" />
                <stop offset="100%" stop-color="rgba(30,25,20,.42)" />
              </linearGradient>

              <!-- 底部暗下去，器皿才有厚度 -->
              <linearGradient id="bottomShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(30,25,20,0)" />
                <stop offset="62%" stop-color="rgba(30,25,20,0)" />
                <stop offset="100%" stop-color="rgba(30,25,20,.38)" />
              </linearGradient>

              <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(41,40,36,.28)" />
                <stop offset="70%" stop-color="rgba(41,40,36,.10)" />
                <stop offset="100%" stop-color="rgba(41,40,36,0)" />
              </radialGradient>

              <!-- 高光：左上一片柔光，做出釉面反光 -->
              <radialGradient id="spec" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(255,255,255,.55)" />
                <stop offset="60%" stop-color="rgba(255,255,255,.16)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </radialGradient>

              <!-- 颗粒：陶土的粗糙感 -->
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.42" />
                </feComponentTransfer>
              </filter>
            </defs>

            <!-- 落地投影 -->
            <ellipse cx="100" cy="198" rx="62" ry="10" fill="url(#floorShadow)" />

            <!-- 罐子：盖 -->
            <template v-if="shape.lid">
              <ellipse
                :cx="shape.rim.cx"
                :cy="shape.rim.cy - 2"
                :rx="shape.rim.rx"
                :ry="shape.rim.ry"
                :fill="glaze.hex"
                stroke="rgba(41,40,36,.22)"
                stroke-width="1"
              />
              <circle
                :cx="shape.rim.cx"
                :cy="shape.rim.cy - 16"
                r="8"
                :fill="glaze.hex"
                stroke="rgba(41,40,36,.22)"
                stroke-width="1"
              />
            </template>

            <!-- 器身 -->
            <path :d="shape.body" :fill="glaze.hex" />

            <!-- 纹样层 + 明暗层（都裁在器型里） -->
            <g clip-path="url(#vesselClip)">
              <rect x="0" y="0" width="200" height="220" fill="url(#motifPat)" />
              <rect x="0" y="0" width="200" height="220" fill="url(#bodyShade)" />
              <rect x="0" y="0" width="200" height="220" fill="url(#bottomShade)" />

              <!-- 拉坯的横向轮纹，很淡，但有它才像手作的 -->
              <g stroke="rgba(41,40,36,.24)" stroke-width="0.8" fill="none">
                <path d="M0 96 Q100 100 200 96" />
                <path d="M0 112 Q100 116 200 112" />
                <path d="M0 128 Q100 132 200 128" />
                <path d="M0 145 Q100 149 200 145" />
                <path d="M0 162 Q100 166 200 162" />
              </g>

              <rect x="0" y="0" width="200" height="220" filter="url(#grain)" opacity="0.85" />
            </g>

            <!-- 釉面高光 -->
            <g clip-path="url(#vesselClip)">
              <ellipse cx="74" cy="118" rx="26" ry="56" fill="url(#spec)" />
              <ellipse cx="74" cy="112" rx="7" ry="26" fill="rgba(255,255,255,.45)" />
            </g>

            <!-- 口沿 -->
            <ellipse
              :cx="shape.rim.cx"
              :cy="shape.rim.cy"
              :rx="shape.rim.rx"
              :ry="shape.rim.ry"
              fill="none"
              stroke="rgba(255,255,255,.5)"
              stroke-width="1.4"
            />
            <path :d="shape.body" fill="none" stroke="rgba(41,40,36,.24)" stroke-width="1" />
          </svg>
        </div>

        <div class="preview__foot">
          <span class="micro">正面示意</span>
          <span class="micro">实物以烧制结果为准</span>
        </div>
      </div>

      <!-- 右：配置 -->
      <aside class="config">
        <p class="eyebrow">CURRENT</p>

        <dl class="cfg">
          <div><dt>器型</dt><dd>{{ shape.name }}</dd></div>
          <div><dt>工艺</dt><dd>{{ craft.name }}</dd></div>
          <div><dt>颜色</dt><dd>{{ glazeId }}</dd></div>
          <div><dt>大小</dt><dd>{{ scale.toFixed(2) }}×</dd></div>
        </dl>

        <div class="price">
          <span class="micro">参考价</span>
          <p class="price__num">¥{{ price }}</p>
          <p class="micro">含定做工时，制作约 20–30 天</p>
        </div>

        <div class="cfg__acts">
          <AppButton variant="solid" size="md" @click="addToCart">放进购物袋</AppButton>
          <AppButton variant="line" size="md" @click="saveDesign">保存方案</AppButton>
        </div>

        <p class="cfg__note">
          下单时会把这份配置（器型、工艺、颜色、位置）存进订单，师傅按方案制作。
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--s4);
  align-items: end;
  padding-top: var(--s4);
  padding-bottom: var(--s4);
  border-bottom: 1px solid var(--line);
}

.head__title {
  margin-top: 10px;
  font-family: var(--font-cn);
  font-size: clamp(28px, 3.6vw, 46px);
  font-weight: 400;
  letter-spacing: 0.04em;
}

.head__lead {
  color: var(--ink-60);
  line-height: 1.95;
  font-size: 14px;
}

.bench {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 260px;
  gap: var(--s5);
  padding-top: var(--s4);
  align-items: start;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--s4);
}

.step {
  padding-bottom: var(--s3);
  border-bottom: 1px solid var(--line-soft);
}

.step__no {
  font-size: 10px;
}

.step__title {
  margin: 4px 0 10px;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--ink);
}

.step__hint {
  margin-top: 8px;
  font-size: 11px;
  line-height: 1.7;
  color: var(--ink-40);
}

.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.opts--grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.opt {
  font-size: 12px;
  padding: 6px 12px;
  border: 1px solid var(--line);
  color: var(--ink-60);
  transition: all 240ms var(--ease);
}

.opt--sm {
  padding: 5px 4px;
  font-size: 11px;
  text-align: center;
}

.opt:hover {
  border-color: var(--ink-40);
  color: var(--ink);
}

.opt.is-on {
  background: var(--celadon);
  border-color: var(--celadon);
  color: var(--cream);
}

.swatches {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(41, 40, 36, 0.18);
  transition: box-shadow 240ms var(--ease);
}

.swatch.is-on {
  box-shadow: 0 0 0 2px var(--cream), 0 0 0 3px var(--ink);
}

.slider {
  display: grid;
  grid-template-columns: 52px 1fr 44px;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--ink-40);
  margin-bottom: 10px;
}

.slider input {
  accent-color: var(--celadon);
  width: 100%;
}

.val {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ink-60);
}

.reset {
  font-size: 11px;
  color: var(--clay);
  letter-spacing: 0.06em;
}

.preview__stage {
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  background: var(--cream-2);
  border: 1px solid var(--line-soft);
  padding: var(--s4);
}

.vessel {
  width: min(340px, 82%);
  height: auto;
  filter: drop-shadow(0 26px 34px rgba(41, 40, 36, 0.14));
}

.preview__foot {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.config {
  position: sticky;
  top: calc(var(--nav-h) + var(--s3));
  padding: var(--s3);
  border: 1px solid var(--line);
  background: var(--paper-4);
}

.cfg {
  margin-top: var(--s2);
}

.cfg div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-block: 9px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.cfg dt {
  color: var(--ink-40);
  letter-spacing: 0.08em;
}

.cfg dd {
  margin: 0;
}

.price {
  margin-top: var(--s3);
}

.price__num {
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  margin-block: 4px;
}

.cfg__acts {
  margin-top: var(--s3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cfg__note {
  margin-top: var(--s3);
  font-size: var(--fs-micro);
  line-height: 1.8;
  color: var(--ink-40);
}

@media (max-width: 1100px) {
  .bench {
    grid-template-columns: 1fr;
    gap: var(--s4);
  }
  .head {
    grid-template-columns: 1fr;
    gap: var(--s3);
  }
  .config {
    position: static;
  }
}
</style>
