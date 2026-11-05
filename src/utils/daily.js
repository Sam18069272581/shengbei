import { hashString, mulberry32, randInt, pickN } from './random'
import { listDeities, getSet, LEVEL_SCORE } from './qian'
import { deviceId, today } from './storage'
import { huangli } from './huangli'
import { dailySaying } from './saying'
import { zodiacDay } from './zodiac'

const YI = ['读书温习', '整理计划', '拜访长辈', '投递简历', '约见朋友', '早睡早起', '运动出汗', '整理房间', '记账理财', '学习新技能', '表达心意', '静心独处', '出门散步', '向人请教']
const JI = ['冲动消费', '熬夜', '与人争执', '轻信传言', '拖延', '暴饮暴食', '仓促决定', '背后议论', '借贷担保', '过度劳累']
const COLORS = ['朱红', '金黄', '翠绿', '月白', '藏青', '绛紫', '橙黄', '墨黑']

const ASPECTS = [
  { key: 'study', name: '学业' },
  { key: 'career', name: '工作' },
  { key: 'love', name: '爱情' },
  { key: 'wealth', name: '财运' },
]

// 同一设备同一天结果固定
export function dailyFortune(date = today()) {
  const rand = mulberry32(hashString(`${deviceId()}|${date}`))

  // 当日一签：随机神明 + 随机签号
  const deities = listDeities()
  let qian = null
  if (deities.length) {
    const d = deities[randInt(rand, deities.length)]
    const s = getSet(d.id)
    const q = s.qian[randInt(rand, s.qian.length)]
    qian = { deityId: d.id, deityName: d.name, no: q.no, level: q.level, poem: q.poem }
  }

  // 综合分以当日签吉凶为基准，各项在其上下浮动（2–5 星）
  const base = qian ? LEVEL_SCORE[qian.level] : 3
  // 运势最低两星：娱乐产品，避免给人过重的负面暗示
  const clamp = (n) => Math.max(2, Math.min(5, n))
  const aspects = ASPECTS.map((a) => ({ ...a, stars: clamp(base + randInt(rand, 3) - 1) }))
  // 填了生日的话，当日与本命生肖相冲 -1、相合 +1
  const zodiac = zodiacDay(date)
  const overall = clamp(Math.round(aspects.reduce((s, a) => s + a.stars, 0) / aspects.length) + (zodiac?.delta || 0))

  const hl = huangli(date)
  // 签语用独立的随机流，不打乱下面宜忌、幸运色等已有结果
  const saying = dailySaying(mulberry32(hashString(`saying|${deviceId()}|${date}`)), qian?.level, hl)

  return {
    date,
    hl,
    saying,
    zodiac,
    overall,
    aspects,
    qian,
    yi: pickN(rand, YI, 3),
    ji: pickN(rand, JI, 2),
    color: COLORS[randInt(rand, COLORS.length)],
    number: 1 + randInt(rand, 9),
  }
}
