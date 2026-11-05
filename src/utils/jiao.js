// 掷筊：两片筊杯各自随机落地，平面朝上或凸面朝上各约一半
// 一平一凸 = 圣筊（允），两平 = 笑筊（未明），两凸 = 阴筊（否）
// 另有极少见的「立筊」：一片筊杯立着不倒，民间视为神明另有指示，须重掷。
// 现实中筊杯并非理想硬币（凸面着地会晃、易翻面），但目前没有公开的实测频率，
// 所以仍按各一半计；立筊概率是自定的彩蛋值，不是实测。
export const JIAO = {
  sheng: { name: '圣筊', short: '允', desc: '一平一凸，神明应允。' },
  xiao: { name: '笑筊', short: '笑', desc: '两面皆平，神明笑而不答，可把问题想清楚再问。' },
  yin: { name: '阴筊', short: '否', desc: '两面皆凸，神明不认同，或时机未到。' },
  li: { name: '立筊', short: '立', desc: '筊杯竟立而不倒，极为罕见，神明另有指示，请重掷一次。' },
}
export const LI_CHANCE = 1 / 200

export function throwJiao(rand = Math.random) {
  const a = rand() < 0.5 // true = 平面朝上
  const b = rand() < 0.5
  if (rand() < LI_CHANCE) {
    // standing：立着的是哪一片
    return { kind: 'li', blocks: [a, b], standing: rand() < 0.5 ? 0 : 1, ...JIAO.li }
  }
  const kind = a !== b ? 'sheng' : a ? 'xiao' : 'yin'
  return { kind, blocks: [a, b], standing: -1, ...JIAO[kind] }
}
