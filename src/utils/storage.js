// 本机存储。读写失败不能静默吞掉：一律记日志；写失败还要告诉用户（记录可能没存上）。
// valid：校验读出的数据形状，旧版本或损坏的数据按默认值处理，同样记日志。
const get = (k, d, valid = () => true) => {
  let v
  try {
    v = uni.getStorageSync(k)
  } catch (e) {
    console.error(`[storage] 读取 ${k} 失败`, e)
    return d
  }
  if (v === '' || v === undefined) return d
  if (!valid(v)) {
    console.error(`[storage] ${k} 数据格式不对，已按空处理`, v)
    return d
  }
  return v
}

let toasted = false
const set = (k, v) => {
  try {
    uni.setStorageSync(k, v)
    return true
  } catch (e) {
    console.error(`[storage] 写入 ${k} 失败`, e)
    // 同一次打开只提示一次，避免连续弹窗
    if (!toasted) {
      toasted = true
      uni.showToast({ title: '本机存储失败，记录可能没保存', icon: 'none' })
    }
    return false
  }
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

export function deviceId() {
  let id = get('sb_device', '', (v) => typeof v === 'string')
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
  const list = get('sb_history', [], Array.isArray)
  list.unshift({ ...item, at: Date.now() })
  set('sb_history', list.slice(0, 100))
}
export const getHistory = () => get('sb_history', [], Array.isArray)
export const clearHistory = () => set('sb_history', [])

// 个人资料（目前只有生日），只存本机
export const getProfile = () => get('sb_profile', null, isObj)
export const setProfile = (p) => set('sb_profile', p)

// 上香记录：days 为上过香的日期（去重，最多一年），wishes 为最近的心愿
export const BURN_MS = 3 * 60 * 1000 // 一炷香在页面上燃 3 分钟
export function getIncense() {
  return get('sb_incense', { days: [], wishes: [], last: null }, (v) => isObj(v) && Array.isArray(v.days) && Array.isArray(v.wishes))
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

// 一神一天一签：记录今天向每位神明正式求过的签（no 为空表示三次未得圣筊、改日再求）
export function getTodayAsked() {
  const s = get('sb_asked', {}, isObj)
  return s.date === today() ? s.by || {} : {}
}
export function markAsked(deityId, rec) {
  const by = { ...getTodayAsked(), [deityId]: { ...rec, at: Date.now() } }
  set('sb_asked', { date: today(), by })
}

// 音效开关：默认开启
export const getSoundOn = () => get('sb_sound', 'on', (v) => v === 'on' || v === 'off') !== 'off'
export const setSoundOn = (on) => set('sb_sound', on ? 'on' : 'off')
