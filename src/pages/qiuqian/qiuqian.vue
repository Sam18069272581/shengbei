<template>
  <view class="page">
    <!-- 第一步：选事项与神明 -->
    <block v-if="step === 'choose'">
      <view class="section-title">一、所问何事</view>
      <view class="chips">
        <view v-for="t in TOPICS" :key="t.key" class="chip" :class="{ on: topic === t.key }" @click="pickTopic(t.key)">
          {{ t.icon }} {{ t.name }}
        </view>
      </view>

      <view class="section-title">二、向哪位神明求签</view>
      <view class="god-grid">
        <view
          v-for="d in deities"
          :key="d.id"
          class="god-card"
          :class="{ on: deityId === d.id }"
          @click="deityId = d.id"
        >
          <view v-if="d.id === recommended" class="tag">推荐</view>
          <DeityAvatar :id="d.id" :size="170" :mood="deityId === d.id ? 'laugh' : 'idle'" />
          <view class="god-name">{{ d.name }}</view>
          <view class="muted">{{ d.total }} 签 · {{ d.domains.slice(0, 2).join('、') }}</view>
        </view>
      </view>
      <view v-if="!deities.length" class="muted">签文数据尚未生成，请先运行 npm run build:data</view>

      <view class="tips muted">求签前心中默念姓名、生辰、住址，以及想问的事，越具体越好。</view>
      <view class="btn" :class="{ disabled: !deityId }" @click="startShake">开始求签</view>
    </block>

    <!-- 第二步：摇签 -->
    <block v-else-if="step === 'shake'">
      <view class="muted center ask-line">所问：{{ topicName(topic) }}　第 {{ attempt }} 次求签</view>
      <DeityAvatar :id="deityId" :size="220" :mood="shaking ? 'think' : drawn ? 'nod' : 'idle'" :bubble="shaking ? '诚心摇～' : drawn ? '就是这支' : '请摇签筒'" />
      <view class="tube-wrap" @click="shakeTube">
        <view class="tube" :class="{ shaking }">
          <view class="sticks">
            <view v-for="i in 11" :key="i" class="stick" :class="['s' + i, { jiggle: shaking }]" />
          </view>
          <image class="tube-img" :src="art('tube')" mode="widthFix" />
        </view>
        <view v-if="drawn" class="flying-stick">
          <view class="stick-face">第{{ cnNumber(drawn) }}签</view>
        </view>
      </view>
      <view v-if="drawn" class="drawn">
        掉出一支：<text class="drawn-no">第{{ cnNumber(drawn) }}签</text>
      </view>
      <view v-if="!drawn" class="btn" :class="{ disabled: shaking }" @click="shakeTube">
        {{ shaking ? '签筒哗啦啦…' : '摇 签（或摇手机）' }}
      </view>
      <view v-else class="btn" @click="toConfirm">掷筊请示，确认此签</view>
    </block>

    <!-- 第三步：掷筊确认 -->
    <block v-else-if="step === 'confirm'">
      <view class="center-title">第{{ cnNumber(drawn) }}签 · 是否为此签？</view>
      <DeityAvatar :id="deityId" :size="200" :mood="avatarMood" :mood-key="landKey" :bubble="avatarBubble" />
      <JiaoBlocks :blocks="jiao ? jiao.blocks : [true, false]" :state="jiaoState" :land-key="landKey" />
      <view v-if="jiao && jiaoState === 'landed'" class="center" :key="landKey">
        <view class="jiao-name" :class="jiao.kind">{{ jiao.name }}</view>
        <view class="muted">{{ confirmText }}</view>
      </view>

      <view v-if="!jiao || jiaoState === 'tossing'" class="btn gap" :class="{ disabled: jiaoState === 'tossing' }" @click="tossConfirm">
        {{ jiaoState === 'tossing' ? '筊杯飞起来啦…' : '掷 筊' }}
      </view>
      <view v-else-if="jiao.kind === 'sheng'" class="btn gap glow" @click="openResult">圣筊应允，看签诗</view>
      <view v-else-if="attempt < MAX_ATTEMPTS" class="btn gap" @click="redraw">重新求签</view>
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
import { art } from '../../utils/art'
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import JiaoBlocks from '../../components/JiaoBlocks.vue'
import DeityAvatar from '../../components/DeityAvatar.vue'
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

const attempt = ref(1)
const shaking = ref(false)
const drawn = ref(0)
const jiao = ref(null)
const jiaoState = ref('idle')
const landKey = ref(0)

const confirmText = computed(() => {
  if (!jiao.value) return ''
  if (jiao.value.kind === 'sheng') return '神明应允，此签即为所求。'
  return jiao.value.kind === 'xiao' ? '笑筊：神明未明示，需重新求签。' : '阴筊：并非此签，需重新求签。'
})
const avatarMood = computed(() => {
  if (jiaoState.value === 'tossing') return 'think'
  if (!jiao.value) return 'idle'
  return { sheng: 'nod', xiao: 'laugh', yin: 'shake' }[jiao.value.kind]
})
const avatarBubble = computed(() => {
  if (jiaoState.value === 'tossing') return '……'
  if (!jiao.value) return '掷筊问我'
  return { sheng: '正是此签！', xiao: '再求一次～', yin: '不是这支' }[jiao.value.kind]
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
  }, 1800)
}

function toConfirm() {
  jiao.value = null
  jiaoState.value = 'idle'
  step.value = 'confirm'
}

function tossConfirm() {
  if (jiaoState.value === 'tossing') return
  jiaoState.value = 'tossing'
  setTimeout(() => {
    jiao.value = throwJiao()
    landKey.value++
    jiaoState.value = 'landed'
  }, 1300)
}

function redraw() {
  attempt.value++
  drawn.value = 0
  jiao.value = null
  jiaoState.value = 'idle'
  step.value = 'shake'
}

function reset() {
  attempt.value = 1
  drawn.value = 0
  jiao.value = null
  jiaoState.value = 'idle'
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
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  border: 2rpx solid #ead7b0;
  background: #fffaf0;
  font-size: 28rpx;
  transition: transform 0.2s;
}
.chip.on {
  background: $sb-red;
  border-color: $sb-red;
  color: #fff3d6;
  transform: scale(1.06);
}
.god-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.god-card {
  position: relative;
  width: calc(50% - 10rpx);
  box-sizing: border-box;
  padding: 24rpx 12rpx 20rpx;
  text-align: center;
  background: #fffaf0;
  border: 3rpx solid #ead7b0;
  border-radius: 24rpx;
  transition: transform 0.2s;
}
.god-card.on {
  border-color: $sb-red;
  background: #fff0e0;
  transform: translateY(-6rpx);
  box-shadow: 0 10rpx 24rpx rgba(163, 22, 13, 0.18);
}
.god-name {
  font-size: 32rpx;
  margin-top: 6rpx;
}
.tag {
  position: absolute;
  z-index: 3;
  left: 16rpx;
  top: 16rpx;
  font-size: 22rpx;
  color: #fff;
  background: $sb-gold;
  padding: 2rpx 14rpx;
  border-radius: 8rpx;
  animation: tagbeat 1.2s ease-in-out infinite;
}
@keyframes tagbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
.tips {
  margin: 28rpx 0 32rpx;
}
.center {
  text-align: center;
}
.ask-line {
  margin-bottom: 40rpx;
}
.gap {
  margin: 24rpx 0;
}
.center-title {
  text-align: center;
  font-size: 38rpx;
  color: $sb-red;
  letter-spacing: 4rpx;
  margin: 8rpx 0 70rpx;
}
.tube-wrap {
  position: relative;
  width: 220rpx;
  height: 380rpx;
  margin: 10rpx auto 20rpx;
}
.tube {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: 50% 100%;
}
.tube.shaking {
  animation: tubeshake 0.22s ease-in-out infinite alternate;
}
@keyframes tubeshake {
  from { transform: rotate(-14deg) translateY(-8rpx); }
  to { transform: rotate(14deg) translateY(0); }
}
.sticks {
  position: absolute;
  left: 40rpx;
  right: 40rpx;
  bottom: 230rpx;
  height: 140rpx;
}
.stick {
  position: absolute;
  bottom: 0;
  width: 14rpx;
  height: 150rpx;
  border-radius: 6rpx 6rpx 0 0;
  background: linear-gradient(#f3d08a, #c99a4a);
  transform-origin: 50% 100%;
}
.stick::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22rpx;
  border-radius: 6rpx 6rpx 0 0;
  background: $sb-red;
}
@for $i from 1 through 11 {
  .s#{$i} {
    left: #{($i - 1) * 12}rpx;
    transform: rotate(#{($i - 6) * 3}deg);
    height: #{130 + ($i * 7) % 30}rpx;
  }
}
.stick.jiggle {
  animation: jiggle 0.18s ease-in-out infinite alternate;
}
.s2.jiggle, .s5.jiggle, .s8.jiggle, .s11.jiggle { animation-delay: 0.09s; }
@keyframes jiggle {
  from { margin-bottom: 0; }
  to { margin-bottom: 26rpx; }
}
.tube-img {
  width: 220rpx;
  display: block;
  position: relative;
}
.flying-stick {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 230rpx;
  width: 56rpx;
  height: 260rpx;
  margin-left: -28rpx;
  border-radius: 10rpx;
  background: linear-gradient(#f6dc9e, #d6a75a);
  border: 3rpx solid #a87a34;
  box-shadow: 0 10rpx 24rpx rgba(110, 12, 6, 0.3);
  animation: flyout 0.9s cubic-bezier(0.2, 1.3, 0.4, 1) both;
}
.stick-face {
  writing-mode: vertical-rl;
  color: $sb-red;
  font-size: 30rpx;
  font-weight: bold;
  margin: 24rpx auto 0;
  letter-spacing: 6rpx;
}
@keyframes flyout {
  0% { transform: translateY(160rpx) rotate(0); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translate(150rpx, 40rpx) rotate(28deg); opacity: 1; }
}
.drawn {
  text-align: center;
  font-size: 32rpx;
  margin-bottom: 28rpx;
  animation: fadeup 0.5s ease-out 0.5s both;
}
@keyframes fadeup {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.drawn-no {
  color: $sb-red;
  font-size: 44rpx;
}
.jiao-name {
  font-size: 56rpx;
  letter-spacing: 12rpx;
  animation: stamp 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) 0.35s both;
}
@keyframes stamp {
  from { transform: scale(2.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.jiao-name.sheng { color: $sb-red; }
.jiao-name.xiao { color: #d08a1a; }
.jiao-name.yin { color: #555; }
.glow {
  animation: glow 1.4s ease-in-out infinite;
}
@keyframes glow {
  0%, 100% { box-shadow: 0 6rpx 16rpx rgba(163, 22, 13, 0.3); }
  50% { box-shadow: 0 0 36rpx rgba(255, 190, 60, 0.9); }
}
</style>
