<template>
  <view class="page">
    <TempleScene :blessed="justLit" :bless-key="litKey" />
    <view class="page-body">
      <view class="gods">
        <view v-for="d in deities" :key="d.id" class="god-chip" :class="{ on: deityId === d.id }" @click="pick(d.id)">
          <image class="god-chip-img" :src="art(d.id)" mode="widthFix" />
          <text>{{ d.name }}</text>
        </view>
      </view>

      <!-- 供桌：神明、香炉、三炷香 -->
      <view class="altar">
        <view class="halo" :class="{ on: burning }" />
        <DeityAvatar :id="deityId" :size="230" :mood="justLit ? 'nod' : 'idle'" :mood-key="litKey" :bubble="bubble" />
        <view class="censer-wrap">
          <view class="sticks" v-if="burning || burnt" :key="litKey">
            <view
              v-for="i in 3"
              :key="i"
              class="stick-slot"
              :class="'k' + i"
            >
              <view
                class="stick"
                :class="{ burning, burnt }"
                :style="burning ? { animationDuration: BURN_MS + 'ms', animationDelay: -elapsed + 'ms' } : {}"
              >
                <view v-if="burning" class="ember" />
                <image v-if="burning" class="stick-smoke" :class="'d' + i" :src="art('smoke')" mode="widthFix" />
              </view>
              <view class="handle" />
            </view>
          </view>
          <image class="censer" :src="art('censer')" mode="widthFix" />
          <view v-if="justLit" :key="'f' + litKey" class="flash" />
        </view>
      </view>

      <view class="status">
        <view v-if="burning" class="status-main foil">香火正旺</view>
        <view v-else-if="burnt" class="status-main">香已燃尽，功德圆满</view>
        <view v-else class="status-main">敬香三炷，心诚则灵</view>
        <view class="muted" v-if="burning">还剩约 {{ minutesLeft }} 分钟燃尽</view>
      </view>

      <block v-if="!burning">
        <input v-model="wish" class="input" placeholder="写下心愿（可不填，只存本机）" maxlength="40" />
        <view class="btn" @click="light">{{ burnt ? '再敬三炷香' : '敬 香 三 炷' }}</view>
      </block>
      <view v-else-if="lastWish" class="wish-now">「{{ lastWish }}」</view>

      <view class="card stats">
        <view class="section-title">香火簿</view>
        <view class="stat-row">
          <view class="stat">
            <view class="stat-num">{{ streak }}</view>
            <view class="muted">连续天数</view>
          </view>
          <view class="stat">
            <view class="stat-num">{{ state.days.length }}</view>
            <view class="muted">累计天数</view>
          </view>
        </view>
        <view class="week">
          <view v-for="d in week" :key="d.date" class="day" :class="{ on: d.on, today: d.today }">
            <view class="dot">{{ d.on ? '香' : '' }}</view>
            <text class="muted">{{ d.label }}</text>
          </view>
        </view>
      </view>

      <view class="card" v-if="state.wishes.length">
        <view class="section-title">我的心愿</view>
        <view v-for="w in state.wishes.slice(0, 10)" :key="w.at" class="wish-row">
          <text class="wish-text">{{ w.wish }}</text>
          <text class="muted">{{ deityName(w.deityId) }} · {{ dateOf(w.at) }}</text>
        </view>
      </view>

      <view class="disclaimer">仅供娱乐与传统文化体验，记录只保存在本机</view>
    </view>
  </view>
</template>

<script setup>
import TempleScene from '../../components/TempleScene.vue'
import DeityAvatar from '../../components/DeityAvatar.vue'
import { ref, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { art } from '../../utils/art'
import { play } from '../../utils/sound'
import { listDeities } from '../../utils/qian'
import { getIncense, lightIncense, incenseStreak, BURN_MS, today } from '../../utils/storage'

const deities = listDeities()
const state = ref(getIncense())
const deityId = ref(state.value.last?.deityId || deities[0]?.id || 'mazu')
const wish = ref('')
const now = ref(Date.now())
const litKey = ref(0)
const justLit = ref(false)

onLoad((q) => {
  if (q.deity && deities.some((d) => d.id === q.deity)) deityId.value = q.deity
})

// 每 15 秒刷新一次剩余时间，燃尽时自动切换状态
let timer = null
onShow(() => {
  state.value = getIncense()
  now.value = Date.now()
  clearInterval(timer)
  timer = setInterval(() => (now.value = Date.now()), 15000)
})
onHide(() => clearInterval(timer))

const last = computed(() => state.value.last)
const elapsed = computed(() => (last.value ? now.value - last.value.at : Infinity))
const burning = computed(() => elapsed.value < BURN_MS)
// 今天上过、已燃尽
const burnt = computed(() => !burning.value && !!last.value && today(new Date(last.value.at)) === today())
const minutesLeft = computed(() => Math.max(1, Math.ceil((BURN_MS - elapsed.value) / 60000)))
const lastWish = computed(() => (burning.value ? last.value?.wish : ''))
const streak = computed(() => incenseStreak(state.value.days))

const BUBBLE = { mazu: '出入平安～', wenchang: '学业精进！', guandi: '事业亨通！', yuelao: '良缘早至～' }
const bubble = computed(() => {
  if (justLit.value) return '心愿已收到'
  if (burning.value) return BUBBLE[deityId.value] || '有求必应'
  return '敬香请愿'
})

const WEEK = '日一二三四五六'
const week = computed(() => {
  const days = new Set(state.value.days)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const date = today(d)
    return { date, on: days.has(date), today: i === 6, label: i === 6 ? '今' : WEEK[d.getDay()] }
  })
})

const deityName = (id) => deities.find((d) => d.id === id)?.name || ''
const dateOf = (at) => today(new Date(at)).slice(5)

function pick(id) {
  if (burning.value) return uni.showToast({ title: '香火未尽，稍后再换', icon: 'none' })
  deityId.value = id
}

function light() {
  state.value = lightIncense({ deityId: deityId.value, wish: wish.value.trim() })
  wish.value = ''
  now.value = Date.now()
  litKey.value++
  justLit.value = true
  uni.vibrateShort?.({ fail: () => {} })
  play('chime', { volume: 0.6 })
  setTimeout(() => play('bell', { volume: 0.7 }), 900)
  setTimeout(() => (justLit.value = false), 2600)
}
</script>

<style lang="scss" scoped>
.gods {
  display: flex;
  gap: 12rpx;
}
.god-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0 8rpx;
  border-radius: 16rpx;
  border: 2rpx solid $sb-line;
  background: $sb-surface;
  font-size: 22rpx;
}
.god-chip.on {
  border-color: $sb-gold;
  background: rgba(212, 175, 110, 0.1);
}
.god-chip-img {
  width: 70rpx;
}

.altar {
  position: relative;
  padding-top: 60rpx;
  text-align: center;
}
.halo {
  position: absolute;
  left: 50%;
  top: 40rpx;
  width: 520rpx;
  height: 520rpx;
  margin-left: -260rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 120, 0.28), transparent 65%);
  opacity: 0;
  transition: opacity 1.5s ease;
}
.halo.on {
  opacity: 1;
  animation: halo 4s ease-in-out infinite;
}
@keyframes halo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.censer-wrap {
  position: relative;
  width: 440rpx;
  margin: 10rpx auto 0;
  padding-top: 240rpx;
}
.censer {
  position: relative;
  z-index: 2;
  display: block;
  width: 440rpx;
  filter: drop-shadow(0 20rpx 30rpx rgba(0, 0, 0, 0.6));
}
.sticks {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 340rpx;
  z-index: 1;
}
.stick-slot {
  position: absolute;
  bottom: 0;
  width: 10rpx;
  height: 300rpx;
  animation: insert 0.7s cubic-bezier(0.2, 1.2, 0.4, 1) both;
}
.k1 { left: 172rpx; transform: rotate(-6deg); animation-delay: 0s; }
.k2 { left: 215rpx; height: 316rpx; animation-delay: 0.15s; }
.k3 { left: 258rpx; transform: rotate(6deg); animation-delay: 0.3s; }
.k1, .k3 { transform-origin: 50% 100%; }
@keyframes insert {
  from { opacity: 0; translate: 0 -80rpx; }
  to { opacity: 1; translate: 0 0; }
}
/* 香身：底部红色香脚，上面是可燃的褐色香柱 */
.handle {
  position: absolute;
  left: 2rpx;
  bottom: 0;
  width: 6rpx;
  height: 70rpx;
  background: #b0302a;
}
.stick {
  position: absolute;
  left: 0;
  bottom: 70rpx;
  width: 10rpx;
  height: calc(100% - 70rpx);
  border-radius: 4rpx 4rpx 0 0;
  background: linear-gradient(90deg, #4a2a16, #8a5a32 50%, #4a2a16);
}
.stick.burning {
  animation-name: burn;
  animation-timing-function: linear;
  animation-fill-mode: both;
}
.stick.burnt {
  height: 14rpx;
  background: #6a6058;
}
@keyframes burn {
  from { height: calc(100% - 70rpx); }
  to { height: 14rpx; }
}
/* 香头火星 */
.ember {
  position: absolute;
  left: -3rpx;
  top: -6rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: radial-gradient(circle, #fff3c4, #ff8a3a 45%, #c4301a 70%, transparent 72%);
  box-shadow: 0 0 18rpx 6rpx rgba(255, 120, 50, 0.6);
  animation: ember 1.4s ease-in-out infinite;
}
@keyframes ember {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(0.85); }
}
.stick-smoke {
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 130rpx;
  margin-left: -65rpx;
  opacity: 0;
  filter: blur(3rpx);
  transform-origin: 50% 100%;
  animation: rise 5s ease-out infinite;
}
.d2 { animation-delay: -1.6s; }
.d3 { animation-delay: -3.2s; }
@keyframes rise {
  0% { transform: translateY(20rpx) scale(0.5, 0.6); opacity: 0; }
  20% { opacity: 0.85; }
  100% { transform: translateY(-240rpx) scale(1.6, 1.8) skewX(-10deg); opacity: 0; }
}
.flash {
  position: absolute;
  left: 50%;
  top: 40rpx;
  width: 300rpx;
  height: 300rpx;
  margin-left: -150rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 220, 150, 0.7), transparent 60%);
  animation: flash 1.2s ease-out both;
  z-index: 3;
  pointer-events: none;
}
@keyframes flash {
  from { transform: scale(0.2); opacity: 1; }
  to { transform: scale(1.6); opacity: 0; }
}

.status {
  text-align: center;
  margin: 28rpx 0 12rpx;
}
.status-main {
  font-size: 40rpx;
  letter-spacing: 8rpx;
  color: $sb-gold-light;
  margin-bottom: 6rpx;
}
.input {
  margin: 16rpx 0 28rpx;
  border-bottom: 2rpx solid $sb-line;
  padding: 12rpx 0;
  font-size: 28rpx;
  text-align: center;
}
.wish-now {
  text-align: center;
  color: $sb-gold;
  font-size: 30rpx;
  margin: 8rpx 0 20rpx;
}
.stats {
  margin-top: 36rpx;
}
.stat-row {
  display: flex;
  text-align: center;
  margin-bottom: 20rpx;
}
.stat {
  flex: 1;
}
.stat-num {
  font-size: 48rpx;
  color: $sb-gold-light;
}
.week {
  display: flex;
  justify-content: space-between;
}
.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}
.dot {
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 50%;
  border: 1rpx dashed $sb-line;
  font-size: 24rpx;
}
.day.on .dot {
  border: none;
  background: radial-gradient(circle at 40% 35%, #e0503a, #8e1a12);
  color: #f6e2b0;
  box-shadow: 0 0 16rpx rgba(224, 80, 58, 0.5);
}
.day.today .muted {
  color: $sb-gold;
}
.wish-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx dashed $sb-line;
}
.wish-text {
  flex: 1;
  font-size: 28rpx;
}
</style>
