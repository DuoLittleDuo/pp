/**
 * 垚垚的动作素材表
 *
 * 视频统一 1280×720、10 秒、透明背景，放在 public/assets/agent/actions/
 * 想换动作，只要替换同名文件，不用改代码。
 */

export const ACTIONS = {
  idle: 'idle',
  greeting: 'greeting',
  thinking: 'thinking',
  talking: 'talking',
  happy: 'happy',
  cheer: 'cheer',
  shipping: 'shipping',
}

/** 后端情绪 → 动作 */
export const EMOTION_TO_ACTION = {
  happy: 'happy',
  shy: 'happy',
  surprised: 'cheer',
  thinking: 'thinking',
  neutral: 'idle',
  sad: 'thinking',
  angry: 'thinking',
}

/** 页面场景 → 动作（进入某个页面时播一次） */
export const SCENE_TO_ACTION = {
  home: 'greeting',
  shop: 'talking',
  product: 'talking',
  customize: 'thinking',
  cart: 'talking',
  'pay-result': 'cheer',
  account: 'happy',
}

export function actionUrl(name) {
  return `/assets/agent/actions/${name}.webm`
}

/** 视频加载失败时回退到 CSS 画的圆头 */
export const FALLBACK_IMAGE = '/assets/agent/avatar.webp'
