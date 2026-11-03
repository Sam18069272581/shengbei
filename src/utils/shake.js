// 摇一摇：监听加速度，超过阈值触发回调（H5 需 HTTPS，iOS 需授权，不可用时静默忽略）
export function useShake(cb, threshold = 1.8, cooldown = 1500) {
  let last = 0
  let on = false
  const handler = (e) => {
    const g = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z)
    const now = Date.now()
    if (g > threshold && now - last > cooldown) {
      last = now
      cb()
    }
  }
  return {
    start() {
      if (on) return
      try {
        uni.onAccelerometerChange(handler)
        uni.startAccelerometer({ interval: 'game', fail: () => {} })
        on = true
      } catch {}
    },
    stop() {
      if (!on) return
      try {
        uni.offAccelerometerChange?.(handler)
        uni.stopAccelerometer({ fail: () => {} })
      } catch {}
      on = false
    },
  }
}
