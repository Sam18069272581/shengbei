<template>
  <view>
    <!-- 画布放在屏幕外，只用来生成图片 -->
    <canvas canvas-id="shareCanvas" id="shareCanvas" class="offscreen" :style="{ width: W + 'px', height: H + 'px' }" />

    <view v-if="show" class="mask" @click="close">
      <view class="sheet" @click.stop>
        <view v-if="!img" class="loading muted">签卡生成中…</view>
        <image v-else class="preview" :src="img" mode="widthFix" show-menu-by-longpress />
        <view class="tip muted">{{ isH5 ? '长按图片可保存或发送给朋友' : '保存到相册后即可分享' }}</view>
        <view class="ops">
          <view class="btn" :class="{ disabled: !img }" @click="save">保存图片</view>
          <view class="btn ghost" @click="close">关闭</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { art } from '../utils/art'
import { cnNumber } from '../utils/qian'
import { huangli } from '../utils/huangli'
import { today } from '../utils/storage'

const props = defineProps({ q: { type: Object, required: true } })

const W = 375
const H = 600
const show = ref(false)
const img = ref('')
const isH5 = process.env.UNI_PLATFORM === 'h5'
const proxy = getCurrentInstance().proxy

const GOLD = '#d4af6e'
const GOLD_LIGHT = '#f0d9a6'
const INK = '#2a1f16'
const VERMILION = '#c4473a'
const SERIF = "'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif"

// 神明像是带入场动画的 SVG，画到 canvas 上只会取第一帧（人物还是透明的）。
// H5：取出 SVG 文本，去掉动画后转成 data URL 再画。
// 小程序：canvas 只能画本地图片，先取本地路径，失败（如不支持 SVG）就不画神明像。
async function loadImage(src) {
  if (isH5) {
    try {
      const svg = (await (await fetch(src)).text())
        .replace(/animation:[^;}]+;?/g, '')
        .replace(/stroke-dashoffset:\s*\d+/g, 'stroke-dashoffset:0')
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    } catch {
      return src
    }
  }
  return new Promise((resolve) => uni.getImageInfo({ src, success: (r) => resolve(r.path), fail: () => resolve('') }))
}

async function draw() {
  const q = props.q
  const hl = huangli(today())
  const ctx = uni.createCanvasContext('shareCanvas', proxy)
  const text = (s, x, y, size, color, align = 'center', weight = 'normal') => {
    ctx.font = `${weight} ${size}px ${SERIF}`
    ctx.setFillStyle(color)
    ctx.setTextAlign(align)
    ctx.fillText(s, x, y)
  }

  // 底色 + 双金线框
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#2a2018')
  bg.addColorStop(1, '#14100c')
  ctx.setFillStyle(bg)
  ctx.fillRect(0, 0, W, H)
  ctx.setStrokeStyle(GOLD)
  ctx.setLineWidth(1.5)
  ctx.strokeRect(12, 12, W - 24, H - 24)
  ctx.setLineWidth(0.6)
  ctx.strokeRect(18, 18, W - 36, H - 36)

  text('圣 杯 · 灵 签', W / 2, 50, 14, GOLD)

  // 神明像
  const avatar = await loadImage(art(q.deity.id))
  if (avatar) ctx.drawImage(avatar, W / 2 - 55, 62, 110, 110)

  // 签纸
  const px = 40
  const py = 182
  const pw = W - 80
  const ph = 300
  ctx.setFillStyle('#efe3c8')
  ctx.fillRect(px, py, pw, ph)
  ctx.setStrokeStyle('rgba(140,100,50,0.6)')
  ctx.setLineWidth(0.6)
  ctx.strokeRect(px + 7, py + 7, pw - 14, ph - 14)

  text(q.set.name, px + 20, py + 34, 12, '#8e2f24', 'left')
  text(`第${cnNumber(q.no)}签`, px + pw - 20, py + 34, 12, '#8e2f24', 'right')

  // 吉凶朱印
  ctx.save()
  ctx.translate(W / 2, py + 72)
  ctx.rotate(-0.07)
  ctx.setStrokeStyle(VERMILION)
  ctx.setLineWidth(2)
  const sw = q.level.length > 1 ? 86 : 66
  ctx.strokeRect(-sw / 2, -20, sw, 40)
  text(`${q.level}签`, 0, 9, 24, VERMILION, 'center', 'bold')
  ctx.restore()

  // 签诗：四句一般各七字，一行一句
  const lines = q.poem.slice(0, 4)
  const lh = 38
  const top = py + 136 + ((4 - lines.length) * lh) / 2
  lines.forEach((l, i) => text(l.replace(/[，。！？；、]$/, ''), W / 2, top + i * lh, 21, INK))

  if (q.title) text(`典故：${q.title}`, W / 2, py + ph - 18, 11, '#7a6448')

  // 日期
  const d = hl.solar
  text(`${d.y}年${d.m}月${d.d}日 · 农历${hl.lunar.text}`, W / 2, py + ph + 36, 13, GOLD_LIGHT)
  text(`${q.deity.name}灵签 · 求签问事 看今日运势`, W / 2, py + ph + 62, 11, GOLD)
  text('签诗为传统民间文本，仅供娱乐', W / 2, H - 30, 10, 'rgba(212,175,110,0.5)')

  await new Promise((resolve) => ctx.draw(false, resolve))
  // 部分平台 draw 回调后还需稍等才完成渲染
  await new Promise((r) => setTimeout(r, 120))
  return new Promise((resolve, reject) =>
    uni.canvasToTempFilePath(
      { canvasId: 'shareCanvas', width: W, height: H, destWidth: W * 3, destHeight: H * 3, success: (r) => resolve(r.tempFilePath), fail: reject },
      proxy,
    ),
  )
}

async function open() {
  show.value = true
  if (img.value) return
  try {
    img.value = await draw()
  } catch (e) {
    show.value = false
    uni.showToast({ title: '签卡生成失败', icon: 'none' })
  }
}

function save() {
  if (!img.value) return
  if (isH5) {
    const a = document.createElement('a')
    a.href = img.value
    a.download = `灵签-${props.q.deity.name}-第${props.q.no}签.png`
    a.click()
    return
  }
  uni.saveImageToPhotosAlbum({
    filePath: img.value,
    success: () => uni.showToast({ title: '已保存到相册' }),
    fail: () => uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' }),
  })
}

const close = () => (show.value = false)

defineExpose({ open })
</script>

<style lang="scss" scoped>
.offscreen {
  position: fixed;
  left: -9999px;
  top: 0;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 6, 4, 0.82);
  animation: fade 0.25s ease-out;
}
@keyframes fade {
  from { opacity: 0; }
}
.sheet {
  width: 600rpx;
  text-align: center;
  animation: pop 0.35s cubic-bezier(0.2, 1.4, 0.4, 1);
}
@keyframes pop {
  from { transform: scale(0.85); opacity: 0; }
}
.preview {
  width: 100%;
  border-radius: 8rpx;
  box-shadow: 0 30rpx 80rpx rgba(0, 0, 0, 0.6);
}
.loading {
  padding: 200rpx 0;
}
.tip {
  margin: 24rpx 0;
  font-size: 24rpx;
}
.ops {
  display: flex;
  gap: 24rpx;
}
.ops .btn {
  flex: 1;
}
</style>
