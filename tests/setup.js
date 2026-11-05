// 测试用的 uni 替身：存储放内存里，各测试可用 vi.spyOn 改写行为
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  const store = new Map()
  globalThis.uni = {
    getStorageSync: vi.fn((k) => (store.has(k) ? store.get(k) : '')),
    setStorageSync: vi.fn((k, v) => store.set(k, v)),
    showToast: vi.fn(),
  }
})
