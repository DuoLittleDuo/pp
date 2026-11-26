<script setup>
import { nextTick, ref, watch } from 'vue'
import AgentFace from './AgentFace.vue'
import { streamChat, resetChat, health } from '@/api/agent'
import { EMOTION_TO_ACTION } from '@/config/agent-media'
import { useUiStore } from '@/stores/ui'

/** 聊天面板：只负责对话，形象交给外面的桌宠 */
const emit = defineEmits(['close', 'action'])

const ui = useUiStore()

const sessionId = ref(localStorage.getItem('yao:session') || '')
const messages = ref([])
const input = ref('')
const busy = ref(false)
const online = ref(false)
const listEl = ref(null)

const fallback = [
  '我这会儿连不上自己的后端（agent 服务没启动），先说句题外话——那几只绞胎食盆是新出窑的。',
  '后端没连上。把 agent 服务起起来，我就能正常说话了。',
  '我暂时说不了话（后端离线）。要不先逛逛？山河绞胎和窑变暮山那两只值得看一眼。',
]
let fallbackIndex = 0

function scrollToEnd() {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

function push(role, text, meta = '') {
  messages.value.push({ role, text, meta })
  scrollToEnd()
  return messages.value[messages.value.length - 1]
}

async function checkOnline() {
  const h = await health()
  online.value = !!h?.ok
  return online.value
}

function greet() {
  if (messages.value.length === 0) {
    push('agent', '你好，我是垚垚。想找点什么？食盆、水碗，还是想自己定做一件？')
  }
  checkOnline()
}

async function send() {
  const text = input.value.trim()
  if (!text || busy.value) return

  push('user', text)
  input.value = ''
  busy.value = true
  emit('action', 'thinking', false)

  const bubble = push('agent', '')
  let firstToken = true

  try {
    await streamChat({
      message: text,
      sessionId: sessionId.value,
      onEvent(event, data) {
        if (event === 'session') {
          sessionId.value = data.session_id
          localStorage.setItem('yao:session', data.session_id)
          online.value = true
        } else if (event === 'token') {
          if (firstToken) {
            firstToken = false
            emit('action', 'talking', false)
          }
          bubble.text = (bubble.text || '') + data.text
          scrollToEnd()
        } else if (event === 'emotion') {
          const mapped = EMOTION_TO_ACTION[data.mood]
          if (mapped && mapped !== 'idle') emit('action', mapped, false)
        } else if (event === 'tool') {
          bubble.meta = `正在查 ${data.name}…`
        } else if (event === 'done') {
          bubble.text = data.text || bubble.text
          bubble.meta = ''
          const mapped = EMOTION_TO_ACTION[data.mood]
          emit('action', mapped && mapped !== 'idle' ? mapped : 'idle', true)
        } else if (event === 'error') {
          bubble.text = '出错了：' + data.message
          bubble.meta = ''
        }
      },
    })
    if (!bubble.text) bubble.text = '（没听到回复，再说一次？）'
  } catch (err) {
    online.value = false
    bubble.text = fallback[fallbackIndex % fallback.length]
    bubble.meta = '演示回复 · 后端未连接'
    fallbackIndex += 1
    emit('action', 'idle', true)
  } finally {
    busy.value = false
    scrollToEnd()
  }
}

async function clearHistory() {
  await resetChat(sessionId.value)
  sessionId.value = ''
  localStorage.removeItem('yao:session')
  messages.value = []
  push('agent', '记忆清空了，我们重新开始吧。')
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

watch(
  () => ui.agentOpen,
  (open) => {
    if (open) greet()
  }
)

defineExpose({ greet })
</script>

<template>
  <section class="panel" aria-label="和垚垚聊天">
    <header class="panel__hdr">
      <div class="who">
        <AgentFace :size="30" :mood="busy ? 'thinking' : 'idle'" />
        <div>
          <p class="who__name">垚垚</p>
          <p class="who__state">
            <span class="dot" :class="{ 'is-on': online }" />
            {{ online ? '在线' : '未连接' }}
          </p>
        </div>
      </div>

      <div class="acts">
        <button type="button" class="mini" @click="clearHistory">清空</button>
        <button type="button" class="mini" aria-label="收起" @click="emit('close')">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" stroke-width="1.2" />
            <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" stroke-width="1.2" />
          </svg>
        </button>
      </div>
    </header>

    <div ref="listEl" class="panel__body">
      <div v-for="(m, i) in messages" :key="i" class="msg" :class="`msg--${m.role}`">
        <p class="msg__text">{{ m.text || '…' }}</p>
        <p v-if="m.meta" class="msg__meta">{{ m.meta }}</p>
      </div>
    </div>

    <form class="panel__foot" @submit.prevent="send">
      <textarea
        v-model="input"
        rows="1"
        placeholder="问点什么…"
        :disabled="busy"
        @keydown="onKeydown"
      />
      <button type="submit" class="send" :disabled="busy || !input.trim()">
        {{ busy ? '…' : '发送' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.panel {
  position: fixed;
  right: clamp(16px, 2.4vw, 34px);
  bottom: calc(clamp(16px, 2.4vw, 34px) + 224px);
  z-index: var(--z-agent);
  width: min(392px, calc(100vw - 32px));
  height: min(500px, calc(100vh - 240px));
  display: flex;
  flex-direction: column;
  background: var(--cream);
  border: 1px solid var(--line);
  box-shadow: 0 40px 80px -40px rgba(41, 40, 36, 0.5);
  overflow: hidden;
}

.panel__hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-soft);
}

.who {
  display: flex;
  align-items: center;
  gap: 9px;
}

.who__name {
  font-family: var(--font-cn);
  font-size: 14px;
  letter-spacing: 0.14em;
  line-height: 1.2;
}

.who__state {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--ink-40);
  margin-top: 2px;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ink-40);
}

.dot.is-on {
  background: var(--celadon);
}

.acts {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mini {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ink-40);
  padding: 6px 8px;
  display: grid;
  place-items: center;
}

.mini:hover {
  color: var(--ink);
}

.panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.msg {
  max-width: 88%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg--agent {
  align-self: flex-start;
}

.msg--user {
  align-self: flex-end;
  align-items: flex-end;
}

.msg__text {
  padding: 9px 13px;
  font-size: 13.5px;
  line-height: 1.75;
  letter-spacing: 0.02em;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg--agent .msg__text {
  background: var(--paper-4);
  border: 1px solid var(--line-soft);
  border-radius: 2px 12px 12px 12px;
  color: var(--ink);
}

.msg--user .msg__text {
  background: var(--celadon);
  color: var(--cream);
  border-radius: 12px 2px 12px 12px;
}

.msg__meta {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--ink-40);
  padding-inline: 4px;
}

.panel__foot {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 11px 12px;
  border-top: 1px solid var(--line-soft);
}

.panel__foot textarea {
  flex: 1;
  resize: none;
  max-height: 92px;
  padding: 9px 11px;
  font-size: 13.5px;
  line-height: 1.6;
  background: var(--paper-4);
  border: 1px solid var(--line);
  outline: none;
  transition: border-color 300ms var(--ease);
}

.panel__foot textarea:focus {
  border-color: var(--celadon);
}

.send {
  padding: 9px 15px;
  font-size: 12px;
  letter-spacing: 0.12em;
  background: var(--ink);
  color: var(--cream);
  transition: opacity 300ms var(--ease);
}

.send:disabled {
  opacity: 0.4;
}

@media (max-width: 720px) {
  .panel {
    right: 12px;
    left: 12px;
    width: auto;
    bottom: 12px;
    height: min(62vh, calc(100vh - 120px));
  }
}
</style>
