<template>
  <view class="index-container">
    <view class="header">
      <text class="title">农村教育教案生成工具</text>
      <text class="subtitle">轻松生成优质教案，提升教学效率</text>
    </view>
    <view class="content">
      <u-button type="primary" size="large" @click="goToGenerate" style="margin: 20rpx 0;">
        开始生成教案
      </u-button>
      <view class="feature-list">
        <view class="feature-item">
          <u-icon name="book" size="48" color="#FF8C42"></u-icon>
          <text class="feature-text">智能生成</text>
        </view>
        <view class="feature-item">
          <u-icon name="checkmark-circle" size="48" color="#FF8C42"></u-icon>
          <text class="feature-text">质量保证</text>
        </view>
        <view class="feature-item">
          <u-icon name="clock" size="48" color="#FF8C42"></u-icon>
          <text class="feature-text">高效便捷</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goToGenerate() {
      uni.navigateTo({
        url: '/pages/generate/generate'
      })
    }
  }
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: $title-size-1;
  color: $title-color;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 60rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.feature-text {
  margin-top: 20rpx;
  font-size: $text-size;
  color: $text-color;
}
</style>