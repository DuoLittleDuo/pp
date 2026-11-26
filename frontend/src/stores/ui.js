import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 界面状态：菜单抽屉、轻提示、垚垚面板 */
export const useUiStore = defineStore('ui', () => {
  const drawerOpen = ref(false)
  const agentOpen = ref(false)
  const toast = ref('')
  let toastTimer = 0

  /** 让某个页面临时指挥垚垚播一个动作，例如支付成功播 cheer */
  const agentAction = ref('')
  const agentOnce = ref(false)
  function playAgent(action, once = true) {
    agentAction.value = action
    agentOnce.value = once
  }

  function openDrawer() {
    drawerOpen.value = true
  }
  function closeDrawer() {
    drawerOpen.value = false
  }
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  function openAgent() {
    agentOpen.value = true
  }
  function closeAgent() {
    agentOpen.value = false
  }

  function say(text, ms = 2200) {
    toast.value = text
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.value = ''
    }, ms)
  }

  return {
    drawerOpen,
    agentOpen,
    toast,
    agentAction,
    agentOnce,
    playAgent,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    openAgent,
    closeAgent,
    say,
  }
})
