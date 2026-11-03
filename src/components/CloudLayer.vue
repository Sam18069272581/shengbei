<template>
  <view class="clouds">
    <image class="cloud c1" :src="art('cloud')" mode="widthFix" />
    <image class="cloud c2" :src="art('cloud')" mode="widthFix" />
    <image class="cloud c3" :src="art('cloud')" mode="widthFix" />
  </view>
</template>

<script setup>
import { art } from '../utils/art'
// 背景祥云，缓慢飘动
</script>

<style lang="scss" scoped>
.clouds {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
.cloud {
  position: absolute;
  opacity: 0.8;
}
.c1 { width: 200rpx; top: 20rpx; animation: drift 22s linear infinite; }
.c2 { width: 150rpx; top: 150rpx; animation: drift 30s linear -12s infinite; opacity: 0.6; }
.c3 { width: 120rpx; top: 70rpx; animation: drift 26s linear -20s infinite reverse; opacity: 0.5; }
@keyframes drift {
  from { transform: translateX(-240rpx); }
  to { transform: translateX(800rpx); }
}
</style>
