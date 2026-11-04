<template>
  <view class="page">
    <TempleScene eave />
    <view class="page-body">
      <view class="hero">
        <CloudLayer class="hero-clouds" />
        <view class="hero-title">
          <text class="ht-char c1">圣</text><text class="ht-char foil c2">杯</text>
        </view>
        <view class="hero-line" />
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
          <text class="muted">农历{{ fortune.hl.lunar.text }}</text>
        </view>
        <view class="today-saying">「{{ fortune.saying.text }}」</view>
        <view class="stars">
          <text v-for="i in 5" :key="i" class="star" :class="{ on: i <= fortune.overall }" :style="{ animationDelay: i * 0.12 + 's' }">★</text>
        </view>
        <view class="aspects">
          <view v-for="a in fortune.aspects" :key="a.key" class="aspect">
            <text>{{ a.name }}</text>
            <text class="aspect-stars">{{ '★'.repeat(a.stars) }}</text>
          </view>
        </view>
        <view class="today-hl" @click.stop="go('/pages/huangli/huangli')">
          <text class="hl-yi">宜</text><text>{{ fortune.hl.yi.slice(0, 4).join(' ') }}</text>
        </view>
        <view class="today-hl" @click.stop="go('/pages/huangli/huangli')">
          <text class="hl-ji">忌</text><text>{{ fortune.hl.ji.slice(0, 4).join(' ') }}</text>
        </view>
        <view class="muted">点击查看黄历、详情与今日一签 ›</view>
      </view>

      <view class="entries">
        <view class="entry" @click="go('/pages/jiao/jiao')">
          <view class="entry-art jiao-art">
            <image class="mini-jiao" :src="art('jiao-flat')" mode="widthFix" />
            <image class="mini-jiao r" :src="art('jiao-round')" mode="widthFix" />
          </view>
          <view class="entry-name">掷筊问事</view>
          <view class="entry-sub">是或否，问神明一句</view>
        </view>
        <view class="entry" @click="go('/pages/qiuqian/qiuqian')">
          <view class="entry-art">
            <image class="mini-tube" :src="art('tube')" mode="widthFix" />
          </view>
          <view class="entry-name">求灵签</view>
          <view class="entry-sub">学业 · 工作 · 爱情</view>
        </view>
      </view>

      <view class="history-link" @click="go('/pages/history/history')">
        <text>我的签</text>
        <text class="muted">{{ historyCount ? `已求 ${historyCount} 签` : '还没有求过签' }} ›</text>
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
  </view>
</template>

<script setup>
import TempleScene from '../../components/TempleScene.vue'
import { art } from '../../utils/art'
import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { TOPICS, listDeities } from '../../utils/qian'
import { dailyFortune } from '../../utils/daily'
import { getHistory } from '../../utils/storage'
import DeityAvatar from '../../components/DeityAvatar.vue'
import CloudLayer from '../../components/CloudLayer.vue'

const deities = listDeities()
const fortune = ref(dailyFortune())
const historyCount = ref(getHistory().length)

// 神明轮流打招呼
const GREET = { mazu: '出入平安～', wenchang: '金榜题名！', guandi: '事业顺遂！', yuelao: '良缘天定～' }
const greeting = (d) => GREET[d.id] || '有求必应'
const greetId = ref('')
let timer = null
let idx = 0
onShow(() => {
  fortune.value = dailyFortune()
  historyCount.value = getHistory().length
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
/* 祥云放在殿檐下方 */
.hero-clouds {
  top: 120rpx !important;
}
.today-saying {
  margin: 8rpx 0 4rpx;
  text-align: center;
  font-size: 30rpx;
  letter-spacing: 2rpx;
  color: $sb-gold-light;
}
.history-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 28rpx;
  margin-bottom: 28rpx;
  border: 1rpx solid $sb-line;
  border-radius: 12rpx;
  background: $sb-surface;
  font-size: 30rpx;
  letter-spacing: 4rpx;
}
.hero {
  position: relative;
  text-align: center;
  margin: -32rpx -32rpx 24rpx;
  padding: 130rpx 32rpx 20rpx;
  background: transparent;
}
.hero-title {
  position: relative;
  font-size: 88rpx;
}
.ht-char {
  display: inline-block;
  background: linear-gradient(180deg, #f6e3b4, #b98f4e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 14rpx;
  animation: drop 0.8s cubic-bezier(0.2, 1.5, 0.4, 1) both;
}
.c2 { animation-delay: 0.15s; }
@keyframes drop {
  from { transform: translateY(-80rpx) scale(1.6); opacity: 0; filter: blur(6rpx); }
  to { transform: none; opacity: 1; filter: blur(0); }
}
.hero-line {
  position: relative;
  width: 220rpx;
  height: 2rpx;
  margin: 6rpx auto 10rpx;
  background: linear-gradient(90deg, transparent, #d4af6e, transparent);
  animation: linegrow 1s ease-out 0.5s both;
}
@keyframes linegrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
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
  color: rgba(212, 175, 110, 0.22);
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
.today-hl {
  font-size: 24rpx;
  color: $sb-text;
  margin-bottom: 10rpx;
}
.hl-yi, .hl-ji {
  display: inline-block;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 22rpx;
  color: #f6e9d0;
  margin-right: 12rpx;
  background: $sb-vermilion;
}
.hl-ji {
  background: #4a4440;
}
.entries {
  display: flex;
  gap: 24rpx;
  margin-bottom: 36rpx;
}
.entry {
  flex: 1;
  background: linear-gradient(160deg, #2a1f17, #17110d);
  border: 1rpx solid $sb-line;
  color: $sb-gold-light;
  border-radius: 24rpx;
  padding: 28rpx 20rpx;
  text-align: center;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.25);
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
  color: $sb-muted;
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
  background: $sb-surface;
  border: 2rpx solid $sb-line;
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
