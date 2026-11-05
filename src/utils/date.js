// 日期工具：统一把「YYYY-MM-DD」字符串或 Date 解析成当天本地 0 点，避免各处带着时分相减
export function parseYmd(date) {
  let d
  if (date instanceof Date) {
    d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  } else {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(date))
    if (m) d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  }
  if (!d || Number.isNaN(d.getTime())) throw new RangeError(`无法解析的日期：${date}`)
  return d
}

// [年, 月(1–12), 日]，给 lunar-javascript 的 Solar.fromYmd 用
export const ymdParts = (date) => {
  const d = parseYmd(date)
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()]
}
