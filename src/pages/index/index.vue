<template>
  <view class="page">
    <view class="hero">
      <CloudLayer />
      <view class="hero-title">圣 杯</view>
      <view class="hero-sub">掷筊问事 · 求灵签 · 看今日运势</view>
      <view class="hero-gods">
        <view v-for="(d, i) in deities" :key="d.id" class="hero-god" :class="'g' + i" @click="go(`/pages/qiuqian/qiuqian?deity=${d.id}`)">
          <DeityAvatar :id="d.id" :size="150" :bubble="greetId === d.id ? greeting(d) : ''" />
          <view class="hero-god-name">{{ d.name }}</view>
        </view>
      </view>
    </view>

    <view class="card today pop-in" @click="go('/pages/daily/daily')">
      <view class="today-head">
        <text class="section-title">今日运势</text>
        <text class="muted">{{ fortune.date }}</text>
      </view>
      <view class="stars">
        <text v-for="i in 5" :key="i" class="star" :class="{ on: i <= fortune.overall }" :style="{ animationDelay: i * 0.12 + 's' }">★</text>
      </view>
      <view class="aspects">
        <view v-for="a in fortune.aspects" :key="a.key" class="aspect">
          <text>{{ a.name }}</text>
          <text class="aspect-stars">{{ '★'.repeat(a.stars) }}</text>
        </view>
      </view>
      <view class="muted">点击查看详情与今日一签 ›</view>
    </view>

    <view class="entries">
      <view class="entry" @click="go('/pages/jiao/jiao')">
        <view class="entry-art jiao-art">
          <image class="mini-jiao" src="/static/art/jiao-flat.svg" mode="widthFix" />
          <image class="mini-jiao r" src="/static/art/jiao-round.svg" mode="widthFix" />
        </view>
        <view class="entry-name">掷筊问事</view>
        <view class="entry-sub">是或否，问神明一句</view>
      </view>
      <view class="entry" @click="go('/pages/qiuqian/qiuqian')">
        <view class="entry-art">
          <image class="mini-tube" src="/static/art/tube.svg" mode="widthFix" />
        </view>
        <view class="entry-name">求灵签</view>
        <view class="entry-sub">学业 · 工作 · 爱情</view>
      </view>
    </view>

    <view class="section-title">按事项求签</view>
    <view class="topics">
      <view v-for="t in TOPICS" :key="t.key" class="topic" @click="go(`/pages/qiuqian/qiuqian?topic=${t.key}`)">
        <view class="topic-icon">{{ t.icon }}</view>
        <text>{{ t.name }}</text>
      </view>
    </view>

    <view class="disclaimer">签诗为传统民间文本，释义为本站自撰，仅供娱乐与传统文化学习</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { TOPICS, listDeities } from '../../utils/qian'
import { dailyFortune } from '../../utils/daily'
import DeityAvatar from '../../components/DeityAvatar.vue'
import CloudLayer from '../../components/CloudLayer.vue'

const deities = listDeities()
const fortune = ref(dailyFortune())

// 神明轮流打招呼
const GREET = { mazu: '出入平安～', wenchang: '金榜题名！', guandi: '事业顺遂！', yuelao: '良缘天定～' }
const greeting = (d) => GREET[d.id] || '有求必应'
const greetId = ref('')
let timer = null
let idx = 0
onShow(() => {
  fortune.value = dailyFortune()
  clearInterval(timer)
  const tick = () => {
    greetId.value = deities[idx % deities.length]?.id || ''
    idx++
  }
  tick()
  timer = setInterval(tick, 2600)
})
onHide(() => clearInterval(timer))

const go = (url) => uni.navigateTo({ url })
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  text-align: center;
  margin: -32rpx -32rpx 24rpx;
  padding: 40rpx 32rpx 20rpx;
  background: linear-gradient(180deg, #fde9c3, $sb-paper);
}
.hero-title {
  position: relative;
  font-size: 84rpx;
  color: $sb-red;
  letter-spacing: 24rpx;
  font-weight: bold;
  text-shadow: 0 4rpx 0 #f3c766;
}
.hero-sub {
  position: relative;
  color: $sb-muted;
  font-size: 26rpx;
  margin-top: 4rpx;
  letter-spacing: 4rpx;
}
.hero-gods {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 56rpx;
}
.hero-god {
  width: 25%;
  animation: rise 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) both;
}
.g1 { animation-delay: 0.1s; }
.g2 { animation-delay: 0.2s; }
.g3 { animation-delay: 0.3s; }
.hero-god-name {
  font-size: 24rpx;
  color: $sb-ink;
}
@keyframes rise {
  from { transform: translateY(60rpx) scale(0.6); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.pop-in {
  animation: rise 0.6s ease-out 0.35s both;
}
.today-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.stars {
  font-size: 48rpx;
  letter-spacing: 6rpx;
}
.star {
  color: #e9dcc0;
  display: inline-block;
  animation: starpop 0.5s cubic-bezier(0.2, 1.8, 0.4, 1) both;
}
.star.on {
  color: $sb-gold;
}
@keyframes starpop {
  from { transform: scale(0) rotate(-90deg); }
  to { transform: scale(1) rotate(0); }
}
.aspects {
  display: flex;
  flex-wrap: wrap;
  margin: 16rpx 0;
}
.aspect {
  width: 50%;
  font-size: 26rpx;
  padding: 6rpx 0;
}
.aspect-stars {
  color: $sb-gold;
  margin-left: 12rpx;
}
.entries {
  display: flex;
  gap: 24rpx;
  margin-bottom: 36rpx;
}
.entry {
  flex: 1;
  background: linear-gradient(160deg, #c42a1c, $sb-red-dark);
  color: #fff3d6;
  border-radius: 24rpx;
  padding: 28rpx 20rpx;
  text-align: center;
  box-shadow: 0 10rpx 20rpx rgba(110, 12, 6, 0.25);
}
.entry:active {
  transform: scale(0.96);
}
.entry-art {
  height: 130rpx;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.mini-jiao {
  width: 46rpx;
  margin: 0 6rpx;
  animation: wobble 2.4s ease-in-out infinite;
}
.mini-jiao.r {
  transform: scaleX(-1);
  animation-delay: 0.3s;
}
.mini-tube {
  width: 84rpx;
  transform-origin: 50% 100%;
  animation: tubewobble 2.2s ease-in-out infinite;
}
@keyframes wobble {
  0%, 100% { margin-bottom: 0; }
  50% { margin-bottom: 16rpx; }
}
@keyframes tubewobble {
  0%, 60%, 100% { transform: rotate(0); }
  70% { transform: rotate(-8deg); }
  80% { transform: rotate(8deg); }
  90% { transform: rotate(-4deg); }
}
.entry-name {
  font-size: 34rpx;
  letter-spacing: 4rpx;
  margin: 12rpx 0 6rpx;
}
.entry-sub {
  font-size: 22rpx;
  color: #f0cf9a;
}
.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 36rpx;
}
.topic {
  width: 30%;
  flex-grow: 1;
  background: #fffaf0;
  border: 2rpx solid #ead7b0;
  border-radius: 16rpx;
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
}
.topic:active {
  transform: scale(0.95);
}
.topic-icon {
  color: $sb-red;
  font-size: 40rpx;
}
</style>
