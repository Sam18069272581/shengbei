import { describe, it, expect } from 'vitest'
import { huangli } from '../src/utils/huangli'

describe('huangli 节气倒计时', () => {
  // B1：黄历页传入带时分的 new Date()，过了中午倒计时少算一天
  it('同一天无论几点，距下一节气的天数都一样', () => {
    const byString = huangli('2026-11-05').jieqi
    for (const h of [0, 9, 12, 13, 21, 23]) {
      expect(huangli(new Date(2026, 10, 5, h, 30)).jieqi).toEqual(byString)
    }
    expect(byString).toEqual({ name: '立冬', today: false, days: 2 })
  })

  it('节气当天显示今日', () => {
    expect(huangli(new Date(2026, 10, 7, 22, 0)).jieqi).toEqual({ name: '立冬', today: true, days: 0 })
  })
})
