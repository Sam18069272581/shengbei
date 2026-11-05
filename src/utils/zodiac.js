// 生肖个性化：用户填一次生日，按当日地支与本命地支的冲、合、害关系给提醒。
// 全部本地推算（lunar-javascript），生日只存在本机。
import { Solar } from 'lunar-javascript'
import { getProfile } from './storage'
import { ymdParts } from './date'

const ZHI = '子丑寅卯辰巳午未申酉戌亥'
const ANIMAL = '鼠牛虎兔龙蛇马羊猴鸡狗猪'

// 六合、三合、相害（地支两两关系）
const LIUHE = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未']
const SANHE = ['申子辰', '亥卯未', '寅午戌', '巳酉丑']
const HAI = ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌']
const pair = (list, a, b) => list.some((p) => p.includes(a) && p.includes(b))

// 按农历年定生肖（以春节为界，民间最常用的算法）
export function zodiacOf(birthday) {
  const l = Solar.fromYmd(...ymdParts(birthday)).getLunar()
  const zhi = l.getYearZhi()
  return { zhi, animal: ANIMAL[ZHI.indexOf(zhi)] }
}

// 地支关系 → 提醒与对运势的轻微加减（-1 / 0 / +1）
function relation(dayZhi, myZhi) {
  const diff = Math.abs(ZHI.indexOf(dayZhi) - ZHI.indexOf(myZhi))
  if (dayZhi === myZhi) return { key: 'self', tag: '本命日', text: '今日与你同支，做事顺手，但别太自满。', delta: 0, good: true }
  if (diff === 6) return { key: 'chong', tag: '冲', text: '今日冲你的生肖，宜低调行事，重要决定可以缓一缓。', delta: -1, good: false }
  if (pair(LIUHE, dayZhi, myZhi)) return { key: 'liuhe', tag: '六合', text: '今日与你六合，容易遇到贵人，适合谈合作、表心意。', delta: 1, good: true }
  if (pair(SANHE, dayZhi, myZhi)) return { key: 'sanhe', tag: '三合', text: '今日与你三合，气场相投，适合团队协作、出门办事。', delta: 1, good: true }
  if (pair(HAI, dayZhi, myZhi)) return { key: 'hai', tag: '相害', text: '今日与你相害，小事容易起摩擦，说话多留三分。', delta: 0, good: false }
  return { key: 'ping', tag: '平', text: '今日与你无冲无合，按部就班即可。', delta: 0, good: true }
}

// 流年太岁：本命年为值太岁，对冲为冲太岁
function taisui(yearZhi, myZhi) {
  if (yearZhi === myZhi) return '今年是你的本命年（值太岁），凡事稳中求进。'
  if (Math.abs(ZHI.indexOf(yearZhi) - ZHI.indexOf(myZhi)) === 6) return '今年冲太岁，宜多静少动，凡事留余地。'
  return ''
}

// 某天对当前用户的生肖提醒；没填生日返回 null
export function zodiacDay(date, profile = getProfile()) {
  if (!profile?.birthday) return null
  const me = zodiacOf(profile.birthday)
  const l = Solar.fromYmd(...ymdParts(date)).getLunar()
  const dayZhi = l.getDayZhi()
  return {
    ...me,
    dayAnimal: ANIMAL[ZHI.indexOf(dayZhi)],
    ...relation(dayZhi, me.zhi),
    taisui: taisui(l.getYearZhi(), me.zhi),
  }
}
