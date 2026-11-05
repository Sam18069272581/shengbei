import { describe, it, expect, vi, afterEach } from 'vitest'
import { useShake } from '../src/utils/shake'

afterEach(() => vi.restoreAllMocks())

describe('设备能力不可用时记日志', () => {
  // S3：加速度计不可用被空 catch 和空 fail 吞掉
  it('摇一摇启动失败记日志', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    uni.onAccelerometerChange = () => {
      throw new Error('not supported')
    }
    uni.startAccelerometer = vi.fn()
    useShake(() => {}).start()
    expect(warn).toHaveBeenCalled()
  })

  it('startAccelerometer 的 fail 回调记日志', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    uni.onAccelerometerChange = vi.fn()
    uni.startAccelerometer = ({ fail }) => fail({ errMsg: 'startAccelerometer:fail' })
    useShake(() => {}).start()
    expect(warn).toHaveBeenCalled()
  })
})
