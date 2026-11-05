// 签文数据：由 npm run build:data 从 data/qian/*.json 生成到 src/generated/qian/
const modules = import.meta.glob('../generated/qian/*.json', { eager: true, import: 'default' })

const sets = {}
for (const [path, data] of Object.entries(modules)) {
  if (path.endsWith('/index.json')) continue
  sets[data.deity.id] = data
}

export const TOPICS = [
  { key: 'study', name: '学业', icon: '笔' },
  { key: 'career', name: '工作', icon: '印' },
  { key: 'love', name: '爱情', icon: '缘' },
  { key: 'wealth', name: '财运', icon: '财' },
  { key: 'health', name: '健康', icon: '安' },
  { key: 'travel', name: '出行', icon: '行' },
]

export const topicName = (key) => TOPICS.find((t) => t.key === key)?.name ?? key

// 事项 → 推荐神明（按优先级）
const RECOMMEND = {
  study: ['wenchang', 'mazu'],
  career: ['guandi', 'mazu'],
  love: ['yuelao', 'mazu'],
  wealth: ['caishen', 'guandi', 'mazu'],
  health: ['guanyin', 'mazu'],
  travel: ['mazu'],
}

const ORDER = ['mazu', 'guanyin', 'wenchang', 'guandi', 'caishen', 'yuelao']

export function listDeities() {
  return Object.values(sets)
    .map((s) => ({ ...s.deity, setName: s.set.name, total: s.set.total }))
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
}

export function recommendDeity(topic) {
  return (RECOMMEND[topic] || []).find((id) => sets[id]) || listDeities()[0]?.id
}

export const getSet = (deityId) => sets[deityId]

export function getQian(deityId, no) {
  const s = sets[deityId]
  if (!s) return null
  const q = s.qian[no - 1]
  return q ? { ...q, deity: s.deity, set: s.set } : null
}

export const LEVEL_SCORE = { 上上: 5, 上: 4, 中: 3, 下: 2, 下下: 1 }

const CN_NUM = '零一二三四五六七八九'
export function cnNumber(n) {
  if (n <= 10) return n === 10 ? '十' : CN_NUM[n]
  if (n < 20) return '十' + CN_NUM[n - 10]
  if (n < 100) return CN_NUM[Math.floor(n / 10)] + '十' + (n % 10 ? CN_NUM[n % 10] : '')
  return '一百'
}
