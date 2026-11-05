<template>
  <!-- 空状态：签文数据没生成（开发时忘了 npm run build:data）时，神明列表为空 -->
  <view class="no-data muted">签文数据尚未生成，请先运行 npm run build:data</view>
</template>

<style scoped>
.no-data {
  text-align: center;
  padding: 40rpx 0;
}
</style>
