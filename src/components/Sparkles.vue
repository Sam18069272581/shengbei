<template>
  <view class="sparkles">
    <view v-for="i in 12" :key="i" class="ray" :class="'r' + i">
      <view class="dot" :class="{ big: i % 3 === 0 }" />
    </view>
    <view class="ring" />
  </view>
</template>

<script setup>
// 吉兆特效：金色光点向四周迸散
</script>

<style lang="scss" scoped>
.sparkles {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 3;
}
.ray {
  position: absolute;
  left: 0;
  top: 0;
}
@for $i from 1 through 12 {
  .r#{$i} { transform: rotate(#{$i * 30}deg); }
}
.dot {
  width: 14rpx;
  height: 14rpx;
  margin: -7rpx;
  border-radius: 50%;
  background: #ffd36b;
  box-shadow: 0 0 12rpx #ffb300;
  animation: burst 0.9s ease-out both;
}
.dot.big {
  width: 22rpx;
  height: 22rpx;
  margin: -11rpx;
  animation-duration: 1.1s;
}
@keyframes burst {
  0% { transform: translateY(0) scale(0.2); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(-220rpx) scale(1); opacity: 0; }
}
.ring {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  margin: -20rpx;
  border-radius: 50%;
  border: 6rpx solid #ffd36b;
  animation: ring 0.8s ease-out both;
}
@keyframes ring {
  from { transform: scale(0.2); opacity: 1; }
  to { transform: scale(9); opacity: 0; }
}
</style>
