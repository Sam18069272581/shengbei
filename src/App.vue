<script>
export default {}
</script>

<style lang="scss">
body,
uni-page-body,
page {
  background-color: $sb-bg;
}
page {
  background: $sb-bg;
  background-image: radial-gradient(ellipse at 50% -10%, rgba(212, 175, 110, 0.14), transparent 60%),
    radial-gradient(ellipse at 100% 100%, rgba(196, 71, 58, 0.08), transparent 50%);
  background-attachment: fixed;
  color: $sb-text;
  font-family: 'Noto Serif SC', 'Songti SC', 'STSong', 'SimSun', serif;
  -webkit-font-smoothing: antialiased;
}
.page {
  position: relative;
  min-height: 100vh;
  padding: 32rpx 36rpx 80rpx;
  box-sizing: border-box;
}
/* 页面内容浮在 TempleScene 场景之上，进场时由虚到实 */
.page-body {
  position: relative;
  z-index: 1;
  animation: page-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes page-in {
  from { opacity: 0; transform: translateY(24rpx); filter: blur(6rpx); }
  to { opacity: 1; transform: none; filter: none; }
}
/* 金箔字：一道高光缓缓扫过 */
.foil {
  background: linear-gradient(100deg, #b98f4e 0%, #f6e3b4 30%, #fffaf0 40%, #f6e3b4 50%, #b98f4e 80%);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: foil 4.5s ease-in-out infinite;
}
@keyframes foil {
  0% { background-position: 100% 0; }
  60%, 100% { background-position: 0 0; }
}
.card {
  position: relative;
  background: linear-gradient(160deg, rgba(255, 236, 200, 0.07), rgba(255, 236, 200, 0.025) 60%);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 20rpx 50rpx rgba(0, 0, 0, 0.35), 0 1rpx 0 rgba(255, 240, 210, 0.08) inset;
  border: 1rpx solid $sb-line;
  border-radius: 8rpx;
  padding: 36rpx 34rpx;
  margin-bottom: 28rpx;
}
/* 卡片四角金色转角 */
.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 18rpx;
  height: 18rpx;
  border-color: $sb-gold;
  border-style: solid;
  opacity: 0.8;
}
.card::before {
  left: -1rpx;
  top: -1rpx;
  border-width: 2rpx 0 0 2rpx;
}
.card::after {
  right: -1rpx;
  bottom: -1rpx;
  border-width: 0 2rpx 2rpx 0;
}
.btn {
  background: linear-gradient(180deg, #e3c48a, #b98f4e);
  color: #1a1410;
  border-radius: 6rpx;
  text-align: center;
  padding: 28rpx 0;
  font-size: 30rpx;
  letter-spacing: 12rpx;
  box-shadow: 0 0 0 1rpx rgba(240, 217, 166, 0.6) inset, 0 12rpx 30rpx rgba(0, 0, 0, 0.4);
}
.btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease;
}
/* 按钮表面一道流光 */
.btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 250, 235, 0.45), transparent);
  transform: skewX(-20deg);
  animation: btn-sheen 5s ease-in-out 1.2s infinite;
}
.btn.ghost::after,
.btn.disabled::after {
  display: none;
}
@keyframes btn-sheen {
  0% { left: -60%; }
  25%, 100% { left: 130%; }
}
.btn:active {
  opacity: 0.85;
  transform: scale(0.97);
}
.btn.ghost {
  background: transparent;
  color: $sb-gold;
  box-shadow: 0 0 0 1rpx $sb-gold inset;
}
.btn.disabled {
  opacity: 0.45;
}
.muted {
  color: $sb-muted;
  font-size: 24rpx;
  line-height: 1.7;
}
.section-title {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: $sb-gold;
  margin-bottom: 24rpx;
  letter-spacing: 8rpx;
}
.section-title::before {
  content: '';
  width: 10rpx;
  height: 10rpx;
  margin-right: 16rpx;
  background: $sb-vermilion;
  transform: rotate(45deg);
}
.disclaimer {
  text-align: center;
  color: rgba(154, 138, 114, 0.7);
  font-size: 22rpx;
  margin-top: 48rpx;
  letter-spacing: 2rpx;
}
.level {
  display: inline-block;
  padding: 6rpx 22rpx;
  border-radius: 4rpx;
  font-size: 26rpx;
  letter-spacing: 4rpx;
  color: #f6e9d0;
  border: 2rpx solid currentColor;
}
.level-上上, .level-上 { background: $sb-vermilion; border-color: #e07a6c; }
.level-中 { background: #8a6a36; border-color: $sb-gold; }
.level-下, .level-下下 { background: #4a4440; border-color: #7a726c; }
</style>
