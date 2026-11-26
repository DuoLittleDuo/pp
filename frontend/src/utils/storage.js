/**
 * 本地存储 —— 第一版把订单、收藏、定做方案存在浏览器里
 * 以后接后端，只要把这几个 store 里的读写换成 api 请求即可
 */

const PREFIX = 'yao:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.warn('[storage] 读取失败', key, e)
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('[storage] 写入失败', key, e)
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch (e) {
    console.warn('[storage] 删除失败', key, e)
  }
}

/** 生成一个可读的编号，例如 Y20261114-8F3A */
export function makeCode(prefix = 'Y') {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase()
  return `${prefix}${stamp}-${rand}`
}

/** 金额显示：168 → ¥168.00 */
export function money(n) {
  const v = Number(n) || 0
  return '¥' + v.toFixed(2)
}
