<template>
  <view class="page" v-if="q">
    <view class="cheer">
      <DeityAvatar :id="q.deity.id" :size="180" :mood="cheerMood" :bubble="cheerText" />
      <Sparkles v-if="LEVEL_SCORE[q.level] >= 4" />
    </view>
    <view class="scroll">
      <view class="rod top" />
      <view class="paper">
        <view class="paper-head">
          <text>{{ q.set.name }}</text>
          <text>第{{ cnNumber(q.no) }}签<text v-if="q.label"> · {{ q.label }}</text></text>
        </view>
        <view class="level-row">
          <view class="stamp-wrap">
            <text class="level stamp" :class="`level-${q.level}`">{{ q.level }}签</text>
            <view v-for="i in 7" :key="i" class="ink" :class="'k' + i" />
          </view>
        </view>
        <view class="poem">
          <view v-for="(line, i) in q.poem" :key="i" class="poem-line" :style="{ animationDelay: 1.0 + i * 0.45 + 's' }">{{ line }}</view>
        </view>
        <view v-if="q.title" class="story">典故：{{ q.title }}</view>
      </view>
      <view class="rod bottom" />
    </view>

    <view class="card rise">
      <view class="section-title">签意</view>
      <view class="text">{{ q.meaning }}</view>
    </view>

    <view class="card focus" v-if="topic && q.topics[topic]">
      <view class="section-title">所问 · {{ topicName(topic) }}</view>
      <view class="text">{{ q.topics[topic] }}</view>
    </view>

    <view class="card">
      <view class="section-title">各事参考</view>
      <view v-for="t in otherTopics" :key="t.key" class="topic-row">
        <text class="topic-key">{{ t.name }}</text>
        <text class="text">{{ q.topics[t.key] }}</text>
      </view>
    </view>

    <view v-if="q.source_note" class="muted">注：{{ q.source_note }}</view>
    <view class="muted">签诗版本：{{ q.set.source }}</view>

    <view class="actions">
      <view class="btn" @click="again">再求一签</view>
      <view class="btn ghost" @click="home">回首页</view>
    </view>
    <view class="disclaimer">签诗为传统民间文本，释义为本站自撰，仅供娱乐与传统文化学习</view>
  </view>
  <view class="page" v-else>
    <view class="muted">找不到这支签。</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { TOPICS, topicName, getQian, cnNumber, LEVEL_SCORE } from '../../utils/qian'
import DeityAvatar from '../../components/DeityAvatar.vue'
import Sparkles from '../../components/Sparkles.vue'

const q = ref(null)
const topic = ref('')

onLoad((opts) => {
  q.value = getQian(opts.deity, Number(opts.no))
  topic.value = opts.topic || ''
  if (q.value) uni.setNavigationBarTitle({ title: `${q.value.deity.name} · 第${cnNumber(q.value.no)}签` })
})

const CHEER = { 上上: ['laugh', '大吉大利！'], 上: ['nod', '是好签哦'], 中: ['idle', '平平稳稳'], 下: ['think', '莫急，慢慢来'], 下下: ['think', '静心守正，会转好'] }
const cheerMood = computed(() => CHEER[q.value?.level]?.[0] || 'idle')
const cheerText = computed(() => CHEER[q.value?.level]?.[1] || '')

const otherTopics = computed(() => TOPICS.filter((t) => t.key !== topic.value && q.value?.topics[t.key]))

const again = () => uni.redirectTo({ url: `/pages/qiuqian/qiuqian?deity=${q.value.deity.id}&topic=${topic.value}` })
const home = () => uni.reLaunch({ url: '/pages/index/index' })
</script>

<style lang="scss" scoped>
.cheer {
  position: relative;
  padding-top: 44rpx;
  margin-bottom: -30rpx;
  z-index: 1;
}
.paper {
  animation: unroll 1s cubic-bezier(0.5, 0, 0.3, 1) 0.15s both;
  background: linear-gradient(180deg, #f3e8cf, #e4d3ad);
  color: $sb-paper-ink;
  border: 2rpx solid $sb-gold;
  outline: 1rpx solid rgba(140, 100, 50, 0.5);
  outline-offset: -16rpx;
  border-radius: 4rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 30rpx 60rpx rgba(0, 0, 0, 0.5);
  margin-bottom: 28rpx;
}
.paper-head {
  display: flex;
  justify-content: space-between;
  color: #8e2f24;
  font-size: 26rpx;
  letter-spacing: 2rpx;
}
.level-row {
  text-align: center;
  margin: 24rpx 0;
}
.poem {
  text-align: center;
}
@keyframes unroll {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}
.scroll {
  position: relative;
  margin: 0 8rpx 36rpx;
}
.scroll .paper {
  margin-bottom: 0;
}
.rod {
  position: relative;
  z-index: 2;
  height: 26rpx;
  margin: 0 -22rpx;
  border-radius: 13rpx;
  background: linear-gradient(180deg, #8a5a30, #4a2a14 60%, #2a170a);
  box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.5);
}
.rod::before,
.rod::after {
  content: '';
  position: absolute;
  top: -4rpx;
  width: 22rpx;
  height: 34rpx;
  border-radius: 8rpx;
  background: linear-gradient(180deg, #f6e2b0, #b98f4e);
}
.rod::before { left: -10rpx; }
.rod::after { right: -10rpx; }
.rod.bottom {
  animation: rodroll 1s cubic-bezier(0.5, 0, 0.3, 1) 0.15s both;
}
@keyframes rodroll {
  from { transform: translateY(var(--h, -560rpx)); }
  to { transform: none; }
}
.stamp-wrap {
  position: relative;
  display: inline-block;
}
.ink {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: $sb-vermilion;
  opacity: 0;
  animation: ink-splat 0.5s ease-out 0.95s both;
}
.k1 { --x: -70rpx; --y: -26rpx; }
.k2 { --x: 72rpx; --y: -20rpx; width: 7rpx; height: 7rpx; }
.k3 { --x: -60rpx; --y: 28rpx; width: 6rpx; height: 6rpx; }
.k4 { --x: 66rpx; --y: 26rpx; }
.k5 { --x: -90rpx; --y: 0; width: 5rpx; height: 5rpx; }
.k6 { --x: 92rpx; --y: 4rpx; width: 6rpx; height: 6rpx; }
.k7 { --x: 20rpx; --y: -40rpx; width: 5rpx; height: 5rpx; }
@keyframes ink-splat {
  0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
  40% { opacity: 0.9; }
  100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0.75; }
}
.stamp {
  animation: stamp 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) 0.75s both;
}
@keyframes stamp {
  from { transform: scale(3) rotate(-20deg); opacity: 0; }
  to { transform: scale(1) rotate(-4deg); opacity: 1; }
}
.rise {
  animation: riseup 0.6s ease-out 2.6s both;
}
@keyframes riseup {
  from { transform: translateY(40rpx); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.poem-line {
  animation: ink 0.9s cubic-bezier(0.4, 0, 0.2, 1) both;
  color: $sb-paper-ink;
  font-size: 42rpx;
  letter-spacing: 8rpx;
  line-height: 2;
}
/* 诗句像毛笔一样从左往右逐行刷出 */
@keyframes ink {
  0% { clip-path: inset(0 100% 0 0); opacity: 0.2; filter: blur(3rpx); }
  100% { clip-path: inset(0 0 0 0); opacity: 1; filter: blur(0); }
}
.story {
  text-align: center;
  color: #7a6448;
  font-size: 24rpx;
  margin-top: 16rpx;
}
.text {
  font-size: 28rpx;
  line-height: 1.8;
}
.focus {
  border-color: $sb-red;
}
.topic-row {
  display: flex;
  padding: 12rpx 0;
  border-bottom: 1rpx dashed $sb-line;
}
.topic-key {
  flex: none;
  width: 90rpx;
  color: $sb-red;
  font-size: 28rpx;
}
.actions {
  display: flex;
  gap: 24rpx;
  margin-top: 36rpx;
}
.actions .btn {
  flex: 1;
}
</style>
