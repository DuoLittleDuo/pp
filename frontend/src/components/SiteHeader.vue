<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { mainNav } from '@/data/nav'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const cart = useCartStore()
const fav = useFavoritesStore()
const ui = useUiStore()

const scrolled = ref(false)

const isHome = computed(() => route.name === 'home')
/** 首页首屏时导航透明浮在图上，滚动后变成奶油白 */
const overHero = computed(() => isHome.value && !scrolled.value)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function isActive(to) {
  if (to === '/account') return route.path.startsWith('/account')
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <header class="hdr" :class="{ 'is-solid': !overHero }">
    <div class="hdr__inner shell">
      <RouterLink to="/" class="brand" aria-label="回到首页">
        <span class="brand__cn">垚 · 陶</span>
        <span class="brand__en">YAO CERAMICS</span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink
          v-for="n in mainNav"
          :key="n.to"
          :to="n.to"
          class="nav__link"
          :class="{ 'is-active': isActive(n.to) }"
        >
          {{ n.label }}
        </RouterLink>
      </nav>

      <div class="tools">
        <RouterLink to="/shop" class="tool" aria-label="搜索陶器">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.6" fill="none" stroke="currentColor" stroke-width="1.1" />
            <line x1="12.8" y1="12.8" x2="17" y2="17" stroke="currentColor" stroke-width="1.1" />
          </svg>
        </RouterLink>

        <RouterLink to="/account/favorites" class="tool" aria-label="我的收藏">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M10 16.5S3.2 12.4 3.2 7.9a3.6 3.6 0 0 1 6.8-1.8 3.6 3.6 0 0 1 6.8 1.8c0 4.5-6.8 8.6-6.8 8.6Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.1"
              stroke-linejoin="round"
            />
          </svg>
          <span v-if="fav.count" class="tool__count">{{ fav.count }}</span>
        </RouterLink>

        <RouterLink to="/cart" class="tool" aria-label="购物袋">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path d="M4.6 6.4h10.8l-.9 10.2H5.5L4.6 6.4Z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" />
            <path d="M7.6 6.4V5.2a2.4 2.4 0 0 1 4.8 0v1.2" fill="none" stroke="currentColor" stroke-width="1.1" />
          </svg>
          <span v-if="cart.count" class="tool__count">{{ cart.count }}</span>
        </RouterLink>

        <button class="tool tool--menu" type="button" aria-label="打开菜单" @click="ui.openDrawer()">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" stroke-width="1.1" />
            <line x1="3" y1="13" x2="17" y2="13" stroke="currentColor" stroke-width="1.1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--nav-h);
  z-index: var(--z-nav);
  transition: background-color 420ms var(--ease), border-color 420ms var(--ease);
  border-bottom: 1px solid transparent;
}

.hdr.is-solid {
  background: rgba(221, 178, 119, 0.94);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--line);
}

.hdr__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s3);
}

/* ---------- 品牌 ---------- */
.brand {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1;
  flex-shrink: 0;
}

.brand__cn {
  font-family: var(--font-cn);
  font-size: 19px;
  letter-spacing: 0.18em;
  color: var(--ink);
}

.brand__en {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--ink-40);
}

/* ---------- 主导航 ---------- */
.nav {
  display: flex;
  align-items: center;
  gap: clamp(18px, 2.6vw, 44px);
}

.nav__link {
  position: relative;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: var(--ink-60);
  padding-block: 6px;
  transition: color 300ms var(--ease);
  white-space: nowrap;
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 420ms var(--ease);
}

.nav__link:hover,
.nav__link.is-active {
  color: var(--ink);
}

.nav__link:hover::after,
.nav__link.is-active::after {
  transform: scaleX(1);
}

/* ---------- 右侧工具 ---------- */
.tools {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.tool {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: var(--ink-60);
  transition: color 300ms var(--ease), background-color 300ms var(--ease);
  border-radius: 999px;
}

.tool:hover {
  color: var(--ink);
  background: rgba(41, 40, 36, 0.05);
}

.tool__count {
  position: absolute;
  top: 3px;
  right: 2px;
  min-width: 15px;
  height: 15px;
  padding-inline: 3px;
  display: grid;
  place-items: center;
  background: var(--clay);
  color: var(--cream);
  font-size: 9px;
  letter-spacing: 0;
  border-radius: 999px;
  line-height: 1;
}

.tool--menu {
  display: none;
}

@media (max-width: 1023px) {
  .nav {
    display: none;
  }
  .tool--menu {
    display: grid;
  }
}
</style>
