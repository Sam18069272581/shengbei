import { describe, it, expect } from 'vitest'
import { cnNumber, stripEndPunct, listDeities, getQian } from '../src/utils/qian'

describe('cnNumber', () => {
  it('1–100 与常见签号写法一致', () => {
    expect([1, 10, 11, 20, 21, 60, 99, 100].map(cnNumber)).toEqual(['一', '十', '十一', '二十', '二十一', '六十', '九十九', '一百'])
  })
  // B3：大于 100 一律写死返回「一百」
  it('大于 100 的签号不再一律显示一百', () => {
    expect(cnNumber(101)).toBe('一百零一')
    expect(cnNumber(110)).toBe('一百一十')
    expect(cnNumber(120)).toBe('一百二十')
    expect(cnNumber(365)).toBe('三百六十五')
  })
  it('非法签号直接报错，不静默给一个错数', () => {
    expect(() => cnNumber(0)).toThrow(RangeError)
    expect(() => cnNumber(1000)).toThrow(RangeError)
    expect(() => cnNumber(1.5)).toThrow(RangeError)
  })
})

describe('stripEndPunct', () => {
  it('去掉句末中文标点，句中标点保留', () => {
    expect(stripEndPunct('天地，人和。')).toBe('天地，人和')
    expect(stripEndPunct('无标点')).toBe('无标点')
  })
})

describe('签文数据', () => {
  it('每位神明的签都能按签号取到', () => {
    const ds = listDeities()
    expect(ds.length).toBeGreaterThan(0)
    for (const d of ds) {
      expect(getQian(d.id, 1)?.no).toBe(1)
      expect(getQian(d.id, d.total)?.no).toBe(d.total)
      expect(getQian(d.id, d.total + 1)).toBeNull()
    }
  })
})
