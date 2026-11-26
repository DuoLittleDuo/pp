<script setup>
import { ref, watch } from 'vue'
import AgentPet from './AgentPet.vue'
import AgentPanel from './AgentPanel.vue'
import { useUiStore } from '@/stores/ui'

/**
 * 垚垚的挂载点：桌宠（飘在页面上）+ 聊天面板
 * 形象状态统一在这里管，面板只发指令
 */
const ui = useUiStore()

const pet = ref(null)
const action = ref('idle')
const once = ref(false)
let resetTimer = 0

function play(name, isOnce = false) {
  clearTimeout(resetTimer)
  action.value = name
  once.value = isOnce
}

function onEnded() {
  play('idle', false)
}

/* 面板发来的动作指令 */
function onPanelAction(name, isOnce) {
  play(name, isOnce)
}

/* 其他页面通过 ui.playAgent() 指挥她 */
watch(
  () => ui.agentAction,
  (name) => {
    if (!name) return
    play(name, ui.agentOnce)
    ui.playAgent('', false)
  }
)

/* 打开面板时打招呼 */
watch(
  () => ui.agentOpen,
  (open) => {
    if (open) play('greeting', true)
    else play('idle', false)
  }
)

function openPanel() {
  ui.openAgent()
}

function closePanel() {
  ui.closeAgent()
}
</script>

<template>
  <AgentPet :action="action" :once="once" @open="openPanel" @ended="onEnded" />

  <Transition name="panel">
    <AgentPanel
      v-if="ui.agentOpen"
      @close="closePanel"
      @action="onPanelAction"
    />
  </Transition>
</template>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity 300ms var(--ease), transform 300ms var(--ease);
  transform-origin: bottom right;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
