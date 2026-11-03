<template>
  <view class="page">
    <view class="card head">
      <view class="muted">{{ f.date }}</view>
      <view class="overall">
        今日综合
        <text v-for="i in 5" :key="i" class="star" :class="{ on: i <= f.overall }" :style="{ animationDelay: 0.2 + i * 0.15 + 's' }">★</text>
      </view>
      <view class="lucky muted">幸运色 {{ f.color }} · 幸运数字 {{ f.number }}</view>
    </view>

    <view class="card">
      <view class="section-title">分项运势</view>
      <view v-for="(a, idx) in f.aspects" :key="a.key" class="aspect">
        <text class="aspect-name">{{ a.name }}</text>
        <view class="bar"><view class="bar-fill" :style="{ width: a.stars * 20 + '%', animationDelay: 0.3 + idx * 0.15 + 's' }" /></view>
        <text class="aspect-stars">{{ '★'.repeat(a.stars) }}</text>
      </view>
    </view>

    <view class="card yiji">
      <view class="col">
        <view class="yi-title">宜</view>
        <view v-for="x in f.yi" :key="x" class="item">{{ x }}</view>
      </view>
      <view class="col">
        <view class="ji-title">忌</view>
        <view v-for="x in f.ji" :key="x" class="item">{{ x }}</view>
      </view>
    </view>

    <view class="card qian-card" v-if="f.qian" @click="openQian">
      <view class="qian-god"><DeityAvatar :id="f.qian.deityId" :size="140" /></view>
      <view class="section-title">今日一签</view>
      <view class="muted qian-from">{{ f.qian.deityName }} · 第{{ cnNumber(f.qian.no) }}签</view>
      <view class="poem">
        <text>{{ poemText }}</text>
      </view>
      <view class="muted">点击查看解签 ›</view>
    </view>

    <view class="disclaimer">每日运势按日期生成，同一天结果不变，仅供娱乐</view>
  </view>
</template>

<script setup>
import { dailyFortune } from '../../utils/daily'
import { cnNumber } from '../../utils/qian'
import DeityAvatar from '../../components/DeityAvatar.vue'

const f = dailyFortune()
// 有的签诗自带标点，有的没有：没有标点的句子补上逗号/句号
const poemText = f.qian
  ? f.qian.poem.map((l, i) => (/[，。！？；、]$/.test(l) ? l : l + (i < f.qian.poem.length - 1 ? '，' : '。'))).join('')
  : ''
const openQian = () => uni.navigateTo({ url: `/pages/result/result?deity=${f.qian.deityId}&no=${f.qian.no}` })
</script>

<style lang="scss" scoped>
.head {
  text-align: center;
}
.overall {
  font-size: 36rpx;
  margin: 12rpx 0;
}
.star {
  display: inline-block;
  color: rgba(212, 175, 110, 0.22);
  font-size: 44rpx;
  margin-left: 6rpx;
  animation: starpop 0.5s cubic-bezier(0.2, 1.8, 0.4, 1) both;
}
.star.on {
  color: $sb-gold;
}
@keyframes starpop {
  from { transform: scale(0) rotate(-90deg); }
  to { transform: scale(1) rotate(0); }
}
.qian-card {
  position: relative;
  padding-top: 20rpx;
}
.qian-from {
  margin: -12rpx 0 16rpx;
}
.qian-god {
  float: right;
  margin: 0 -10rpx 0 10rpx;
}
.aspect {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  font-size: 28rpx;
}
.aspect-name {
  width: 90rpx;
}
.bar {
  flex: 1;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $sb-gold, $sb-red);
  transform-origin: 0 50%;
  animation: grow 0.8s ease-out both;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.aspect-stars {
  width: 150rpx;
  color: $sb-gold;
}
.yiji {
  display: flex;
}
.col {
  flex: 1;
  text-align: center;
}
.yi-title, .ji-title {
  font-size: 44rpx;
  margin-bottom: 12rpx;
}
.yi-title { color: $sb-red; }
.ji-title { color: #8c847c; }
.item {
  font-size: 28rpx;
  line-height: 1.9;
}
.poem {
  font-size: 30rpx;
  line-height: 1.8;
  margin-bottom: 12rpx;
}
</style>
