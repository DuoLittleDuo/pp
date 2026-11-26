<script setup>
import { computed, ref, watch } from 'vue'
import AgentFace from './AgentFace.vue'
import { actionUrl } from '@/config/agent-media'

/**
 * 垚垚的视频形象
 * - action 换值 → 重新加载对应 webm
 * - once=true 时播完发 ended，父组件负责切回待机
 * - 视频加载失败 → 退回 CSS 圆头，不会白屏
 */
const props = defineProps({
  action: { type: String, default: 'idle' },
  once: { type: Boolean, default: false },
  ratio: { type: String, default: '16/9' },
})

const emit = defineEmits(['ended', 'failed'])

const failed = ref(false)
const loaded = ref(false)
const videoEl = ref(null)

const src = computed(() => actionUrl(props.action))

watch(
  () => props.action,
  () => {
    failed.value = false
    loaded.value = false
  }
)

function onEnded() {
  if (props.once) emit('ended')
  else if (videoEl.value) {
    videoEl.value.currentTime = 0
    videoEl.value.play().catch(() => {})
  }
}

function onError() {
  failed.value = true
  emit('failed')
}
</script>

<template>
  <div class="stage" :style="{ aspectRatio: ratio }">
    <video
      v-if="!failed"
      :key="action"
      ref="videoEl"
      class="stage__video"
      :src="src"
      autoplay
      muted
      playsinline
      preload="auto"
      :class="{ 'is-in': loaded }"
      @loadeddata="loaded = true"
      @ended="onEnded"
      @error="onError"
    />
    <div v-else class="stage__fallback">
      <AgentFace :size="88" />
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--cream-2);
}

.stage__video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 420ms var(--ease);
}

.stage__video.is-in {
  opacity: 1;
}

.stage__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}
</style>
