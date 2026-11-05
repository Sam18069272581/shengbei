// 音效：木筊落地、签筒、磬、风铃（scripts/make-sounds.py 合成）。默认开启，可在首页关闭，设置存本机。
const urls = import.meta.glob('../static/sound/*.mp3', { eager: true, import: 'default', query: '?url' })
const src = (name) => urls[`../static/sound/${name}.mp3`] || ''

const KEY = 'sb_sound'
let enabled = (() => {
  try {
    return uni.getStorageSync(KEY) !== 'off'
  } catch {
    return true
  }
})()

export const soundOn = () => enabled
export function setSound(on) {
  enabled = on
  try {
    uni.setStorageSync(KEY, on ? 'on' : 'off')
  } catch {}
}

// 每种音效复用一个播放器，避免反复创建
const players = {}
export function play(name, { volume = 1 } = {}) {
  if (!enabled || !src(name)) return
  try {
    let p = players[name]
    if (!p) {
      p = players[name] = uni.createInnerAudioContext()
      p.src = src(name)
      p.obeyMuteSwitch = true // iOS 静音键开启时不出声
    }
    p.volume = volume
    p.stop()
    p.seek?.(0)
    p.play()
  } catch {}
}
export function stop(name) {
  try {
    players[name]?.stop()
  } catch {}
}
