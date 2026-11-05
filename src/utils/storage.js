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

// 个人资料（目前只有生日），只存本机
export const getProfile = () => get('sb_profile', null)
export const setProfile = (p) => set('sb_profile', p)

// 上香记录：days 为上过香的日期（去重，最多一年），wishes 为最近的心愿
export const BURN_MS = 3 * 60 * 1000 // 一炷香在页面上燃 3 分钟
export function getIncense() {
  return get('sb_incense', { days: [], wishes: [], last: null })
}
export function lightIncense({ deityId, wish }) {
  const s = getIncense()
  const day = today()
  if (!s.days.includes(day)) s.days = [day, ...s.days].slice(0, 366)
  const rec = { deityId, wish: wish || '', at: Date.now() }
  s.last = rec
  if (rec.wish) s.wishes = [rec, ...s.wishes].slice(0, 30)
  set('sb_incense', s)
  return s
}
// 连续上香天数：从今天（或昨天，今天还没上）往前数
export function incenseStreak(days = getIncense().days) {
  const set_ = new Set(days)
  const d = new Date()
  if (!set_.has(today(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set_.has(today(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
