const get = (k, d) => {
  try {
    const v = uni.getStorageSync(k)
    return v === '' || v === undefined ? d : v
  } catch {
    return d
  }
}
const set = (k, v) => {
  try {
    uni.setStorageSync(k, v)
  } catch {}
}

export function deviceId() {
  let id = get('sb_device', '')
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    set('sb_device', id)
  }
  return id
}

export function today(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// 求签记录：最新在前，最多 100 条
export function addHistory(item) {
  const list = get('sb_history', [])
  list.unshift({ ...item, at: Date.now() })
  set('sb_history', list.slice(0, 100))
}
export const getHistory = () => get('sb_history', [])
export const clearHistory = () => set('sb_history', [])
