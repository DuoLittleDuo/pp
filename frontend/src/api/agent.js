/**
 * 垚垚聊天接口
 *
 * 后端：agent/ 目录，uvicorn src.server:app --port 8000
 * 事件：session / token / emotion / tool / done / error
 *
 * 用法：
 *   await streamChat({ message, sessionId, onEvent: (type, data) => {} })
 */

const BASE = '/api'

export async function streamChat({ message, sessionId, onEvent, signal }) {
  const resp = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId || null }),
    signal,
  })

  if (!resp.ok || !resp.body) {
    throw new Error(`HTTP ${resp.status}`)
  }

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() || ''

    for (const block of blocks) {
      if (!block.trim()) continue

      let event = 'message'
      let data = ''
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        else if (line.startsWith('data:')) data += line.slice(5).trim()
      }
      if (!data) continue

      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        continue
      }
      onEvent?.(event, payload)
    }
  }
}

export async function resetChat(sessionId) {
  if (!sessionId) return
  try {
    await fetch(`${BASE}/reset?session_id=${encodeURIComponent(sessionId)}`, {
      method: 'POST',
    })
  } catch {
    /* 后端没起也不影响前端 */
  }
}

export async function health() {
  try {
    const r = await fetch(`${BASE}/health`)
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}
