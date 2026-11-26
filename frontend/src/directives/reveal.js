/**
 * v-reveal —— 元素进入视口时淡入并小幅上移
 * 用法：<div v-reveal>…</div>  <div v-reveal="{ delay: 200 }">…</div>
 */

let observer = null

function ensureObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const delay = Number(el.dataset.revealDelay || 0)
        window.setTimeout(() => el.classList.add('is-in'), delay)
        observer.unobserve(el)
      })
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  )
  return observer
}

export default {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value?.delay) el.dataset.revealDelay = binding.value.delay

    // 系统开了「减少动态效果」就不做，直接显示
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('is-in')
      return
    }
    ensureObserver().observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}
