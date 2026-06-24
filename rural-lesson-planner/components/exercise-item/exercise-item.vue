<template>
  <view class="exercise-item">
    <view class="item-header">
      <text class="item-type">{{ type }}</text>
      <text class="item-score">{{ score }}分</text>
    </view>
    <view class="item-content">
      <text class="item-question">{{ question }}</text>
      <view class="item-options" v-if="options && options.length > 0">
        <view class="option-item" v-for="(option, index) in options" :key="index">
          <text class="option-label">{{ String.fromCharCode(65 + index) }}.</text>
          <text class="option-text">{{ option }}</text>
        </view>
      </view>
    </view>
    <view class="item-footer" v-if="answer">
      <text class="answer-label">参考答案：</text>
      <text class="answer-content">{{ answer }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '选择题'
    },
    score: {
      type: Number,
      default: 5
    },
    question: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    answer: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.exercise-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #E4E7ED;
}

.item-type {
  font-size: 16px;
  color: $auxiliary;
  font-weight: bold;
}

.item-score {
  font-size: 14px;
  color: #666666;
  background-color: #F5F6FA;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.item-content {
  margin-bottom: 20rpx;
}

.item-question {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  display: block;
  margin-bottom: 15rpx;
}

.item-options {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 10rpx;
  background-color: #F9F9F9;
  border-radius: 8rpx;
}

.option-label {
  font-size: $text-size;
  color: $auxiliary;
  font-weight: bold;
  margin-right: 10rpx;
  min-width: 30rpx;
}

.option-text {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  flex: 1;
}

.item-footer {
  padding-top: 15rpx;
  border-top: 1rpx solid #E4E7ED;
}

.answer-label {
  font-size: 14px;
  color: #666666;
}

.answer-content {
  font-size: 14px;
  color: $primary;
  font-weight: bold;
}
</style>