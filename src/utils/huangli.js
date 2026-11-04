// 黄历：农历、干支、宜忌、冲煞等，全部由 lunar-javascript（MIT）离线推算，不联网
import { Solar } from 'lunar-javascript'

const WEEK = ['日', '一', '二', '三', '四', '五', '六']
const DAY_MS = 86400000

// 本站四位神明的圣诞（农历，取民间通行日期）与朔望
const SHEN_DAN = {
  '2-3': '文昌帝君圣诞',
  '3-23': '妈祖圣诞',
  '6-24': '关圣帝君圣诞',
  '8-15': '月下老人圣诞',
}

const parse = (date) => {
  if (date instanceof Date) return date
  const [y, m, d] = String(date).split('-').map(Number)
  return new Date(y, m - 1, d)
}
const ymd = (d) => [d.getFullYear(), d.getMonth() + 1, d.getDate()]

// 农历短文本，如「九月廿六」
export function lunarText(date = new Date()) {
  const l = Solar.fromYmd(...ymd(parse(date))).getLunar()
  return `${l.getMonthInChinese()}月${l.getDayInChinese()}`
}

// 某天的完整黄历
export function huangli(date = new Date()) {
  const d = parse(date)
  const solar = Solar.fromYmd(...ymd(d))
  const l = solar.getLunar()

  // 当天交节就显示当天节气，否则显示下一个节气及剩余天数
  const next = l.getNextJieQi(true)
  const ns = next.getSolar()
  const nextDate = new Date(ns.getYear(), ns.getMonth() - 1, ns.getDay())
  const jieqi = l.getJieQi()
    ? { name: l.getJieQi(), today: true, days: 0 }
    : { name: next.getName(), today: false, days: Math.round((nextDate - d) / DAY_MS) }

  const festivals = [...l.getFestivals(), ...solar.getFestivals(), ...l.getOtherFestivals()]
  const shen = l.getMonth() > 0 ? SHEN_DAN[`${l.getMonth()}-${l.getDay()}`] : '' // 闰月不算
  if (shen) festivals.unshift(shen)
  // 初一、十五：民间习俗上香礼拜的日子
  const shuowang = l.getDay() === 1 ? '朔日 · 宜上香' : l.getDay() === 15 ? '望日 · 宜上香' : ''

  return {
    solar: { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), week: WEEK[d.getDay()] },
    lunar: {
      text: `${l.getMonthInChinese()}月${l.getDayInChinese()}`,
      month: l.getMonthInChinese() + '月',
      day: l.getDayInChinese(),
    },
    ganzhi: { year: l.getYearInGanZhi(), month: l.getMonthInGanZhi(), day: l.getDayInGanZhi() },
    shengxiao: l.getYearShengXiao(),
    yi: l.getDayYi(),
    ji: l.getDayJi(),
    chong: `冲${l.getDayChongShengXiao()}（${l.getDayChongGan()}${l.getDayChong()}）`,
    sha: `煞${l.getDaySha()}`,
    zhixing: l.getZhiXing() + '日',
    // 黄道/黑道：当日值神
    tianshen: { name: l.getDayTianShen(), type: l.getDayTianShenType(), luck: l.getDayTianShenLuck() },
    nayin: l.getDayNaYin(),
    xiu: `${l.getXiu()}${l.getZheng()}${l.getAnimal()}`,
    xiuLuck: l.getXiuLuck(),
    pengzu: [l.getPengZuGan(), l.getPengZuZhi()],
    jishen: l.getDayJiShen(),
    xiongsha: l.getDayXiongSha(),
    position: { xi: l.getDayPositionXiDesc(), cai: l.getDayPositionCaiDesc(), fu: l.getDayPositionFuDesc() },
    // 十二时辰吉凶（去掉末尾重复的夜子时）
    hours: l.getTimes().slice(0, 12).map((t) => ({ zhi: t.getZhi(), luck: t.getTianShenLuck() })),
    jieqi,
    festivals,
    shuowang,
  }
}
