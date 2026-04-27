<template>
  <view class="lesson-card">
    <view class="card-header">
      <text class="course-name">{{ courseName }}</text>
      <text class="course-duration">{{ duration }}分钟</text>
    </view>
    <view class="card-content">
      <text class="card-brief">{{ brief }}</text>
    </view>
    <view class="card-footer">
      <text class="create-time">{{ createTime }}</text>
      <u-button type="primary" size="small" @click="$emit('click')">
        查看详情
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    courseName: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 45
    },
    brief: {
      type: String,
      default: ''
    },
    createTime: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.lesson-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.course-name {
  font-size: 18px;
  color: $title-color;
  font-weight: bold;
  flex: 1;
}

.course-duration {
  font-size: 14px;
  color: #666666;
  background-color: #F5F6FA;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.card-content {
  margin-bottom: 20rpx;
}

.card-brief {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15rpx;
  border-top: 1rpx solid #E4E7ED;
}

.create-time {
  font-size: 14px;
  color: #999999;
}
</style>