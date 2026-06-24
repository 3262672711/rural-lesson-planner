<template>
  <view class="process-step">
    <view class="step-header">
      <view class="step-number" :class="{ 'active': active }">
        {{ step }}
      </view>
      <text class="step-title">{{ title }}</text>
      <text class="step-time">{{ time }}分钟</text>
    </view>
    <view class="step-content" v-if="content">
      <text class="content-text">{{ content }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: ''
    },
    time: {
      type: Number,
      default: 10
    },
    content: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.process-step {
  margin-bottom: 30rpx;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.step-number {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #E4E7ED;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 15rpx;
  flex-shrink: 0;
}

.step-number.active {
  background-color: #FF8C42;
  color: #ffffff;
}

.step-title {
  font-size: 18px;
  color: $title-color;
  font-weight: bold;
  flex: 1;
}

.step-time {
  font-size: 14px;
  color: #666666;
  background-color: #F5F6FA;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.step-content {
  margin-left: 55rpx;
}

.content-text {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  white-space: pre-wrap;
}
</style>