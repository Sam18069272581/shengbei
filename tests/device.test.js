import { describe, it, expect, vi, afterEach } from 'vitest'
import { useShake } from '../src/utils/shake'

afterEach(() => vi.restoreAllMocks())

describe('设备能力不可用时记日志', () => {
  // S3：加速度计不可用被空 catch 和空 fail 吞掉
  it('摇一摇启动失败记日志', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    uni.onAccelerometerChange = vi.fn()
    uni.startAccelerometer = () => {
      throw new Error('not supported')
    }
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

  // H5 上 onAccelerometerChange 内部会再调一次不带回调的 startAccelerometer，
  // 设备不支持时那次返回的 Promise 被拒绝且没人接，变成未捕获错误。
  // 所以必须等 startAccelerometer 成功后才注册监听。
  it('加速度计启动失败时不注册监听', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    uni.onAccelerometerChange = vi.fn()
    uni.startAccelerometer = ({ fail }) => fail({ errMsg: 'startAccelerometer:fail prompt' })
    useShake(() => {}).start()
    expect(uni.onAccelerometerChange).not.toHaveBeenCalled()
  })

  it('启动成功后才注册监听，摇动触发回调', () => {
    let listener
    uni.onAccelerometerChange = vi.fn((fn) => (listener = fn))
    uni.startAccelerometer = ({ success }) => success()
    const cb = vi.fn()
    useShake(cb).start()
    expect(uni.onAccelerometerChange).toHaveBeenCalledTimes(1)
    listener({ x: 2, y: 0, z: 0 })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('启动还没成功就离开页面，成功回来也不再注册', () => {
    let ok
    uni.onAccelerometerChange = vi.fn()
    uni.offAccelerometerChange = vi.fn()
    uni.stopAccelerometer = vi.fn()
    uni.startAccelerometer = ({ success }) => (ok = success)
    const s = useShake(() => {})
    s.start()
    s.stop()
    ok()
    expect(uni.onAccelerometerChange).not.toHaveBeenCalled()
  })
})
