<template>
  <view class="jiao-blocks" :class="{ tossing }">
    <view
      v-for="(flat, i) in blocks"
      :key="i"
      class="block"
      :class="[flat ? 'flat' : 'round', i === 1 ? 'mirror' : '']"
    >
      <view class="shape" />
    </view>
  </view>
</template>

<script setup>
// 两片新月形筊杯：flat=true 平面朝上（显示木纹浅面），false 凸面朝上（深红漆面）
defineProps({
  blocks: { type: Array, default: () => [true, false] },
  tossing: { type: Boolean, default: false },
})
</script>

<style scoped>
.jiao-blocks {
  display: flex;
  justify-content: center;
  gap: 48rpx;
  height: 240rpx;
  align-items: center;
}
.block {
  width: 120rpx;
  height: 220rpx;
  transition: transform 0.3s;
}
.shape {
  width: 100%;
  height: 100%;
  border-radius: 120rpx 0 0 120rpx / 110rpx 0 0 110rpx;
  box-shadow: 0 8rpx 18rpx rgba(80, 10, 0, 0.35);
}
.mirror .shape {
  border-radius: 0 120rpx 120rpx 0 / 0 110rpx 110rpx 0;
}
.round .shape {
  background: radial-gradient(circle at 40% 35%, #e0473a, #a3160d 60%, #6e0c06);
}
.flat .shape {
  background: linear-gradient(135deg, #f3d9a4, #d9b06a);
  border: 4rpx solid #a3160d;
  box-sizing: border-box;
}
.tossing .block {
  animation: toss 0.6s ease-in-out infinite;
}
.tossing .block.mirror {
  animation-delay: 0.15s;
}
@keyframes toss {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-120rpx) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
</style>
