<template>
  <!-- 全屏庙宇场景：远山云雾、殿檐灯笼、神光、香烟、浮尘。只做氛围，不接收点击 -->
  <view class="scene" :class="{ focus, blessed }">
    <view class="sky" />
    <view class="rays">
      <view v-for="i in 5" :key="i" class="ray" :class="'ray' + i" />
    </view>
    <image class="mountains" :src="art('scene-mountains')" mode="scaleToFill" />
    <view class="mist m1" />
    <view class="mist m2" />

    <view class="motes">
      <view v-for="(m, i) in MOTES" :key="i" class="mote" :style="m" />
    </view>

    <view class="smoke-wrap">
      <image v-for="i in 3" :key="i" class="smoke" :class="'sm' + i" :src="art('smoke')" mode="widthFix" />
    </view>

    <view v-if="eave" class="eave-wrap">
      <image class="eave" :src="art('scene-eave')" mode="widthFix" />
      <view class="lantern-wrap l">
        <view class="lantern-glow" />
        <image class="lantern" :src="art('lantern')" mode="widthFix" />
      </view>
      <view class="lantern-wrap r">
        <view class="lantern-glow" />
        <image class="lantern" :src="art('lantern')" mode="widthFix" />
      </view>
    </view>

    <!-- 吉兆时自上而下的一束神光 -->
    <view v-if="blessed" :key="blessKey" class="beam" />
    <view class="vignette" />
    <view class="spot" />
  </view>
</template>

<script setup>
import { art } from '../utils/art'

defineProps({
  // 关键时刻（掷筊、摇签）压暗四周，只留中间一束光
  focus: { type: Boolean, default: false },
  // 吉兆：降下一束神光；blessKey 变化时重播
  blessed: { type: Boolean, default: false },
  blessKey: { type: Number, default: 0 },
  // 顶部殿檐与灯笼（只在首页用，其他页顶部有选择栏会被挡住）
  eave: { type: Boolean, default: false },
})

// 浮尘位置固定写死，避免每次渲染跳动
const MOTES = Array.from({ length: 18 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 97.13 + n * 13.7) + 1) / 2)
  return {
    left: (r(1) * 100).toFixed(1) + '%',
    top: (20 + r(2) * 75).toFixed(1) + '%',
    width: (4 + r(3) * 6).toFixed(0) + 'rpx',
    height: (4 + r(3) * 6).toFixed(0) + 'rpx',
    animationDuration: (9 + r(4) * 10).toFixed(1) + 's',
    animationDelay: (-r(5) * 18).toFixed(1) + 's',
    opacity: (0.35 + r(6) * 0.5).toFixed(2),
  }
})
</script>

<style lang="scss" scoped>
.scene {
  position: fixed;
  left: 0;
  right: 0;
  /* H5 有导航栏，场景从导航栏下方开始，殿檐才不会被挡 */
  top: var(--window-top, 0);
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.sky {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(ellipse 90% 55% at 50% 0%, rgba(232, 180, 100, 0.22), transparent 70%),
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(196, 71, 58, 0.1), transparent 70%), #14100c;
}

/* 神光：几道斜射光柱缓慢呼吸 */
.rays {
  position: absolute;
  left: 50%;
  top: -40rpx;
  width: 0;
  height: 0;
}
.ray {
  position: absolute;
  top: 0;
  left: -60rpx;
  width: 120rpx;
  height: 1100rpx;
  transform-origin: 50% 0;
  background: linear-gradient(180deg, rgba(246, 222, 170, 0.16), rgba(246, 222, 170, 0.04) 55%, transparent);
  clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%);
  animation: ray 9s ease-in-out infinite;
}
.ray1 { transform: rotate(-28deg); animation-delay: -1s; }
.ray2 { transform: rotate(-12deg); animation-delay: -4s; width: 160rpx; left: -80rpx; }
.ray3 { transform: rotate(2deg); animation-delay: -6s; }
.ray4 { transform: rotate(16deg); animation-delay: -2.5s; width: 180rpx; left: -90rpx; }
.ray5 { transform: rotate(30deg); animation-delay: -7.5s; }
@keyframes ray {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

.mountains {
  position: absolute;
  left: -5%;
  width: 110%;
  bottom: 0;
  height: 46%;
  animation: breathe-x 40s ease-in-out infinite;
}
@keyframes breathe-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-3%); }
}
.mist {
  position: absolute;
  left: -50%;
  width: 200%;
  height: 120rpx;
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(240, 217, 166, 0.07), transparent 70%);
}
.m1 { bottom: 26%; animation: mist 34s linear infinite; }
.m2 { bottom: 14%; height: 160rpx; animation: mist 50s linear -20s infinite reverse; }
@keyframes mist {
  from { transform: translateX(-20%); }
  to { transform: translateX(20%); }
}

/* 浮尘：金色微光缓缓上浮 */
.mote {
  position: absolute;
  border-radius: 50%;
  background: #f6dfa8;
  box-shadow: 0 0 10rpx 2rpx rgba(246, 210, 140, 0.8);
  animation-name: mote;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes mote {
  0% { transform: translate(0, 0); opacity: 0; }
  20% { opacity: 1; }
  50% { transform: translate(30rpx, -120rpx); }
  80% { opacity: 0.8; }
  100% { transform: translate(-10rpx, -260rpx); opacity: 0; }
}

/* 香烟：从底部袅袅升起 */
.smoke-wrap {
  position: absolute;
  left: 50%;
  bottom: -40rpx;
  width: 0;
}
.smoke {
  position: absolute;
  bottom: 0;
  width: 120rpx;
  margin-left: -60rpx;
  opacity: 0;
  filter: blur(5rpx);
  transform-origin: 50% 100%;
  animation: smoke 12s ease-out infinite;
}
.sm2 { animation-delay: -4s; margin-left: -140rpx; }
.sm3 { animation-delay: -8s; margin-left: 20rpx; }
@keyframes smoke {
  0% { transform: translateY(80rpx) scale(0.8, 0.8) skewX(0); opacity: 0; }
  20% { opacity: 0.22; }
  60% { opacity: 0.14; }
  100% { transform: translateY(-420rpx) scale(1.8, 1.4) skewX(-12deg); opacity: 0; }
}

/* 殿檐与灯笼 */
.eave-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  animation: eave-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes eave-in {
  from { transform: translateY(-120rpx); opacity: 0; }
}
.eave {
  display: block;
  width: 100%;
  margin-top: -36rpx;
  filter: drop-shadow(0 12rpx 20rpx rgba(0, 0, 0, 0.6));
}
.lantern-wrap {
  position: absolute;
  top: 70rpx;
  width: 76rpx;
  transform-origin: 50% 0;
  animation: sway 4.6s ease-in-out infinite;
}
.lantern-wrap.l { left: 18rpx; }
.lantern-wrap.r { right: 18rpx; animation-delay: -2.1s; animation-duration: 5.2s; }
@keyframes sway {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}
.lantern {
  position: relative;
  display: block;
  width: 76rpx;
}
.lantern-glow {
  position: absolute;
  left: 50%;
  top: 60rpx;
  width: 260rpx;
  height: 260rpx;
  margin: -100rpx 0 0 -130rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 150, 80, 0.35), rgba(255, 120, 60, 0.08) 45%, transparent 70%);
  animation: flicker 3.2s ease-in-out infinite;
}
@keyframes flicker {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  30% { opacity: 1; transform: scale(1.05); }
  55% { opacity: 0.7; transform: scale(0.97); }
  75% { opacity: 0.95; }
}

.vignette {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0, 0, 0, 0.55));
}

/* 聚焦：四周压暗 */
.spot {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  background: radial-gradient(ellipse 60% 38% at 50% 40%, transparent 30%, rgba(5, 3, 2, 0.78) 100%);
  transition: opacity 0.6s ease;
}
.focus .spot { opacity: 1; }
.focus .ray { animation-duration: 2.4s; }
.focus .smoke { animation-duration: 6s; }

/* 神光 */
.beam {
  position: absolute;
  left: 50%;
  top: 0;
  width: 420rpx;
  height: 75%;
  margin-left: -210rpx;
  background: linear-gradient(180deg, rgba(255, 232, 170, 0.55), rgba(255, 220, 150, 0.18) 60%, transparent);
  clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%);
  transform-origin: 50% 0;
  animation: beam 2.4s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}
@keyframes beam {
  0% { transform: scaleY(0); opacity: 0; }
  25% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0.25; }
}
</style>
