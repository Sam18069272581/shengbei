<template>
  <view class="page">
    <view class="card head">
      <view class="muted">{{ f.date }}</view>
      <view class="overall">
        今日综合
        <text class="stars">{{ '★'.repeat(f.overall) }}{{ '☆'.repeat(5 - f.overall) }}</text>
      </view>
      <view class="lucky muted">幸运色 {{ f.color }} · 幸运数字 {{ f.number }}</view>
    </view>

    <view class="card">
      <view class="section-title">分项运势</view>
      <view v-for="a in f.aspects" :key="a.key" class="aspect">
        <text class="aspect-name">{{ a.name }}</text>
        <view class="bar"><view class="bar-fill" :style="{ width: a.stars * 20 + '%' }" /></view>
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

    <view class="card" v-if="f.qian" @click="openQian">
      <view class="section-title">今日一签 · {{ f.qian.deityName }} 第{{ cnNumber(f.qian.no) }}签</view>
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
.stars {
  color: $sb-gold;
  font-size: 44rpx;
  margin-left: 12rpx;
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
  background: #f1e3c4;
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $sb-gold, $sb-red);
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
.ji-title { color: #555; }
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
