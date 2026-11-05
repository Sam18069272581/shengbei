<template>
  <view class="page">
    <TempleScene :focus="shaking || jiaoState === 'tossing'" :blessed="step === 'confirm' && jiaoState === 'landed' && jiao?.kind === 'sheng'" :bless-key="landKey" />
    <view class="page-body">
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
            <view v-if="asked[d.id]" class="tag done">今日已问</view>
          <view v-else-if="d.id === recommended" class="tag">推荐</view>
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
          <view class="tube" :class="{ shaking, done: !!drawn }">
            <view class="sticks">
              <view v-for="i in 11" :key="i" class="stick" :class="['s' + i, { jiggle: shaking }]" />
            </view>
            <image class="tube-img" :src="art('tube')" mode="widthFix" />
          </view>
          <view v-if="drawn" class="flying-stick" />
          <view v-if="drawn" class="qian-card">
            <view class="qian-card-inner">
              <view class="qc-deity">{{ deityName }}</view>
              <view class="qc-no">第{{ cnNumber(drawn) }}签</view>
              <view class="qc-seal">灵</view>
            </view>
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
        <JiaoBlocks :blocks="jiao ? jiao.blocks : [true, false]" :standing="jiao ? jiao.standing : -1" :state="jiaoState" :land-key="landKey" />
        <view v-if="jiao && jiaoState === 'landed'" class="center" :key="landKey">
          <view class="jiao-name" :class="[jiao.kind, { foil: jiao.kind === 'sheng' }]">{{ jiao.name }}</view>
          <view class="muted">{{ confirmText }}</view>
        </view>

        <view v-if="!jiao || jiaoState === 'tossing'" class="btn gap" :class="{ disabled: jiaoState === 'tossing' }" @click="tossConfirm">
          {{ jiaoState === 'tossing' ? '筊杯飞起来啦…' : '掷 筊' }}
        </view>
        <view v-else-if="jiao.kind === 'sheng'" class="btn gap glow" @click="openResult">圣筊应允，看签诗</view>
        <view v-else-if="jiao.kind === 'li'" class="btn gap" @click="tossConfirm">立筊罕见，再掷一次</view>
        <view v-else-if="attempt < MAX_ATTEMPTS" class="btn gap" @click="redraw">重新求签</view>
        <block v-else>
          <view class="muted center gap">已求 {{ MAX_ATTEMPTS }} 次未得圣筊，或许时机未到，或问题还不够清楚。</view>
          <view class="btn" @click="openResult">仍然看这支签</view>
          <view class="btn ghost gap" @click="reset">改日再求</view>
        </block>
      </block>

      <view class="disclaimer">仅供娱乐与传统文化体验</view>
    </view>
  </view>
</template>

<script setup>
import TempleScene from '../../components/TempleScene.vue'
import { art } from '../../utils/art'
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import JiaoBlocks from '../../components/JiaoBlocks.vue'
import DeityAvatar from '../../components/DeityAvatar.vue'
import { TOPICS, topicName, listDeities, recommendDeity, getSet, cnNumber } from '../../utils/qian'
import { throwJiao } from '../../utils/jiao'
import { play, stop } from '../../utils/sound'
import { addHistory, getTodayAsked, markAsked } from '../../utils/storage'
import { useShake } from '../../utils/shake'

const MAX_ATTEMPTS = 3
const deities = listDeities()

const step = ref('choose')
const topic = ref('career')
const deityId = ref('')
const recommended = computed(() => recommendDeity(topic.value))
const deityName = computed(() => deities.find((d) => d.id === deityId.value)?.name || '')

const attempt = ref(1)
const shaking = ref(false)
const drawn = ref(0)
const jiao = ref(null)
const jiaoState = ref('idle')
const landKey = ref(0)

const confirmText = computed(() => {
  if (!jiao.value) return ''
  if (jiao.value.kind === 'sheng') return '神明应允，此签即为所求。'
  if (jiao.value.kind === 'li') return '立筊：筊杯立而不倒，神明另有指示，再掷一次即可（不算一次求签）。'
  return jiao.value.kind === 'xiao' ? '笑筊：神明未明示，需重新求签。' : '阴筊：并非此签，需重新求签。'
})
const avatarMood = computed(() => {
  if (jiaoState.value === 'tossing') return 'think'
  if (!jiao.value) return 'idle'
  return { sheng: 'nod', xiao: 'laugh', yin: 'shake', li: 'laugh' }[jiao.value.kind]
})
const avatarBubble = computed(() => {
  if (jiaoState.value === 'tossing') return '……'
  if (!jiao.value) return '掷筊问我'
  return { sheng: '正是此签！', xiao: '再求一次～', yin: '不是这支', li: '咦，立住了！' }[jiao.value.kind]
})

// 推荐的神明今天已问过，就换一位还没问过的
const freshDeity = () => {
  const done = getTodayAsked()
  return done[recommended.value] ? deities.find((d) => !done[d.id])?.id || recommended.value : recommended.value
}

onLoad((q) => {
  if (q.topic && TOPICS.some((t) => t.key === q.topic)) topic.value = q.topic
  deityId.value = q.deity && deities.some((d) => d.id === q.deity) ? q.deity : freshDeity()
})

function pickTopic(key) {
  topic.value = key
  deityId.value = freshDeity()
}

// 一神一天一签：同一位神明今天已正式求过，就不再摇签
const asked = ref(getTodayAsked())
onShow(() => (asked.value = getTodayAsked()))

function startShake() {
  if (!deityId.value) return
  const rec = asked.value[deityId.value]
  if (rec) {
    const name = deityName.value
    uni.showModal({
      title: '今日已问',
      content: rec.no
        ? `今天已向${name}求得第${cnNumber(rec.no)}签。同一位神明一日只求一签，可以重看今天的签，或改问其他神明。`
        : `今天已向${name}求过三次未得圣筊，民间习惯改日再求。可以改问其他神明。`,
      confirmText: rec.no ? '看今天的签' : '知道了',
      cancelText: '改问别人',
      success: (res) => {
        if (res.confirm && rec.no) uni.navigateTo({ url: `/pages/result/result?deity=${deityId.value}&no=${rec.no}&topic=${rec.topic || ''}` })
      },
    })
    return
  }
  step.value = 'shake'
}

function shakeTube() {
  if (step.value !== 'shake' || shaking.value || drawn.value) return
  shaking.value = true
  play('rattle')
  const again = setTimeout(() => play('rattle'), 900)
  setTimeout(() => {
    clearTimeout(again)
    stop('rattle')
    play('stick')
    setTimeout(() => play('chime', { volume: 0.6 }), 650)
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
    setTimeout(() => play('clack'), 340)
    if (jiao.value.kind === 'sheng') setTimeout(() => play('chime', { volume: 0.6 }), 700)
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
  // 三次未得圣筊，选择改日再求：今天不再向这位神明求签
  if (attempt.value >= MAX_ATTEMPTS) {
    markAsked(deityId.value, { no: 0, topic: topic.value })
    asked.value = getTodayAsked()
  }
  attempt.value = 1
  drawn.value = 0
  jiao.value = null
  jiaoState.value = 'idle'
  step.value = 'choose'
}

function openResult() {
  const item = { deityId: deityId.value, no: drawn.value, topic: topic.value, confirmed: jiao.value?.kind === 'sheng' }
  addHistory(item)
  markAsked(item.deityId, { no: item.no, topic: item.topic })
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
  border: 2rpx solid $sb-line;
  background: $sb-surface;
  font-size: 28rpx;
  transition: transform 0.2s;
}
.chip.on {
  background: $sb-red;
  border-color: $sb-red;
  color: #1a1410;
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
  background: $sb-surface;
  border: 3rpx solid $sb-line;
  border-radius: 24rpx;
  transition: transform 0.2s;
}
.god-card.on {
  border-color: $sb-red;
  background: rgba(212, 175, 110, 0.1);
  transform: translateY(-6rpx);
  box-shadow: 0 10rpx 24rpx rgba(212, 175, 110, 0.18);
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
  color: #1a1410;
  background: $sb-gold;
  padding: 2rpx 14rpx;
  border-radius: 8rpx;
  animation: tagbeat 1.2s ease-in-out infinite;
}
.tag.done {
  background: #4a4440;
  color: #e8dcc6;
  animation: none;
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
.tube.done {
  opacity: 0.3;
  transform: translateY(30rpx) scale(0.9);
  transition: all 0.6s ease 0.4s;
}
.tube.shaking {
  animation: tubeshake 0.22s ease-in-out infinite alternate;
}
/* 摇动时签筒带残影和暖光 */
.tube.shaking .tube-img {
  filter: drop-shadow(0 0 30rpx rgba(255, 190, 110, 0.45)) drop-shadow(-14rpx 0 6rpx rgba(212, 175, 110, 0.25)) drop-shadow(14rpx 0 6rpx rgba(212, 175, 110, 0.25));
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
  background: linear-gradient(#d9bd86, #8f6a3a);
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
  background: $sb-vermilion;
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
  width: 22rpx;
  height: 180rpx;
  margin-left: -11rpx;
  border-radius: 8rpx;
  background: linear-gradient(#fff4d6, #c9a466);
  box-shadow: 0 0 24rpx 6rpx rgba(255, 220, 150, 0.7), 0 60rpx 40rpx -10rpx rgba(255, 220, 150, 0.35);
  animation: stickout 0.8s cubic-bezier(0.3, 0.6, 0.4, 1) both;
}
@keyframes stickout {
  0% { transform: translateY(120rpx) rotate(0); opacity: 1; }
  60% { transform: translateY(-160rpx) rotate(540deg); opacity: 1; }
  100% { transform: translateY(-180rpx) rotate(720deg) scale(0.2); opacity: 0; }
}
/* 签牌：从签支变成卡片，翻转亮出签号 */
.qian-card {
  position: absolute;
  z-index: 5;
  left: 50%;
  top: 0;
  width: 170rpx;
  height: 300rpx;
  margin-left: -85rpx;
  perspective: 800rpx;
}
.qian-card-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10rpx;
  background: linear-gradient(180deg, #f3e8cf, #dcc79c);
  border: 2rpx solid $sb-gold;
  box-shadow: 0 0 0 6rpx rgba(20, 16, 12, 0.9), 0 0 0 8rpx rgba(212, 175, 110, 0.6), 0 20rpx 50rpx rgba(0, 0, 0, 0.6), 0 0 60rpx rgba(240, 217, 166, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 22rpx;
  animation: cardflip 0.9s cubic-bezier(0.2, 1.3, 0.4, 1) 0.65s both;
}
.qian-card-inner {
  position: relative;
  overflow: hidden;
}
/* 签牌亮相后一道金光扫过 */
.qian-card-inner::after {
  content: '';
  position: absolute;
  top: -20%;
  bottom: -20%;
  left: -80%;
  width: 50%;
  background: linear-gradient(100deg, transparent, rgba(255, 252, 240, 0.85), transparent);
  transform: skewX(-18deg);
  animation: card-gleam 1s ease-in-out 1.5s both;
}
@keyframes card-gleam {
  from { left: -80%; }
  to { left: 140%; }
}
/* 签牌背后的光环 */
.qian-card::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 520rpx;
  height: 520rpx;
  margin: -260rpx 0 0 -260rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 225, 160, 0.45), rgba(255, 200, 120, 0.12) 40%, transparent 68%);
  animation: halo 1.2s ease-out 0.6s both, halo-breathe 3s ease-in-out 1.8s infinite;
}
@keyframes halo {
  from { transform: scale(0.2); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes halo-breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.75; }
}
@keyframes cardflip {
  0% { transform: translateY(80rpx) rotateY(90deg) scale(0.3); opacity: 0; }
  60% { transform: translateY(-10rpx) rotateY(-12deg) scale(1.05); opacity: 1; }
  100% { transform: none; opacity: 1; }
}
.qc-deity {
  font-size: 20rpx;
  color: #7a6448;
  letter-spacing: 4rpx;
}
.qc-no {
  writing-mode: vertical-rl;
  margin-top: 14rpx;
  color: #8e2f24;
  font-size: 40rpx;
  font-weight: bold;
  letter-spacing: 8rpx;
}
.qc-seal {
  position: absolute;
  right: 14rpx;
  bottom: 14rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #f6e9d0;
  background: $sb-vermilion;
  border-radius: 6rpx;
  animation: seal 0.4s cubic-bezier(0.2, 1.8, 0.4, 1) 1.4s both;
}
@keyframes seal {
  from { transform: scale(2.5) rotate(-20deg); opacity: 0; }
  to { transform: rotate(-8deg); opacity: 1; }
}
.drawn {
  text-align: center;
  font-size: 32rpx;
  margin-bottom: 28rpx;
  animation: fadeup 0.5s ease-out 1.3s both;
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
.jiao-name.xiao { color: #c9a35c; }
.jiao-name.yin { color: #8c847c; }
.jiao-name.li { color: #e9c77e; }
.glow {
  animation: glow 1.4s ease-in-out infinite;
}
@keyframes glow {
  0%, 100% { box-shadow: 0 6rpx 16rpx rgba(212, 175, 110, 0.3); }
  50% { box-shadow: 0 0 36rpx rgba(255, 190, 60, 0.9); }
}
</style>
