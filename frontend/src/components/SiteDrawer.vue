<script setup>
import { watch } from 'vue'
import { mainNav, accountNav } from '@/data/nav'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

// 抽屉打开时锁住页面滚动
watch(
  () => ui.drawerOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)
</script>

<template>
  <div class="drawer-root" :class="{ 'is-open': ui.drawerOpen }">
    <div class="scrim" @click="ui.closeDrawer()" />

    <aside class="panel" aria-label="菜单">
      <div class="panel__top">
        <span class="eyebrow">MENU</span>
        <button class="close" type="button" aria-label="关闭菜单" @click="ui.closeDrawer()">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="1.1" />
            <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="1.1" />
          </svg>
        </button>
      </div>

      <nav class="panel__nav">
        <RouterLink
          v-for="(n, i) in mainNav"
          :key="n.to"
          :to="n.to"
          class="big"
          @click="ui.closeDrawer()"
        >
          <span class="num">0{{ i + 1 }}</span>
          <span class="big__cn">{{ n.label }}</span>
          <span class="big__en">{{ n.en }}</span>
        </RouterLink>
      </nav>

      <div class="panel__sub">
        <RouterLink
          v-for="a in accountNav"
          :key="a.to"
          :to="a.to"
          class="sub"
          @click="ui.closeDrawer()"
        >
          {{ a.label }}
        </RouterLink>
      </div>

      <p class="panel__note">垚 · 陶　非遗陶器与纹样定制</p>
    </aside>
  </div>
</template>

<style scoped>
.drawer-root {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  pointer-events: none;
}

.scrim {
  position: absolute;
  inset: 0;
  background: rgba(41, 40, 36, 0.32);
  opacity: 0;
  transition: opacity 420ms var(--ease);
}

.panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 88vw);
  background: var(--cream);
  border-left: 1px solid var(--line);
  padding: var(--s4) var(--s4) var(--s5);
  display: flex;
  flex-direction: column;
  gap: var(--s5);
  transform: translateX(100%);
  transition: transform 520ms var(--ease);
  overflow-y: auto;
}

.is-open {
  pointer-events: auto;
}

.is-open .scrim {
  opacity: 1;
}

.is-open .panel {
  transform: none;
}

.panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: var(--ink-60);
}
.close:hover {
  color: var(--ink);
}

.panel__nav {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.big {
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: baseline;
  gap: 4px var(--s2);
  padding-block: 6px;
  border-bottom: 1px solid var(--line-soft);
}

.big__cn {
  font-family: var(--font-cn);
  font-size: 26px;
  letter-spacing: 0.06em;
  color: var(--ink);
}

.big__en {
  grid-column: 2;
  font-size: 10px;
  letter-spacing: 0.24em;
  color: var(--ink-40);
}

.big:hover .big__cn {
  color: var(--clay);
}

.panel__sub {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
}

.sub {
  font-size: 13px;
  color: var(--ink-60);
  letter-spacing: 0.06em;
}
.sub:hover {
  color: var(--ink);
}

.panel__note {
  margin-top: auto;
  font-size: var(--fs-micro);
  color: var(--ink-40);
  letter-spacing: 0.1em;
}
</style>
