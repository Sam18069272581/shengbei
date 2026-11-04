<template>
  <view class="page">
    <view class="nav">
      <view class="nav-btn" @click="shift(-1)">‹ 前一天</view>
      <view class="nav-today" :class="{ off: isToday }" @click="backToday">回今天</view>
      <view class="nav-btn" @click="shift(1)">后一天 ›</view>
    </view>

    <!-- 撕页日历：换日时旧页向上翻走、新页落下 -->
    <view class="sheet" :key="key" :class="dir > 0 ? 'from-next' : dir < 0 ? 'from-prev' : 'first'">
      <view class="sheet-top">
        <text>{{ h.solar.y }} 年 {{ h.solar.m }} 月</text>
        <text>星期{{ h.solar.week }}</text>
      </view>
      <view class="big-day">{{ h.solar.d }}</view>
      <view class="lunar">农历{{ h.lunar.text }}</view>
      <view class="gz">{{ h.ganzhi.year }}年【{{ h.shengxiao }}年】 {{ h.ganzhi.month }}月 {{ h.ganzhi.day }}日</view>

      <view class="tags">
        <text class="tag" :class="h.tianshen.type === '黄道' ? 'good' : 'bad'">{{ h.tianshen.type }} · {{ h.tianshen.name }}</text>
        <text class="tag">{{ h.zhixing }}</text>
        <text v-if="h.jieqi.today" class="tag good">今日{{ h.jieqi.name }}</text>
        <text v-for="x in h.festivals" :key="x" class="tag good">{{ x }}</text>
        <text v-if="h.shuowang" class="tag">{{ h.shuowang }}</text>
      </view>

      <view class="yiji">
        <view class="yj">
          <view class="yj-mark yi">宜</view>
          <view class="yj-list">
            <text v-for="(x, i) in h.yi" :key="x" class="yj-item" :style="{ animationDelay: 0.35 + i * 0.04 + 's' }">{{ x }}</text>
          </view>
        </view>
        <view class="yj">
          <view class="yj-mark ji">忌</view>
          <view class="yj-list">
            <text v-for="(x, i) in h.ji" :key="x" class="yj-item" :style="{ animationDelay: 0.45 + i * 0.04 + 's' }">{{ x }}</text>
          </view>
        </view>
      </view>

      <view class="grid">
        <view class="cell"><text class="k">冲煞</text><text>{{ h.chong }} {{ h.sha }}</text></view>
        <view class="cell"><text class="k">纳音</text><text>{{ h.nayin }}</text></view>
        <view class="cell"><text class="k">星宿</text><text>{{ h.xiu }} · {{ h.xiuLuck }}</text></view>
        <view class="cell"><text class="k">节气</text><text>{{ h.jieqi.today ? '今日' + h.jieqi.name : h.jieqi.days + ' 天后' + h.jieqi.name }}</text></view>
        <view class="cell"><text class="k">喜神</text><text>{{ h.position.xi }}</text></view>
        <view class="cell"><text class="k">财神</text><text>{{ h.position.cai }}</text></view>
        <view class="cell"><text class="k">福神</text><text>{{ h.position.fu }}</text></view>
        <view class="cell"><text class="k">值神</text><text>{{ h.tianshen.name }}（{{ h.tianshen.luck }}）</text></view>
      </view>

      <view class="row">
        <text class="k">吉神宜趋</text>
        <text class="v">{{ h.jishen.join(' ') || '无' }}</text>
      </view>
      <view class="row">
        <text class="k">凶煞宜忌</text>
        <text class="v">{{ h.xiongsha.join(' ') || '无' }}</text>
      </view>
      <view class="row">
        <text class="k">彭祖百忌</text>
        <text class="v">{{ h.pengzu.join('　') }}</text>
      </view>

      <view class="hours-title">时辰吉凶</view>
      <view class="hours">
        <view v-for="t in h.hours" :key="t.zhi" class="hour" :class="t.luck === '吉' ? 'good' : 'bad'">
          <text class="hz">{{ t.zhi }}</text>
          <text class="hl">{{ t.luck }}</text>
        </view>
      </view>
    </view>

    <view class="btn" @click="goQian">择此日 · 去求一签</view>
    <view class="disclaimer">黄历内容依传统历法推算，仅供民俗文化参考</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { huangli } from '../../utils/huangli'
import { today } from '../../utils/storage'

const date = ref(new Date())
const dir = ref(0)
const key = ref(0)
const h = computed(() => huangli(date.value))
const isToday = computed(() => today(date.value) === today())

onLoad((q) => {
  if (q && q.date) date.value = new Date(q.date.replace(/-/g, '/'))
})

const shift = (n) => {
  const d = new Date(date.value)
  d.setDate(d.getDate() + n)
  dir.value = n
  date.value = d
  key.value++
}
const backToday = () => {
  if (isToday.value) return
  dir.value = date.value < new Date() ? 1 : -1
  date.value = new Date()
  key.value++
}
const goQian = () => uni.navigateTo({ url: '/pages/qiuqian/qiuqian' })
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 26rpx;
}
.nav-btn {
  color: $sb-gold;
  padding: 12rpx 8rpx;
}
.nav-today {
  color: $sb-gold-light;
  border: 1rpx solid $sb-line;
  border-radius: 40rpx;
  padding: 8rpx 28rpx;
}
.nav-today.off {
  opacity: 0.35;
}

/* 宣纸日历页 */
.sheet {
  position: relative;
  background: linear-gradient(180deg, #f3e8cf, #e9dbbb);
  color: $sb-paper-ink;
  border-radius: 10rpx;
  padding: 30rpx 32rpx 36rpx;
  margin-bottom: 36rpx;
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.5), 0 0 0 2rpx rgba(212, 175, 110, 0.5) inset;
  transform-origin: 50% 0;
}
/* 顶部装订孔 */
.sheet::before {
  content: '';
  position: absolute;
  left: 50%;
  top: -14rpx;
  width: 220rpx;
  height: 28rpx;
  margin-left: -110rpx;
  border-radius: 14rpx;
  background: linear-gradient(180deg, #b98f4e, #7a5a2c);
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.4);
}
.first { animation: drop 0.7s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
.from-next { animation: flipin 0.6s cubic-bezier(0.25, 1.2, 0.4, 1) both; }
.from-prev { animation: flipback 0.6s cubic-bezier(0.25, 1.2, 0.4, 1) both; }
@keyframes drop {
  from { transform: translateY(-60rpx) rotateX(30deg); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@keyframes flipin {
  0% { transform: perspective(1200rpx) rotateX(-75deg); opacity: 0.2; }
  70% { transform: perspective(1200rpx) rotateX(6deg); opacity: 1; }
  100% { transform: none; }
}
@keyframes flipback {
  0% { transform: translateX(-60rpx) rotate(-4deg); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

.sheet-top {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #8a6a3a;
  letter-spacing: 2rpx;
}
.big-day {
  text-align: center;
  font-size: 150rpx;
  line-height: 1.1;
  color: $sb-vermilion;
  font-weight: 600;
  margin-top: 6rpx;
  animation: stamp 0.5s cubic-bezier(0.2, 1.8, 0.4, 1) 0.15s both;
}
@keyframes stamp {
  from { transform: scale(1.8); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.lunar {
  text-align: center;
  font-size: 36rpx;
  letter-spacing: 6rpx;
}
.gz {
  text-align: center;
  font-size: 24rpx;
  color: #7a6448;
  margin: 8rpx 0 18rpx;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
  border: 1rpx solid #b39a74;
  color: #5c4a34;
}
.tag.good {
  border-color: $sb-vermilion;
  color: $sb-vermilion;
}
.tag.bad {
  border-color: #6b6258;
  color: #6b6258;
}

.yiji {
  border-top: 2rpx solid rgba(122, 90, 44, 0.3);
  border-bottom: 2rpx solid rgba(122, 90, 44, 0.3);
  padding: 18rpx 0;
}
.yj {
  display: flex;
  align-items: flex-start;
  padding: 10rpx 0;
}
.yj-mark {
  flex: none;
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 50%;
  text-align: center;
  font-size: 34rpx;
  color: #f6e9d0;
  margin-right: 20rpx;
}
.yj-mark.yi { background: $sb-vermilion; }
.yj-mark.ji { background: #4a4440; }
.yj-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx 22rpx;
  padding-top: 8rpx;
}
.yj-item {
  font-size: 28rpx;
  animation: ink 0.4s ease-out both;
}
@keyframes ink {
  from { opacity: 0; filter: blur(4rpx); transform: translateY(8rpx); }
  to { opacity: 1; filter: blur(0); transform: none; }
}

.grid {
  display: flex;
  flex-wrap: wrap;
  margin: 18rpx 0 8rpx;
}
.cell {
  width: 50%;
  font-size: 24rpx;
  padding: 8rpx 0;
  box-sizing: border-box;
}
.k {
  color: #9a7a4a;
  margin-right: 12rpx;
}
.row {
  display: flex;
  font-size: 24rpx;
  padding: 8rpx 0;
  line-height: 1.6;
}
.row .k {
  flex: none;
}
.row .v {
  flex: 1;
}
.hours-title {
  font-size: 24rpx;
  color: #9a7a4a;
  margin: 14rpx 0 10rpx;
}
.hours {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}
.hour {
  width: calc((100% - 40rpx) / 6);
  text-align: center;
  padding: 8rpx 0;
  border-radius: 6rpx;
  font-size: 24rpx;
}
.hour.good {
  background: rgba(196, 71, 58, 0.12);
  color: $sb-vermilion;
}
.hour.bad {
  background: rgba(74, 68, 64, 0.08);
  color: #7a726c;
}
.hz {
  margin-right: 6rpx;
}
</style>
