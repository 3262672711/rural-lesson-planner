<template>
  <view class="generate-container">
    <view class="form">
      <u-form :model="form" label-position="top">
        <u-form-item label="课程名称">
          <u-input v-model="form.courseName" placeholder="请输入课程名称" />
        </u-form-item>
        <u-form-item label="教学目标">
          <u-textarea v-model="form.objective" placeholder="请输入教学目标" :maxlength="200" />
        </u-form-item>
        <u-form-item label="教学内容">
          <u-textarea v-model="form.content" placeholder="请输入教学内容" :maxlength="500" />
        </u-form-item>
        <u-form-item label="教学时长">
          <u-input v-model="form.duration" placeholder="请输入教学时长（分钟）" type="number" />
        </u-form-item>
        <u-button type="primary" size="large" @click="generateLesson" style="margin-top: 40rpx;">
          生成教案
        </u-button>
      </u-form>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        courseName: '',
        objective: '',
        content: '',
        duration: ''
      }
    }
  },
  methods: {
    generateLesson() {
      // 简单验证
      if (!this.form.courseName || !this.form.objective || !this.form.content || !this.form.duration) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      // 跳转到结果页
      uni.navigateTo({
        url: '/pages/result/result'
      })
    }
  }
}
</script>

<style scoped>
.generate-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding: 40rpx;
}

.form {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>