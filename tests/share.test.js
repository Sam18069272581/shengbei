import { describe, it, expect } from 'vitest'
import { shareMessage } from '../src/utils/share'
import { getQian } from '../src/utils/qian'

describe('解签页转发', () => {
  it('有签时带上神明与签号', () => {
    const m = shareMessage(getQian('mazu', 3))
    expect(m.path).toBe('/pages/result/result?deity=mazu&no=3')
    expect(m.title).toContain('第三签')
  })
  // B2：找不到这支签时点转发会抛 TypeError
  it('找不到签时不报错，转发首页', () => {
    expect(() => shareMessage(null)).not.toThrow()
    expect(shareMessage(null).path).toBe('/pages/index/index')
  })
})
