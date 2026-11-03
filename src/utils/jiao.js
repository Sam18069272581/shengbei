// 掷筊：两片筊杯各自随机落地，平面朝上或凸面朝上各约一半
// 一平一凸 = 圣筊（允），两平 = 笑筊（未明），两凸 = 阴筊（否）
export const JIAO = {
  sheng: { name: '圣筊', short: '允', desc: '一平一凸，神明应允。' },
  xiao: { name: '笑筊', short: '笑', desc: '两面皆平，神明笑而不答，可把问题想清楚再问。' },
  yin: { name: '阴筊', short: '否', desc: '两面皆凸，神明不认同，或时机未到。' },
}

export function throwJiao(rand = Math.random) {
  const a = rand() < 0.5 // true = 平面朝上
  const b = rand() < 0.5
  const kind = a !== b ? 'sheng' : a ? 'xiao' : 'yin'
  return { kind, blocks: [a, b], ...JIAO[kind] }
}
