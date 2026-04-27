<template>
  <view class="result-container">
    <view class="result-card">
      <view class="card-header">
        <text class="course-name">课程名称：小学语文 - 春天的故事</text>
        <text class="course-duration">教学时长：45分钟</text>
      </view>
      <view class="card-content">
        <view class="section">
          <text class="section-title">教学目标</text>
          <text class="section-content">1. 学生能够理解课文内容，感受春天的美好
2. 掌握重点生字词，提高阅读理解能力
3. 培养学生观察自然、热爱生活的情感</text>
        </view>
        <view class="section">
          <text class="section-title">教学准备</text>
          <text class="section-content">PPT课件、春天的图片、生字卡片</text>
        </view>
        <view class="section">
          <text class="section-title">教学过程</text>
          <text class="section-content">1. 导入新课（5分钟）：通过图片展示春天的景象，激发学生兴趣
2. 初读课文（10分钟）：学生自由朗读，整体感知课文内容
3. 精读课文（15分钟）：重点讲解生字词和关键句子
4. 小组讨论（10分钟）：学生分组讨论对春天的感受
5. 总结升华（5分钟）：教师总结，布置作业</text>
        </view>
        <view class="section">
          <text class="section-title">作业布置</text>
          <text class="section-content">1. 背诵课文第二自然段
2. 观察身边的春天景象，写一篇小短文</text>
        </view>
      </view>
      <view class="card-footer">
        <u-button type="primary" size="medium" @click="saveToHistory">
          保存到历史
        </u-button>
        <u-button type="default" size="medium" @click="generateAgain">
          重新生成
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    saveToHistory() {
      uni.showToast({
        title: '已保存到历史记录',
        icon: 'success'
      })
    },
    generateAgain() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding: 40rpx;
}

.result-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #E4E7ED;
}

.course-name {
  font-size: $title-size-2;
  color: $title-color;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.course-duration {
  font-size: $text-size;
  color: #666666;
}

.card-content {
  margin-bottom: 30rpx;
}

.section {
  margin-bottom: 25rpx;
}

.section-title {
  font-size: 18px;
  color: $auxiliary;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.section-content {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  white-space: pre-wrap;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 20rpx;
  border-top: 1rpx solid #E4E7ED;
}
</style>