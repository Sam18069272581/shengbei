// 音效：木筊落地、签筒、磬、风铃（scripts/make-sounds.py 合成）。默认开启，可在首页关闭，设置存本机。
import { getSoundOn, setSoundOn } from './storage'

const urls = import.meta.glob('../static/sound/*.mp3', { eager: true, import: 'default', query: '?url' })
const src = (name) => {
  const url = urls[`../static/sound/${name}.mp3`]
  if (!url) console.warn(`[sound] 找不到音效文件 ${name}.mp3`)
  return url || ''
}

let enabled = getSoundOn()

export const soundOn = () => enabled
export function setSound(on) {
  enabled = on
  setSoundOn(on)
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
      p.onError?.((e) => console.warn(`[sound] ${name} 播放出错`, e))
    }
    p.volume = volume
    p.stop()
    p.seek?.(0)
    p.play()
  } catch (e) {
    console.warn(`[sound] 播放 ${name} 失败`, e)
  }
}
export function stop(name) {
  try {
    players[name]?.stop()
  } catch (e) {
    console.warn(`[sound] 停止 ${name} 失败`, e)
  }
}
