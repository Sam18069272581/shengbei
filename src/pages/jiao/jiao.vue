<template>
  <view class="page">
    <view class="card">
      <view class="section-title">心中默念</view>
      <view class="muted">先在心里说出姓名、住址，再问一件「是或否」的事。也可以写下来：</view>
      <input v-model="question" class="input" placeholder="例如：这次面试能顺利吗？" maxlength="40" />
    </view>

    <JiaoBlocks :blocks="current ? current.blocks : [true, false]" :tossing="tossing" />

    <view class="result" v-if="current && !tossing">
      <view class="result-name" :class="current.kind">{{ current.name }}</view>
      <view class="muted">{{ current.desc }}</view>
    </view>
    <view class="result" v-else-if="!tossing">
      <view class="muted">双手合十，点按下方掷筊（手机也可以摇一摇）</view>
    </view>

    <view class="streak" v-if="streak > 0">
      连续圣筊 {{ streak }} 次<text v-if="streak >= 3">，三圣筊，神明确认无疑</text>
    </view>

    <view class="btn" :class="{ disabled: tossing }" @click="toss">{{ tossing ? '掷筊中…' : '掷 筊' }}</view>

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
import { onShow, onHide } from '@dcloudio/uni-app'
import JiaoBlocks from '../../components/JiaoBlocks.vue'
import { throwJiao } from '../../utils/jiao'
import { useShake } from '../../utils/shake'

const question = ref('')
const current = ref(null)
const tossing = ref(false)
const records = ref([])

const streak = computed(() => {
  let n = 0
  for (const r of records.value) {
    if (r.kind !== 'sheng') break
    n++
  }
  return n
})

function toss() {
  if (tossing.value) return
  tossing.value = true
  setTimeout(() => {
    const r = throwJiao()
    current.value = r
    records.value.unshift(r)
    tossing.value = false
    uni.vibrateShort?.({ fail: () => {} })
  }, 900)
}

const shake = useShake(toss)
onShow(shake.start)
onHide(shake.stop)
</script>

<style lang="scss" scoped>
.input {
  margin-top: 20rpx;
  border-bottom: 2rpx solid #ead7b0;
  padding: 12rpx 0;
  font-size: 30rpx;
}
.result {
  text-align: center;
  min-height: 120rpx;
  margin-bottom: 20rpx;
}
.result-name {
  font-size: 56rpx;
  letter-spacing: 12rpx;
  margin-bottom: 8rpx;
}
.sheng { color: $sb-red; }
.xiao { color: $sb-gold; }
.yin { color: #555; }
.streak {
  text-align: center;
  color: $sb-red;
  margin-bottom: 24rpx;
  font-size: 28rpx;
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
