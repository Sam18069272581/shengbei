<template>
  <view class="page">
    <!-- 第一步：选事项与神明 -->
    <block v-if="step === 'choose'">
      <view class="section-title">一、所问何事</view>
      <view class="chips">
        <view v-for="t in TOPICS" :key="t.key" class="chip" :class="{ on: topic === t.key }" @click="pickTopic(t.key)">
          {{ t.name }}
        </view>
      </view>

      <view class="section-title">二、向哪位神明求签</view>
      <view
        v-for="d in deities"
        :key="d.id"
        class="card deity"
        :class="{ on: deityId === d.id }"
        @click="deityId = d.id"
      >
        <view class="deity-name">
          {{ d.name }}<text class="muted"> · {{ d.title }}</text>
          <text v-if="d.id === recommended" class="tag">推荐</text>
        </view>
        <view class="muted">{{ d.setName }} {{ d.total }} 签 · 主 {{ d.domains.join('、') }}</view>
      </view>
      <view v-if="!deities.length" class="muted">签文数据尚未生成，请先运行 npm run build:data</view>

      <view class="tips muted">求签前心中默念姓名、生辰、住址，以及想问的事，越具体越好。</view>
      <view class="btn" :class="{ disabled: !deityId }" @click="startShake">开始求签</view>
    </block>

    <!-- 第二步：摇签 -->
    <block v-else-if="step === 'shake'">
      <view class="center-title">{{ deity.name }}</view>
      <view class="muted center">所问：{{ topicName(topic) }}　第 {{ attempt }} 次求签</view>
      <view class="tube" :class="{ shaking }">
        <view class="sticks">
          <view v-for="i in 9" :key="i" class="stick" :style="{ transform: `rotate(${(i - 5) * 4}deg)` }" />
        </view>
        <view class="tube-body">签</view>
      </view>
      <view v-if="drawn" class="drawn">
        掉出一支：<text class="drawn-no">第{{ cnNumber(drawn) }}签</text>
      </view>
      <view v-if="!drawn" class="btn" :class="{ disabled: shaking }" @click="shakeTube">
        {{ shaking ? '摇签中…' : '摇 签（或摇手机）' }}
      </view>
      <view v-else class="btn" @click="step = 'confirm'">掷筊请示，确认此签</view>
    </block>

    <!-- 第三步：掷筊确认 -->
    <block v-else-if="step === 'confirm'">
      <view class="center-title">第{{ cnNumber(drawn) }}签 · 是否为此签？</view>
      <JiaoBlocks :blocks="jiao ? jiao.blocks : [true, false]" :tossing="tossing" />
      <view v-if="jiao && !tossing" class="center">
        <view class="jiao-name" :class="jiao.kind">{{ jiao.name }}</view>
        <view class="muted">{{ confirmText }}</view>
      </view>

      <view v-if="!jiao || tossing" class="btn" :class="{ disabled: tossing }" @click="tossConfirm">
        {{ tossing ? '掷筊中…' : '掷 筊' }}
      </view>
      <view v-else-if="jiao.kind === 'sheng'" class="btn" @click="openResult">圣筊应允，看签诗</view>
      <view v-else-if="attempt < MAX_ATTEMPTS" class="btn" @click="redraw">重新求签</view>
      <block v-else>
        <view class="muted center gap">已求 {{ MAX_ATTEMPTS }} 次未得圣筊，或许时机未到，或问题还不够清楚。</view>
        <view class="btn" @click="openResult">仍然看这支签</view>
        <view class="btn ghost gap" @click="reset">改日再求</view>
      </block>
    </block>

    <view class="disclaimer">仅供娱乐与传统文化体验</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import JiaoBlocks from '../../components/JiaoBlocks.vue'
import { TOPICS, topicName, listDeities, recommendDeity, getSet, cnNumber } from '../../utils/qian'
import { throwJiao } from '../../utils/jiao'
import { addHistory } from '../../utils/storage'
import { useShake } from '../../utils/shake'

const MAX_ATTEMPTS = 3
const deities = listDeities()

const step = ref('choose')
const topic = ref('career')
const deityId = ref('')
const recommended = computed(() => recommendDeity(topic.value))
const deity = computed(() => deities.find((d) => d.id === deityId.value) || {})

const attempt = ref(1)
const shaking = ref(false)
const drawn = ref(0)
const jiao = ref(null)
const tossing = ref(false)

const confirmText = computed(() => {
  if (!jiao.value) return ''
  if (jiao.value.kind === 'sheng') return '神明应允，此签即为所求。'
  return jiao.value.kind === 'xiao' ? '笑筊：神明未明示，需重新求签。' : '阴筊：并非此签，需重新求签。'
})

onLoad((q) => {
  if (q.topic && TOPICS.some((t) => t.key === q.topic)) topic.value = q.topic
  deityId.value = q.deity && deities.some((d) => d.id === q.deity) ? q.deity : recommended.value
})

function pickTopic(key) {
  topic.value = key
  deityId.value = recommended.value
}

function startShake() {
  if (!deityId.value) return
  step.value = 'shake'
}

function shakeTube() {
  if (step.value !== 'shake' || shaking.value || drawn.value) return
  shaking.value = true
  setTimeout(() => {
    const total = getSet(deityId.value).qian.length
    drawn.value = 1 + Math.floor(Math.random() * total)
    shaking.value = false
    uni.vibrateShort?.({ fail: () => {} })
  }, 1400)
}

function tossConfirm() {
  if (tossing.value) return
  tossing.value = true
  setTimeout(() => {
    jiao.value = throwJiao()
    tossing.value = false
  }, 900)
}

function redraw() {
  attempt.value++
  drawn.value = 0
  jiao.value = null
  step.value = 'shake'
}

function reset() {
  attempt.value = 1
  drawn.value = 0
  jiao.value = null
  step.value = 'choose'
}

function openResult() {
  const item = { deityId: deityId.value, no: drawn.value, topic: topic.value, confirmed: jiao.value?.kind === 'sheng' }
  addHistory(item)
  uni.redirectTo({ url: `/pages/result/result?deity=${item.deityId}&no=${item.no}&topic=${item.topic}` })
}

const shake = useShake(shakeTube)
onShow(shake.start)
onHide(shake.stop)
</script>

<style lang="scss" scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 36rpx;
}
.chip {
  padding: 12rpx 32rpx;
  border-radius: 999rpx;
  border: 2rpx solid #ead7b0;
  background: #fffaf0;
  font-size: 28rpx;
}
.chip.on {
  background: $sb-red;
  border-color: $sb-red;
  color: #fff3d6;
}
.deity.on {
  border-color: $sb-red;
  box-shadow: 0 0 0 3rpx rgba(163, 22, 13, 0.25);
}
.deity-name {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}
.tag {
  margin-left: 12rpx;
  font-size: 22rpx;
  color: #fff;
  background: $sb-gold;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
}
.tips {
  margin: 12rpx 0 32rpx;
}
.center {
  text-align: center;
}
.gap {
  margin: 24rpx 0;
}
.center-title {
  text-align: center;
  font-size: 40rpx;
  color: $sb-red;
  letter-spacing: 6rpx;
  margin: 16rpx 0 8rpx;
}
.tube {
  width: 220rpx;
  margin: 60rpx auto 40rpx;
  transform-origin: 50% 100%;
}
.tube.shaking {
  animation: shake 0.25s ease-in-out infinite alternate;
}
@keyframes shake {
  from { transform: rotate(-10deg); }
  to { transform: rotate(10deg); }
}
.sticks {
  display: flex;
  justify-content: center;
  height: 120rpx;
  align-items: flex-end;
}
.stick {
  width: 14rpx;
  height: 160rpx;
  margin: 0 3rpx;
  background: linear-gradient(#e9c27a, #c99a4a);
  border-radius: 6rpx 6rpx 0 0;
  transform-origin: 50% 100%;
}
.tube-body {
  height: 260rpx;
  background: linear-gradient(90deg, $sb-red-dark, #c42a1c 50%, $sb-red-dark);
  border-radius: 16rpx 16rpx 24rpx 24rpx;
  color: $sb-gold;
  font-size: 72rpx;
  text-align: center;
  line-height: 260rpx;
}
.drawn {
  text-align: center;
  font-size: 32rpx;
  margin-bottom: 32rpx;
}
.drawn-no {
  color: $sb-red;
  font-size: 44rpx;
}
.jiao-name {
  font-size: 52rpx;
  letter-spacing: 12rpx;
}
.jiao-name.sheng { color: $sb-red; }
.jiao-name.xiao { color: $sb-gold; }
.jiao-name.yin { color: #555; }
.center + .btn {
  margin-top: 32rpx;
}
</style>
