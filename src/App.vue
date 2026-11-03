<script>
export default {}
</script>

<style lang="scss">
page {
  background: $sb-paper;
  color: $sb-ink;
  font-family: 'Songti SC', 'Noto Serif SC', 'STSong', serif;
}
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx 80rpx;
  box-sizing: border-box;
}
.card {
  background: #fffaf0;
  border: 2rpx solid #ead7b0;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(110, 12, 6, 0.06);
}
.btn {
  background: linear-gradient(180deg, #c42a1c, $sb-red);
  color: #fff3d6;
  border-radius: 999rpx;
  text-align: center;
  padding: 26rpx 0;
  font-size: 32rpx;
  letter-spacing: 8rpx;
  box-shadow: 0 6rpx 16rpx rgba(163, 22, 13, 0.3);
}
.btn.ghost {
  background: transparent;
  color: $sb-red;
  border: 2rpx solid $sb-red;
  box-shadow: none;
}
.btn.disabled {
  opacity: 0.5;
}
.muted {
  color: $sb-muted;
  font-size: 24rpx;
}
.section-title {
  font-size: 30rpx;
  color: $sb-red;
  margin-bottom: 20rpx;
  letter-spacing: 4rpx;
}
.disclaimer {
  text-align: center;
  color: $sb-muted;
  font-size: 22rpx;
  margin-top: 40rpx;
}
.level {
  display: inline-block;
  padding: 4rpx 20rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #fff;
}
.level-上上, .level-上 { background: $sb-red; }
.level-中 { background: $sb-gold; }
.level-下, .level-下下 { background: #6b6b6b; }
</style>
