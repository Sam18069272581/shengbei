<template>
  <view class="page">
    <view v-if="list.length" class="summary card">
      <view class="sum-item">
        <view class="sum-num">{{ list.length }}</view>
        <view class="muted">共求签</view>
      </view>
      <view class="sum-item">
        <view class="sum-num">{{ goodCount }}</view>
        <view class="muted">上签以上</view>
      </view>
      <view class="sum-item">
        <view class="sum-num name">{{ favDeity || '—' }}</view>
        <view class="muted">最常拜</view>
      </view>
    </view>

    <view v-for="g in groups" :key="g.day" class="group">
      <view class="day muted">{{ g.day }}</view>
      <view v-for="(r, i) in g.items" :key="r.at" class="row card" :style="{ animationDelay: Math.min(i, 8) * 0.06 + 's' }" @click="open(r)">
        <view class="row-god"><DeityAvatar :id="r.deityId" :size="96" /></view>
        <view class="row-main">
          <view class="row-head">
            <text>{{ r.q.deity.name }} · 第{{ cnNumber(r.no) }}签</text>
            <text class="lv" :class="'lv-' + r.q.level">{{ r.q.level }}</text>
          </view>
          <view class="row-poem">{{ firstCouplet(r.q.poem) }}</view>
          <view class="row-meta muted">
            <text>{{ time(r.at) }}</text>
            <text v-if="r.topic"> · 问{{ topicName(r.topic) }}</text>
            <text v-if="r.confirmed"> · 圣杯允签</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!list.length" class="empty">
      <image class="empty-tube" :src="art('tube')" mode="widthFix" />
      <view class="muted">还没有求过签</view>
      <view class="btn" @click="go">去求一签</view>
    </view>

    <view v-if="list.length" class="clear muted" @click="clear">清空记录</view>
    <view class="disclaimer">记录只保存在本机，最多保留 100 条</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getHistory, clearHistory, today } from '../../utils/storage'
import { getQian, cnNumber, topicName, LEVEL_SCORE } from '../../utils/qian'
import { art } from '../../utils/art'
import DeityAvatar from '../../components/DeityAvatar.vue'

const list = ref([])
// 签文数据更新后旧记录可能失效，过滤掉找不到的签
const load = () => {
  list.value = getHistory()
    .map((r) => ({ ...r, q: getQian(r.deityId, r.no) }))
    .filter((r) => r.q)
}
onShow(load)

const goodCount = computed(() => list.value.filter((r) => LEVEL_SCORE[r.q.level] >= 4).length)
const favDeity = computed(() => {
  const c = {}
  for (const r of list.value) c[r.q.deity.name] = (c[r.q.deity.name] || 0) + 1
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0]
})

const yesterday = () => today(new Date(Date.now() - 86400000))
const dayLabel = (at) => {
  const d = today(new Date(at))
  if (d === today()) return '今天'
  if (d === yesterday()) return '昨天'
  return d
}
const groups = computed(() => {
  const out = []
  for (const r of list.value) {
    const day = dayLabel(r.at)
    let g = out[out.length - 1]
    if (!g || g.day !== day) out.push((g = { day, items: [] }))
    g.items.push(r)
  }
  return out
})
const time = (at) => {
  const d = new Date(at)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 签诗前两句；有的句子自带标点，先去掉再统一用逗号连接
const firstCouplet = (poem) => poem.slice(0, 2).map((l) => l.replace(/[，。！？；、]$/, '')).join('，')

const open = (r) => uni.navigateTo({ url: `/pages/result/result?deity=${r.deityId}&no=${r.no}&topic=${r.topic || ''}` })
const go = () => uni.navigateTo({ url: '/pages/qiuqian/qiuqian' })
const clear = () =>
  uni.showModal({
    title: '清空记录',
    content: '确定删除全部求签记录吗？',
    success: (res) => {
      if (res.confirm) {
        clearHistory()
        load()
      }
    },
  })
</script>

<style lang="scss" scoped>
.summary {
  display: flex;
  text-align: center;
}
.sum-item {
  flex: 1;
}
.sum-num {
  font-size: 40rpx;
  color: $sb-gold-light;
  margin-bottom: 4rpx;
}
.sum-num.name {
  font-size: 30rpx;
  line-height: 56rpx;
}
.day {
  margin: 28rpx 4rpx 12rpx;
  font-size: 24rpx;
  letter-spacing: 4rpx;
}
.row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  animation: row-in 0.4s ease-out both;
}
@keyframes row-in {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: none; }
}
.row-god {
  flex: none;
  width: 96rpx;
}
.row-main {
  flex: 1;
  min-width: 0;
}
.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}
.lv {
  padding: 0 14rpx;
  border: 1rpx solid $sb-muted;
  color: $sb-muted;
  font-size: 22rpx;
  border-radius: 4rpx;
}
.lv-上上, .lv-上 {
  border-color: $sb-vermilion;
  color: $sb-vermilion;
}
.lv-中 {
  border-color: $sb-gold;
  color: $sb-gold;
}
.row-poem {
  margin: 8rpx 0 6rpx;
  font-size: 26rpx;
  color: $sb-gold-light;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-meta {
  font-size: 22rpx;
}
.empty {
  padding: 120rpx 0 60rpx;
  text-align: center;
}
.empty-tube {
  width: 160rpx;
  opacity: 0.6;
  margin-bottom: 24rpx;
}
.empty .btn {
  margin: 40rpx auto 0;
  width: 320rpx;
}
.clear {
  margin: 40rpx 0 0;
  text-align: center;
  font-size: 24rpx;
  text-decoration: underline;
}
</style>
