<template>
  <view class="page" v-if="q">
    <view class="paper">
      <view class="paper-head">
        <text>{{ q.set.name }}</text>
        <text>第{{ cnNumber(q.no) }}签<text v-if="q.label"> · {{ q.label }}</text></text>
      </view>
      <view class="level-row"><text class="level" :class="`level-${q.level}`">{{ q.level }}签</text></view>
      <view class="poem">
        <view v-for="(line, i) in q.poem" :key="i" class="poem-line">{{ line }}</view>
      </view>
      <view v-if="q.title" class="story">典故：{{ q.title }}</view>
    </view>

    <view class="card">
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
import { TOPICS, topicName, getQian, cnNumber } from '../../utils/qian'

const q = ref(null)
const topic = ref('')

onLoad((opts) => {
  q.value = getQian(opts.deity, Number(opts.no))
  topic.value = opts.topic || ''
  if (q.value) uni.setNavigationBarTitle({ title: `${q.value.deity.name} · 第${cnNumber(q.value.no)}签` })
})

const otherTopics = computed(() => TOPICS.filter((t) => t.key !== topic.value && q.value?.topics[t.key]))

const again = () => uni.redirectTo({ url: `/pages/qiuqian/qiuqian?deity=${q.value.deity.id}&topic=${topic.value}` })
const home = () => uni.reLaunch({ url: '/pages/index/index' })
</script>

<style lang="scss" scoped>
.paper {
  background: linear-gradient(#fff6dc, #f7e6bd);
  border: 4rpx solid $sb-red;
  outline: 2rpx solid $sb-gold;
  outline-offset: -14rpx;
  border-radius: 12rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 28rpx;
}
.paper-head {
  display: flex;
  justify-content: space-between;
  color: $sb-red;
  font-size: 28rpx;
}
.level-row {
  text-align: center;
  margin: 24rpx 0;
}
.poem {
  text-align: center;
}
.poem-line {
  font-size: 40rpx;
  letter-spacing: 8rpx;
  line-height: 2;
}
.story {
  text-align: center;
  color: $sb-muted;
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
  border-bottom: 1rpx dashed #ead7b0;
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
