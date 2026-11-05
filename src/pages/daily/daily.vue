<template>
  <view class="page">
    <TempleScene />
    <view class="page-body">
      <view class="card head">
        <view class="muted">{{ f.date }} · 农历{{ f.hl.lunar.text }} · {{ f.hl.ganzhi.day }}日</view>
        <view class="saying">
          <view v-if="f.saying.occasion" class="saying-tag">{{ f.saying.occasion }}</view>
          <view v-for="(l, i) in sayingLines" :key="i" class="saying-text">{{ l }}</view>
          <view class="saying-from">—— {{ f.saying.from }}</view>
        </view>
        <view class="overall">
          今日综合
          <text v-for="i in 5" :key="i" class="star" :class="{ on: i <= f.overall }" :style="{ animationDelay: 0.2 + i * 0.15 + 's' }">★</text>
        </view>
        <view class="lucky muted">幸运色 {{ f.color }} · 幸运数字 {{ f.number }}</view>
      </view>

      <!-- 生肖提醒：没填生日时引导填写 -->
      <view class="card zodiac" v-if="f.zodiac">
        <view class="zd-head">
          <text class="section-title">生肖提醒</text>
          <picker mode="date" :value="birthday" start="1920-01-01" :end="f.date" @change="onBirthday">
            <text class="muted">属{{ f.zodiac.animal }} · 修改生日 ›</text>
          </picker>
        </view>
        <view class="zd-line">
          <text class="zd-tag" :class="{ bad: !f.zodiac.good }">{{ f.zodiac.tag }}</text>
          <text class="zd-text">{{ f.zodiac.dayAnimal }}日：{{ f.zodiac.text }}</text>
        </view>
        <view v-if="f.zodiac.taisui" class="muted zd-taisui">{{ f.zodiac.taisui }}</view>
      </view>
      <picker v-else mode="date" value="1995-01-01" start="1920-01-01" :end="f.date" @change="onBirthday">
        <view class="card zodiac-empty">
          <view class="section-title">生肖提醒</view>
          <view class="muted">填一次生日，每天告诉你今日是冲是合 ›</view>
        </view>
      </picker>

      <view class="card">
        <view class="section-title">分项运势</view>
        <view v-for="(a, idx) in f.aspects" :key="a.key" class="aspect">
          <text class="aspect-name">{{ a.name }}</text>
          <view class="bar"><view class="bar-fill" :style="{ width: a.stars * 20 + '%', animationDelay: 0.3 + idx * 0.15 + 's' }" /></view>
          <text class="aspect-stars">{{ '★'.repeat(a.stars) }}</text>
        </view>
      </view>

      <view class="card hl" @click="openHuangli">
        <view class="hl-head">
          <text class="section-title">今日黄历</text>
          <text class="hl-type" :class="f.hl.tianshen.type === '黄道' ? 'good' : ''">{{ f.hl.tianshen.type }}日 · {{ f.hl.zhixing }}</text>
        </view>
        <view v-if="f.hl.festivals.length || f.hl.jieqi.today" class="hl-fest">
          {{ [f.hl.jieqi.today ? '今日' + f.hl.jieqi.name : '', ...f.hl.festivals].filter(Boolean).join(' · ') }}
        </view>
        <view class="hl-line"><text class="hl-mark yi">宜</text><text class="hl-items">{{ f.hl.yi.slice(0, 8).join(' ') }}</text></view>
        <view class="hl-line"><text class="hl-mark ji">忌</text><text class="hl-items">{{ f.hl.ji.slice(0, 8).join(' ') }}</text></view>
        <view class="muted hl-foot">{{ f.hl.chong }} {{ f.hl.sha }} · 财神{{ f.hl.position.cai }}</view>
        <view class="muted">查看完整黄历 ›</view>
      </view>

      <view class="section-title">我的今日小贴士</view>
      <view class="card yiji">
        <view class="col">
          <view class="yi-title">宜</view>
          <view v-for="x in f.yi" :key="x" class="item">{{ x }}</view>
        </view>
        <view class="col">
          <view class="ji-title">忌</view>
          <view v-for="x in f.ji" :key="x" class="item">{{ x }}</view>
        </view>
      </view>

      <view class="card qian-card" v-if="f.qian" @click="openQian">
        <view class="qian-god"><DeityAvatar :id="f.qian.deityId" :size="140" /></view>
        <view class="section-title">今日一签</view>
        <view class="muted qian-from">{{ f.qian.deityName }} · 第{{ cnNumber(f.qian.no) }}签</view>
        <view class="poem">
          <text>{{ poemText }}</text>
        </view>
        <view class="muted">点击查看解签 ›</view>
      </view>

      <view class="disclaimer">每日运势按日期生成，同一天结果不变，仅供娱乐</view>
    </view>
  </view>
</template>

<script setup>
import TempleScene from '../../components/TempleScene.vue'
import { reactive, ref } from 'vue'
import { dailyFortune } from '../../utils/daily'
import { getProfile, setProfile } from '../../utils/storage'
import { cnNumber, stripEndPunct } from '../../utils/qian'
import DeityAvatar from '../../components/DeityAvatar.vue'

const f = reactive(dailyFortune())
const birthday = ref(getProfile()?.birthday || '1995-01-01')
// 改了生日：保存后重算当日运势（综合分会随冲合变化）
function onBirthday(e) {
  birthday.value = e.detail.value
  setProfile({ ...(getProfile() || {}), birthday: e.detail.value })
  Object.assign(f, dailyFortune())
}
// 有的签诗自带标点，有的没有：没有标点的句子补上逗号/句号
const poemText = f.qian
  ? f.qian.poem.map((l, i) => (stripEndPunct(l) !== l ? l : l + (i < f.qian.poem.length - 1 ? '，' : '。'))).join('')
  : ''
// 签语按逗号分行，避免长句折行时只剩一个字
const sayingLines = f.saying.text.replace(/？/g, '？，').split('，').filter(Boolean)
const openHuangli = () => uni.navigateTo({ url: '/pages/huangli/huangli' })
const openQian = () => uni.navigateTo({ url: `/pages/result/result?deity=${f.qian.deityId}&no=${f.qian.no}` })
</script>

<style lang="scss" scoped>
.zd-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.zd-line {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}
.zd-tag {
  flex: none;
  padding: 4rpx 16rpx;
  border-radius: 6rpx;
  background: $sb-vermilion;
  color: #f6e9d0;
  font-size: 26rpx;
  letter-spacing: 2rpx;
}
.zd-tag.bad {
  background: #4a4440;
}
.zd-text {
  font-size: 28rpx;
  line-height: 1.7;
}
.zd-taisui {
  margin-top: 14rpx;
}
.zodiac-empty {
  border-style: dashed;
}
.head {
  text-align: center;
}
/* 每日签语：竖排感的大字 + 出处 */
.saying {
  margin: 28rpx 0 20rpx;
  padding: 28rpx 12rpx 24rpx;
  border-top: 1rpx solid $sb-line;
  border-bottom: 1rpx solid $sb-line;
  animation: saying-in 1.2s ease-out both;
}
.saying-tag {
  display: inline-block;
  padding: 2rpx 18rpx;
  margin-bottom: 14rpx;
  border: 1rpx solid $sb-vermilion;
  color: $sb-vermilion;
  font-size: 22rpx;
  letter-spacing: 4rpx;
}
.saying-text {
  font-size: 36rpx;
  line-height: 1.7;
  letter-spacing: 4rpx;
  color: $sb-gold-light;
}
.saying-from {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: $sb-muted;
}
@keyframes saying-in {
  from { opacity: 0; filter: blur(6rpx); letter-spacing: 14rpx; }
  to { opacity: 1; filter: blur(0); }
}
.overall {
  font-size: 36rpx;
  margin: 12rpx 0;
}
.star {
  display: inline-block;
  color: rgba(212, 175, 110, 0.22);
  font-size: 44rpx;
  margin-left: 6rpx;
  animation: starpop 0.5s cubic-bezier(0.2, 1.8, 0.4, 1) both;
}
.star.on {
  color: $sb-gold;
}
@keyframes starpop {
  from { transform: scale(0) rotate(-90deg); }
  to { transform: scale(1) rotate(0); }
}
.qian-card {
  position: relative;
  padding-top: 20rpx;
}
.qian-from {
  margin: -12rpx 0 16rpx;
}
.qian-god {
  float: right;
  margin: 0 -10rpx 0 10rpx;
}
.aspect {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  font-size: 28rpx;
}
.aspect-name {
  width: 90rpx;
}
.bar {
  flex: 1;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, $sb-gold, $sb-red);
  transform-origin: 0 50%;
  animation: grow 0.8s ease-out both;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.aspect-stars {
  width: 150rpx;
  color: $sb-gold;
}
.yiji {
  display: flex;
}
.hl-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.hl-type {
  font-size: 24rpx;
  color: $sb-muted;
}
.hl-type.good {
  color: $sb-vermilion;
}
.hl-fest {
  color: $sb-gold-light;
  font-size: 26rpx;
  margin: -8rpx 0 14rpx;
}
.hl-line {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  line-height: 1.7;
}
.hl-mark {
  flex: none;
  width: 44rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 26rpx;
  margin-right: 16rpx;
  color: #f6e9d0;
}
.hl-mark.yi { background: $sb-vermilion; }
.hl-mark.ji { background: #4a4440; }
.hl-items {
  flex: 1;
  letter-spacing: 2rpx;
}
.hl-foot {
  margin: 4rpx 0 6rpx;
}
.col {
  flex: 1;
  text-align: center;
}
.yi-title, .ji-title {
  font-size: 44rpx;
  margin-bottom: 12rpx;
}
.yi-title { color: $sb-red; }
.ji-title { color: #8c847c; }
.item {
  font-size: 28rpx;
  line-height: 1.9;
}
.poem {
  font-size: 30rpx;
  line-height: 1.8;
  margin-bottom: 12rpx;
}
</style>
