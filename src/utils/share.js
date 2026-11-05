// 小程序「转发」内容：有签就带上这支签，朋友点开直接看解签；找不到签（如数据更新后的旧链接）就转发首页
import { cnNumber } from './qian'

export function shareMessage(q) {
  if (!q) return { title: '圣杯 · 求签问事', path: '/pages/index/index' }
  return {
    title: `我求得${q.deity.name}第${cnNumber(q.no)}签 · ${q.level}签`,
    path: `/pages/result/result?deity=${q.deity.id}&no=${q.no}`,
  }
}
