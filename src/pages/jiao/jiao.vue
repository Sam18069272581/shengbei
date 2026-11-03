<template>
  <view class="page">
    <view class="gods">
      <view
        v-for="d in deities"
        :key="d.id"
        class="god-chip"
        :class="{ on: deityId === d.id }"
        @click="pickDeity(d.id)"
      >
        <image class="god-chip-img" :src="`/static/art/${d.id}.svg`" mode="widthFix" />
        <text>{{ d.name }}</text>
      </view>
    </view>

    <view class="stage">
      <DeityAvatar :id="deityId" :size="260" :mood="mood" :mood-key="landKey" :bubble="bubble" />
      <JiaoBlocks :blocks="current ? current.blocks : [true, false]" :state="state" :land-key="landKey" />
    </view>

    <view class="result" v-if="showResult">
      <view class="result-name" :class="current.kind" :key="landKey">{{ current.name }}</view>
      <view class="muted">{{ current.desc }}</view>
    </view>
    <view class="result" v-if="!showResult">
      <input v-model="question" class="input" placeholder="心中默念姓名，写下想问的事（可不填）" maxlength="40" />
    </view>

    <view class="streak" v-if="streak > 0">
      <text v-for="i in Math.min(streak, 3)" :key="i" class="cup">圣</text>
      连续圣筊 {{ streak }} 次<text v-if="streak >= 3">，神明确认无疑！</text>
    </view>

    <view class="btn" :class="{ disabled: state === 'tossing' }" @click="toss">
      {{ state === 'tossing' ? '筊杯飞起来啦…' : current ? '再掷一次' : '掷 筊' }}
    </view>
    <view class="muted center">手机也可以摇一摇</view>

    <view class="card history" v-if="records.length">
      <view class="section-title">本次记录</view>
      <view v-for="(r, i) in records" :key="i" class="record">
        <text>第 {{ records.length - i }} 掷</text>
        <text :class="r.kind">{{ r.name }}</text>
      </view>
    </view>

    <view class="card">
      <view class="section-title">怎么看筊</view>
      <view class="rule"><text class="sheng">圣筊</text> 一平一凸：神明应允，可以去做。</view>
      <view class="rule"><text class="xiao">笑筊</text> 两平：神明笑而不答，问题可能没问清楚。</view>
      <view class="rule"><text class="yin">阴筊</text> 两凸：神明不认同，或时机未到。</view>
      <view class="muted">重大事情习惯求「三圣筊」，连续三次圣筊才算确认。</view>
    </view>
    <view class="disclaimer">仅供娱乐与传统文化体验</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import JiaoBlocks from '../../components/JiaoBlocks.vue'
import DeityAvatar from '../../components/DeityAvatar.vue'
import { throwJiao } from '../../utils/jiao'
import { listDeities } from '../../utils/qian'
import { useShake } from '../../utils/shake'

const deities = listDeities()
const deityId = ref(deities[0]?.id || 'mazu')
const question = ref('')
const current = ref(null)
const state = ref('idle')
const landKey = ref(0)
const records = ref([])

const REACT = {
  sheng: { mood: 'nod', bubble: ['允！', '可行～', '去吧！'] },
  xiao: { mood: 'laugh', bubble: ['哈哈，再想想？', '问清楚些～', '嘻嘻'] },
  yin: { mood: 'shake', bubble: ['不妥不妥', '时机未到', '再斟酌'] },
}
const mood = computed(() => (state.value === 'tossing' ? 'think' : state.value === 'landed' && current.value ? REACT[current.value.kind].mood : 'idle'))
const bubble = computed(() => {
  if (state.value === 'tossing') return '……'
  if (state.value === 'landed' && current.value) {
    const list = REACT[current.value.kind].bubble
    return list[landKey.value % list.length]
  }
  return '心诚则灵'
})

const showResult = computed(() => !!current.value && state.value === 'landed')

const streak = computed(() => {
  let n = 0
  for (const r of records.value) {
    if (r.kind !== 'sheng') break
    n++
  }
  return n
})

onLoad((q) => {
  if (q.deity && deities.some((d) => d.id === q.deity)) deityId.value = q.deity
})

function pickDeity(id) {
  deityId.value = id
  records.value = []
  current.value = null
  state.value = 'idle'
}

function toss() {
  if (state.value === 'tossing') return
  state.value = 'tossing'
  setTimeout(() => {
    current.value = throwJiao()
    records.value.unshift(current.value)
    landKey.value++
    state.value = 'landed'
    uni.vibrateShort?.({ fail: () => {} })
  }, 1300)
}

const shake = useShake(toss)
onShow(shake.start)
onHide(shake.stop)
</script>

<style lang="scss" scoped>
.gods {
  display: flex;
  gap: 12rpx;
  margin-bottom: 8rpx;
}
.god-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0 8rpx;
  border-radius: 16rpx;
  border: 2rpx solid #ead7b0;
  background: #fffaf0;
  font-size: 22rpx;
}
.god-chip.on {
  border-color: $sb-red;
  background: #fff0e0;
  box-shadow: 0 0 0 3rpx rgba(163, 22, 13, 0.2);
}
.god-chip-img {
  width: 70rpx;
}
.stage {
  position: relative;
  padding-top: 40rpx;
  margin-bottom: -20rpx;
}
.result {
  text-align: center;
  min-height: 130rpx;
  margin-bottom: 16rpx;
}
.result-name {
  font-size: 60rpx;
  letter-spacing: 12rpx;
  margin-bottom: 8rpx;
  animation: stamp 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) 0.35s both;
}
@keyframes stamp {
  from { transform: scale(2.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.input {
  margin: 20rpx 0;
  border-bottom: 2rpx solid #ead7b0;
  padding: 12rpx 0;
  font-size: 28rpx;
  text-align: center;
}
.sheng { color: $sb-red; }
.xiao { color: #d08a1a; }
.yin { color: #555; }
.streak {
  text-align: center;
  color: $sb-red;
  margin-bottom: 24rpx;
  font-size: 28rpx;
}
.cup {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  background: $sb-red;
  color: #ffe9a8;
  font-size: 22rpx;
  animation: stamp 0.4s ease-out both;
}
.center {
  text-align: center;
  margin-top: 12rpx;
}
.history {
  margin-top: 32rpx;
}
.record {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  font-size: 28rpx;
  border-bottom: 1rpx dashed #ead7b0;
}
.rule {
  font-size: 28rpx;
  margin-bottom: 12rpx;
}
.rule text {
  margin-right: 12rpx;
  font-weight: bold;
}
</style>
