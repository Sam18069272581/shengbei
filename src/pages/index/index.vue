<template>
  <view class="page">
    <view class="hero">
      <view class="hero-title">圣 杯</view>
      <view class="hero-sub">掷筊问事 · 求灵签 · 看今日运势</view>
    </view>

    <view class="card today" @click="go('/pages/daily/daily')">
      <view class="today-head">
        <text class="section-title">今日运势</text>
        <text class="muted">{{ fortune.date }}</text>
      </view>
      <view class="stars">{{ '★'.repeat(fortune.overall) }}{{ '☆'.repeat(5 - fortune.overall) }}</view>
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
        <view class="entry-icon">筊</view>
        <view class="entry-name">掷筊问事</view>
        <view class="muted">是或否，问神明一句</view>
      </view>
      <view class="entry" @click="go('/pages/qiuqian/qiuqian')">
        <view class="entry-icon">签</view>
        <view class="entry-name">求灵签</view>
        <view class="muted">学业 · 工作 · 爱情</view>
      </view>
    </view>

    <view class="section-title">按事项求签</view>
    <view class="topics">
      <view v-for="t in TOPICS" :key="t.key" class="topic" @click="go(`/pages/qiuqian/qiuqian?topic=${t.key}`)">
        <view class="topic-icon">{{ t.icon }}</view>
        <text>{{ t.name }}</text>
      </view>
    </view>

    <view class="section-title">供奉神明</view>
    <view v-for="d in deities" :key="d.id" class="card deity" @click="go(`/pages/qiuqian/qiuqian?deity=${d.id}`)">
      <view class="deity-name">{{ d.name }}<text class="muted"> · {{ d.title }}</text></view>
      <view class="muted">{{ d.setName }} {{ d.total }} 签 · 主 {{ d.domains.join('、') }}</view>
    </view>

    <view class="disclaimer">签诗为传统民间文本，释义为本站自撰，仅供娱乐与传统文化学习</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { TOPICS, listDeities } from '../../utils/qian'
import { dailyFortune } from '../../utils/daily'

const deities = listDeities()
const fortune = ref(dailyFortune())
onShow(() => (fortune.value = dailyFortune()))

const go = (url) => uni.navigateTo({ url })
</script>

<style lang="scss" scoped>
.hero {
  text-align: center;
  padding: 40rpx 0 48rpx;
}
.hero-title {
  font-size: 80rpx;
  color: $sb-red;
  letter-spacing: 24rpx;
  font-weight: bold;
}
.hero-sub {
  color: $sb-muted;
  font-size: 26rpx;
  margin-top: 8rpx;
  letter-spacing: 4rpx;
}
.today-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.stars {
  color: $sb-gold;
  font-size: 48rpx;
  letter-spacing: 6rpx;
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
  background: linear-gradient(160deg, #b8241a, $sb-red-dark);
  color: #fff3d6;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  text-align: center;
}
.entry .muted {
  color: #f0cf9a;
}
.entry-icon {
  width: 88rpx;
  height: 88rpx;
  line-height: 88rpx;
  margin: 0 auto 12rpx;
  border-radius: 50%;
  border: 3rpx solid $sb-gold;
  color: $sb-gold;
  font-size: 44rpx;
}
.entry-name {
  font-size: 34rpx;
  letter-spacing: 4rpx;
  margin-bottom: 6rpx;
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
.topic-icon {
  color: $sb-red;
  font-size: 40rpx;
}
.deity-name {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}
</style>
