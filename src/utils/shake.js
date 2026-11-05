// 摇一摇：监听加速度，超过阈值触发回调。
// H5 需 HTTPS、iOS 需授权，不可用时记日志后忽略：页面上仍有「摇签」「掷筊」按钮可点，不影响使用。
//
// 顺序很重要：先 startAccelerometer，成功后再 onAccelerometerChange。
// uni H5 的 onAccelerometerChange 内部会再调一次不带回调的 startAccelerometer，
// 设备不支持时那次的 Promise 被拒绝却没人接，就成了页面上的未捕获错误。
// 先启动成功，内部那次调用就会直接 resolve。
export function useShake(cb, threshold = 1.8, cooldown = 1500) {
  let last = 0
  let wanted = false // 页面是否希望监听（onShow 到 onHide 之间）
  let listening = false
  const handler = (e) => {
    const g = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z)
    const now = Date.now()
    if (g > threshold && now - last > cooldown) {
      last = now
      cb()
    }
  }
  const warn = (what, e) => console.warn(`[shake] ${what}，摇一摇不可用`, e)
  return {
    start() {
      if (wanted) return
      wanted = true
      try {
        uni.startAccelerometer({
          interval: 'game',
          success: () => {
            // 启动是异步的：等它成功时页面可能已经离开了
            if (!wanted || listening) return
            uni.onAccelerometerChange(handler)
            listening = true
          },
          fail: (e) => warn('startAccelerometer 失败', e),
        })
      } catch (e) {
        warn('启动加速度计出错', e)
      }
    },
    stop() {
      if (!wanted) return
      wanted = false
      try {
        if (listening) uni.offAccelerometerChange?.(handler)
        uni.stopAccelerometer({ fail: (e) => warn('stopAccelerometer 失败', e) })
      } catch (e) {
        warn('停止加速度计出错', e)
      }
      listening = false
    },
  }
}
