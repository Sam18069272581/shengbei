<template>
  <view class="deity-avatar" :style="{ width: size + 'rpx' }">
    <view v-if="bubble" :key="bubble" class="bubble">{{ bubble }}</view>
    <view class="body" :class="'mood-' + mood" :key="mood + moodKey">
      <image class="img" :src="art(id)" mode="widthFix" :style="{ width: size + 'rpx' }" />
    </view>
    <view class="shadow" />
  </view>
</template>

<script setup>
import { art } from '../utils/art'
// Q 版神明形象。mood: idle 悬浮 / nod 点头 / shake 摇头 / laugh 开心跳 / think 歪头
defineProps({
  id: { type: String, required: true },
  size: { type: Number, default: 240 },
  mood: { type: String, default: 'idle' },
  moodKey: { type: Number, default: 0 },
  bubble: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.deity-avatar {
  position: relative;
  margin: 0 auto;
}
.body {
  animation: float 3.2s ease-in-out infinite;
  transform-origin: 50% 90%;
}
.img {
  display: block;
}
.shadow {
  width: 60%;
  height: 18rpx;
  margin: -6rpx auto 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(212, 175, 110, 0.25), transparent 70%);
  animation: shadow 3.2s ease-in-out infinite;
}
.mood-nod { animation: nod 0.5s ease-in-out 3, float 3.2s ease-in-out 1.5s infinite; }
.mood-shake { animation: shake 0.4s ease-in-out 3, float 3.2s ease-in-out 1.2s infinite; }
.mood-laugh { animation: laugh 0.35s ease-out 4, float 3.2s ease-in-out 1.4s infinite; }
.mood-think { animation: think 1.6s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14rpx); }
}
@keyframes shadow {
  0%, 100% { transform: scaleX(1); opacity: 1; }
  50% { transform: scaleX(0.8); opacity: 0.6; }
}
@keyframes nod {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(8deg) translateY(8rpx); }
}
@keyframes shake {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-9deg); }
  75% { transform: rotate(9deg); }
}
@keyframes laugh {
  0%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-36rpx) scale(1.04, 0.96); }
}
@keyframes think {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

.bubble {
  position: absolute;
  z-index: 2;
  right: -30rpx;
  top: -48rpx;
  background: #231b14;
  border: 1rpx solid $sb-gold;
  color: $sb-gold-light;
  border-radius: 6rpx;
  letter-spacing: 2rpx;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  white-space: nowrap;
  box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.15);
  animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both;
}
.bubble::after {
  content: '';
  position: absolute;
  left: 24rpx;
  bottom: -16rpx;
  border: 8rpx solid transparent;
  border-top: 10rpx solid $sb-gold;
}
@keyframes pop {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
