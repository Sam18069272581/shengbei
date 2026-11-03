<template>
  <view class="jiao-stage">
    <Sparkles v-if="state === 'landed' && sheng" :key="'s' + landKey" />
    <view v-if="state === 'landed'" :key="'r' + landKey" class="impact" />
    <view v-if="state === 'landed'" :key="'d' + landKey" class="dust">
      <view v-for="i in 6" :key="i" class="puff" :class="'p' + i" />
    </view>
    <view class="pair">
      <view v-for="(flat, i) in blocks" :key="i + '-' + landKey" class="slot">
        <!-- 抛起时的拖影 -->
        <block v-if="state === 'tossing'">
          <view v-for="g in 2" :key="'g' + g" class="block ghost" :class="['b' + i, 'tossing', 'g' + g]">
            <image class="img" :class="{ mirror: i === 1 }" :src="art('jiao-round')" mode="widthFix" />
          </view>
        </block>
        <view class="block" :class="['b' + i, state]">
          <image
            class="img"
            :class="{ mirror: i === 1 }"
            :src="flat ? art('jiao-flat') : art('jiao-round')"
            mode="widthFix"
          />
        </view>
      </view>
    </view>
    <view class="floor" :class="{ hit: state === 'landed' }" :key="'f' + landKey" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { art } from '../utils/art'
import Sparkles from './Sparkles.vue'

// state: idle 待掷（轻轻浮动）/ tossing 抛起翻转（带拖影）/ landed 落地挤压回弹 + 冲击光圈
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
.slot {
  position: relative;
  width: 96rpx;
  height: 222rpx;
}
.block {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 96rpx;
  transform-origin: 50% 100%;
}
.img {
  width: 96rpx;
  display: block;
  filter: drop-shadow(0 10rpx 10rpx rgba(0, 0, 0, 0.5));
}
.img.mirror {
  transform: scaleX(-1);
}
.ghost .img {
  filter: blur(2rpx);
}
.ghost.g1 { opacity: 0.35; animation-delay: -0.06s !important; }
.ghost.g2 { opacity: 0.15; animation-delay: -0.12s !important; }

.idle.b0 { animation: idle 2.6s ease-in-out infinite; }
.idle.b1 { animation: idle 2.6s ease-in-out 0.4s infinite; }
.tossing.b0 { animation: toss0 1s cubic-bezier(0.3, 0.6, 0.5, 1) infinite; }
.tossing.b1 { animation: toss1 1s cubic-bezier(0.3, 0.6, 0.5, 1) infinite; }
.landed.b0 { animation: land0 0.8s cubic-bezier(0.3, 0.7, 0.4, 1) both; }
.landed.b1 { animation: land1 0.8s cubic-bezier(0.3, 0.7, 0.4, 1) 0.05s both; }

@keyframes idle {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-12rpx) rotate(3deg); }
}
@keyframes toss0 {
  0% { transform: translate(0, 0) rotate(0) scale(1, 1); }
  10% { transform: translate(0, 0) rotate(0) scale(1.1, 0.85); }
  50% { transform: translate(-40rpx, -240rpx) rotate(-400deg) scale(0.92, 1.08); }
  100% { transform: translate(0, 0) rotate(-720deg) scale(1, 1); }
}
@keyframes toss1 {
  0% { transform: translate(0, 0) rotate(0) scale(1, 1); }
  10% { transform: translate(0, 0) rotate(0) scale(1.1, 0.85); }
  50% { transform: translate(40rpx, -270rpx) rotate(380deg) scale(0.92, 1.08); }
  100% { transform: translate(0, 0) rotate(720deg) scale(1, 1); }
}
@keyframes land0 {
  0% { transform: translateY(-220rpx) rotate(-200deg) scale(0.9, 1.1); }
  45% { transform: translateY(0) rotate(-10deg) scale(1, 1); }
  55% { transform: translateY(0) rotate(-10deg) scale(1.18, 0.78); }
  70% { transform: translateY(-34rpx) rotate(4deg) scale(0.95, 1.06); }
  84% { transform: translateY(0) rotate(-14deg) scale(1.06, 0.94); }
  100% { transform: translateY(0) rotate(-12deg) scale(1, 1); }
}
@keyframes land1 {
  0% { transform: translateY(-240rpx) rotate(210deg) scale(0.9, 1.1); }
  45% { transform: translateY(0) rotate(10deg) scale(1, 1); }
  55% { transform: translateY(0) rotate(10deg) scale(1.18, 0.78); }
  70% { transform: translateY(-28rpx) rotate(-4deg) scale(0.95, 1.06); }
  84% { transform: translateY(0) rotate(14deg) scale(1.06, 0.94); }
  100% { transform: translateY(0) rotate(12deg) scale(1, 1); }
}

/* 落地冲击：金色光圈 + 尘点 */
.impact {
  position: absolute;
  left: 50%;
  bottom: 36rpx;
  width: 300rpx;
  height: 60rpx;
  margin-left: -150rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(240, 217, 166, 0.9);
  animation: impact 0.7s ease-out 0.36s both;
}
@keyframes impact {
  from { transform: scale(0.2); opacity: 1; }
  to { transform: scale(1.6); opacity: 0; }
}
.dust {
  position: absolute;
  left: 50%;
  bottom: 50rpx;
}
.puff {
  position: absolute;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: rgba(240, 217, 166, 0.7);
  animation: puff 0.7s ease-out 0.36s both;
}
.p1 { animation-name: puff1; }
.p2 { animation-name: puff2; }
.p3 { animation-name: puff3; }
.p4 { animation-name: puff4; }
.p5 { animation-name: puff5; }
.p6 { animation-name: puff6; }
@keyframes puff1 { from { transform: translate(-40rpx, 0) scale(1); opacity: 1; } to { transform: translate(-190rpx, -50rpx) scale(0.2); opacity: 0; } }
@keyframes puff2 { from { transform: translate(-30rpx, 0) scale(1); opacity: 1; } to { transform: translate(-120rpx, -90rpx) scale(0.2); opacity: 0; } }
@keyframes puff3 { from { transform: translate(-10rpx, 0) scale(1); opacity: 1; } to { transform: translate(-40rpx, -120rpx) scale(0.2); opacity: 0; } }
@keyframes puff4 { from { transform: translate(10rpx, 0) scale(1); opacity: 1; } to { transform: translate(40rpx, -120rpx) scale(0.2); opacity: 0; } }
@keyframes puff5 { from { transform: translate(30rpx, 0) scale(1); opacity: 1; } to { transform: translate(120rpx, -90rpx) scale(0.2); opacity: 0; } }
@keyframes puff6 { from { transform: translate(40rpx, 0) scale(1); opacity: 1; } to { transform: translate(190rpx, -50rpx) scale(0.2); opacity: 0; } }

.floor {
  position: absolute;
  left: 15%;
  right: 15%;
  bottom: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(212, 175, 110, 0.25), transparent 70%);
}
.floor.hit {
  animation: floorhit 0.6s ease-out 0.36s both;
}
@keyframes floorhit {
  0% { transform: scaleX(0.6); opacity: 0.4; }
  30% { transform: scaleX(1.2); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0.6; }
}
</style>
