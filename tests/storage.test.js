import { describe, it, expect, vi, afterEach } from 'vitest'
import { addHistory, getHistory, getIncense, lightIncense, getTodayAsked } from '../src/utils/storage'

afterEach(() => vi.restoreAllMocks())

describe('本机存储出错时不静默', () => {
  // S1：写入失败被空 catch 吞掉，记录悄悄丢失
  it('写入失败要记日志并提示用户', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    uni.setStorageSync.mockImplementation(() => {
      throw new Error('exceed storage max size')
    })
    addHistory({ deityId: 'mazu', no: 1 })
    expect(log).toHaveBeenCalled()
    expect(uni.showToast).toHaveBeenCalledWith(expect.objectContaining({ icon: 'none' }))
  })

  it('读取失败要记日志', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    uni.getStorageSync.mockImplementation(() => {
      throw new Error('boom')
    })
    expect(getHistory()).toEqual([])
    expect(log).toHaveBeenCalled()
  })

  // E2：存储里的数据形状不对时页面直接崩
  it('记录形状不对时按空处理并记日志，不崩', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    uni.setStorageSync('sb_history', 'oops')
    uni.setStorageSync('sb_incense', { days: 'x' })
    uni.setStorageSync('sb_asked', 'x')
    expect(getHistory()).toEqual([])
    expect(getIncense()).toEqual({ days: [], wishes: [], last: null })
    expect(() => lightIncense({ deityId: 'mazu', wish: '平安' })).not.toThrow()
    expect(getTodayAsked()).toEqual({})
    expect(log).toHaveBeenCalled()
  })

  it('正常读写不受影响', () => {
    addHistory({ deityId: 'mazu', no: 1 })
    expect(getHistory()).toHaveLength(1)
    expect(uni.showToast).not.toHaveBeenCalled()
  })
})
