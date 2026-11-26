<script setup>
import { onMounted, ref, watch } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteDrawer from '@/components/SiteDrawer.vue'
import AgentLauncher from '@/components/AgentLauncher.vue'
import WelcomeLayer from '@/components/WelcomeLayer.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const showWelcome = ref(false)

onMounted(() => {
  // 一个浏览器会话里只完整走一次欢迎层；?nwelcome=1 可跳过（截图和调试用）
  const skip = new URLSearchParams(window.location.search).has('nwelcome')
  if (!skip && !sessionStorage.getItem('yao:welcome')) showWelcome.value = true
})

watch(showWelcome, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

function finishWelcome() {
  sessionStorage.setItem('yao:welcome', '1')
  showWelcome.value = false
}
</script>

<template>
  <div class="grain" aria-hidden="true" />

  <SiteHeader />

  <main>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </main>

  <SiteFooter />
  <SiteDrawer />
  <AgentLauncher />

  <Transition name="welcome-fade">
    <WelcomeLayer v-if="showWelcome" @done="finishWelcome" />
  </Transition>

  <Transition name="toast">
    <div v-if="ui.toast" class="toast" role="status">{{ ui.toast }}</div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  z-index: 350;
  padding: 12px 22px;
  background: var(--ink);
  color: var(--cream);
  font-size: 13px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  box-shadow: 0 20px 40px -24px rgba(41, 40, 36, 0.6);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 300ms var(--ease), transform 300ms var(--ease);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.welcome-fade-leave-active {
  transition: opacity 620ms var(--ease);
}
.welcome-fade-leave-to {
  opacity: 0;
}
</style>
