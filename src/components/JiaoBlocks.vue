<template>
  <view class="jiao-stage">
    <Sparkles v-if="state === 'landed' && sheng" :key="landKey" />
    <view class="pair">
      <view
        v-for="(flat, i) in blocks"
        :key="i + '-' + landKey"
        class="block"
        :class="['b' + i, state]"
      >
        <image
          class="img"
          :class="{ mirror: i === 1 }"
          :src="flat ? art('jiao-flat') : art('jiao-round')"
          mode="widthFix"
        />
      </view>
    </view>
    <view class="floor" />
  </view>
</template>

<script setup>
import { art } from '../utils/art'
import { computed } from 'vue'
import Sparkles from './Sparkles.vue'

// state: idle 待掷（轻轻浮动）/ tossing 抛起翻转 / landed 落地弹跳
const props = defineProps({
  blocks: { type: Array, default: () => [true, false] },
  state: { type: String, default: 'idle' },
  landKey: { type: Number, default: 0 },
})
const sheng = computed(() => props.blocks[0] !== props.blocks[1])
</script>

<style lang="scss" scoped>
.jiao-stage {
  position: relative;
  height: 340rpx;
}
.pair {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 40rpx;
  display: flex;
  justify-content: center;
  gap: 70rpx;
}
.block {
  width: 96rpx;
}
.img {
  width: 96rpx;
  display: block;
  filter: drop-shadow(0 10rpx 8rpx rgba(80, 10, 0, 0.3));
}
.img.mirror {
  transform: scaleX(-1);
}
.idle.b0 { animation: idle 2.6s ease-in-out infinite; }
.idle.b1 { animation: idle 2.6s ease-in-out 0.4s infinite; }
.tossing.b0 { animation: toss0 1s cubic-bezier(0.3, 0.6, 0.5, 1) infinite; }
.tossing.b1 { animation: toss1 1s cubic-bezier(0.3, 0.6, 0.5, 1) 0.08s infinite; }
.landed.b0 { animation: land0 0.7s ease-out both; }
.landed.b1 { animation: land1 0.7s ease-out 0.06s both; }

@keyframes idle {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-10rpx) rotate(3deg); }
}
@keyframes toss0 {
  0% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(-30rpx, -230rpx) rotate(-400deg); }
  100% { transform: translate(0, 0) rotate(-720deg); }
}
@keyframes toss1 {
  0% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(30rpx, -260rpx) rotate(380deg); }
  100% { transform: translate(0, 0) rotate(720deg); }
}
@keyframes land0 {
  0% { transform: translateY(-180rpx) rotate(-160deg); }
  55% { transform: translateY(0) rotate(-8deg); }
  72% { transform: translateY(-26rpx) rotate(6deg); }
  86% { transform: translateY(0) rotate(-2deg); }
  100% { transform: translateY(0) rotate(-12deg); }
}
@keyframes land1 {
  0% { transform: translateY(-200rpx) rotate(170deg); }
  55% { transform: translateY(0) rotate(8deg); }
  72% { transform: translateY(-22rpx) rotate(-6deg); }
  86% { transform: translateY(0) rotate(2deg); }
  100% { transform: translateY(0) rotate(12deg); }
}
.floor {
  position: absolute;
  left: 15%;
  right: 15%;
  bottom: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(110, 12, 6, 0.18), transparent 70%);
}
</style>
