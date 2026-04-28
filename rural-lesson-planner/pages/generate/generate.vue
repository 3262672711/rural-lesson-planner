<template>
  <view class="generate-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
        <text class="navbar-back-text">返回</text>
      </view>
      <text class="navbar-title">新建教案</text>
      <view class="navbar-right"></view>
    </view>

    <!-- 表单区域 -->
    <scroll-view scroll-y class="form-scroll">
      <u-form :model="form" ref="uForm" label-position="top" class="form">
        <!-- 学科选择 -->
        <u-form-item label="学科" prop="subject" required>
          <u-radio-group v-model="form.subject" placement="row" @change="onSubjectChange">
            <u-radio 
              v-for="(item, index) in subjectOptions" 
              :key="index"
              :name="item"
              :activeColor="activeColor"
              :customStyle="{marginRight: '20rpx', marginBottom: '16rpx'}"
            >
              {{ item }}
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <!-- 年级选择 -->
        <u-form-item label="年级" prop="grade" required>
          <u-radio-group v-model="form.grade" placement="row" @change="onGradeChange">
            <u-radio 
              v-for="(item, index) in gradeOptions" 
              :key="index"
              :name="item"
              :activeColor="activeColor"
              :customStyle="{marginRight: '20rpx', marginBottom: '16rpx'}"
            >
              {{ item }}
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <!-- 教材版本 -->
        <u-form-item label="教材版本" prop="version" required @click="showVersionPicker = true">
          <u-input 
            v-model="form.version" 
            placeholder="请选择教材版本" 
            disabled
            :customStyle="{backgroundColor: '#f5f5f5'}"
          >
            <template #suffix>
              <u-icon name="arrow-down" size="16" color="#999"></u-icon>
            </template>
          </u-input>
        </u-form-item>
        <u-picker 
          :show="showVersionPicker" 
          :columns="versionOptions" 
          @confirm="onVersionConfirm"
          @cancel="showVersionPicker = false"
          keyName="label"
        ></u-picker>

        <!-- 课题名称 -->
        <u-form-item label="课题名称" prop="topic" required>
          <u-input 
            v-model="form.topic" 
            placeholder="请输入课题名称，如'分数的初步认识'"
            :maxlength="50"
          />
        </u-form-item>

        <!-- 高级选项 -->
        <view class="advanced-section">
          <u-collapse>
            <u-collapse-item title="高级选项" name="advanced">
              <!-- 班级学情 -->
              <u-form-item label="班级学情">
                <u-textarea 
                  v-model="form.classInfo" 
                  placeholder="如：基础薄弱，需多举例；或：学生活跃，喜欢互动"
                  :maxlength="200"
                  count
                />
              </u-form-item>

              <!-- 教学风格 -->
              <u-form-item label="教学风格" @click="showStylePicker = true">
                <u-input 
                  v-model="form.style" 
                  placeholder="请选择教学风格" 
                  disabled
                  :customStyle="{backgroundColor: '#f5f5f5'}"
                >
                  <template #suffix>
                    <u-icon name="arrow-down" size="16" color="#999"></u-icon>
                  </template>
                </u-input>
              </u-form-item>
              <u-picker 
                :show="showStylePicker" 
                :columns="styleOptions" 
                @confirm="onStyleConfirm"
                @cancel="showStylePicker = false"
                keyName="label"
              ></u-picker>

              <!-- 课时数 -->
              <u-form-item label="课时数" @click="showDurationPicker = true">
                <u-input 
                  v-model="form.duration" 
                  placeholder="请选择课时数" 
                  disabled
                  :customStyle="{backgroundColor: '#f5f5f5'}"
                >
                  <template #suffix>
                    <u-icon name="arrow-down" size="16" color="#999"></u-icon>
                  </template>
                </u-input>
              </u-form-item>
              <u-picker 
                :show="showDurationPicker" 
                :columns="durationOptions" 
                @confirm="onDurationConfirm"
                @cancel="showDurationPicker = false"
                keyName="label"
              ></u-picker>
            </u-collapse-item>
          </u-collapse>
        </view>
      </u-form>
    </scroll-view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <u-button 
        type="primary" 
        size="large" 
        :custom-style="submitButtonStyle"
        @click="handleSubmit"
      >
        一键生成教案
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeColor: '#FF8C42',
      showVersionPicker: false,
      showStylePicker: false,
      showDurationPicker: false,
      form: {
        subject: '',
        grade: '',
        version: '人教版（部编版）',
        topic: '',
        classInfo: '',
        style: '互动探究式',
        duration: '1课时'
      },
      rules: {
        subject: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        version: [
          { required: true, message: '请选择教材版本', trigger: 'change' }
        ],
        topic: [
          { required: true, message: '请输入课题名称', trigger: 'blur' }
        ]
      },
      submitButtonStyle: {
        backgroundColor: '#FF8C42',
        borderColor: '#FF8C42',
        height: '96rpx',
        fontSize: '32rpx',
        borderRadius: '16rpx'
      },
      subjectOptions: ['语文', '数学', '英语', '科学', '道德与法治', '音乐', '美术', '体育'],
      gradeOptions: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      versionOptions: [
        [
          { label: '人教版（部编版）', value: 'renjiaobubian' },
          { label: '北师大版', value: 'beishida' },
          { label: '苏教版', value: 'sujiao' },
          { label: '冀教版', value: 'jijiao' }
        ]
      ],
      styleOptions: [
        [
          { label: '互动探究式', value: 'interactive' },
          { label: '讲授式', value: 'lecture' },
          { label: '任务驱动式', value: 'task' },
          { label: '混合式', value: 'mixed' }
        ]
      ],
      durationOptions: [
        [
          { label: '1课时', value: 1 },
          { label: '2课时', value: 2 },
          { label: '3课时', value: 3 }
        ]
      ]
    }
  },
  onLoad(options) {
    // 处理从首页快速模板跳转过来的参数
    if (options.style) {
      const styleMap = {
        'new': '互动探究式',
        'review': '讲授式',
        'practice': '任务驱动式',
        'public': '混合式'
      }
      this.form.style = styleMap[options.style] || '互动探究式'
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    },
    onSubjectChange(value) {
      this.form.subject = value
    },
    onGradeChange(value) {
      this.form.grade = value
    },
    onVersionConfirm(value) {
      this.form.version = value.value[0].label
      this.showVersionPicker = false
    },
    onStyleConfirm(value) {
      this.form.style = value.value[0].label
      this.showStylePicker = false
    },
    onDurationConfirm(value) {
      this.form.duration = value.value[0].label
      this.showDurationPicker = false
    },
    handleSubmit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          // 跳转到结果页
          uni.navigateTo({
            url: '/pages/result/result?demo=1'
          })
        } else {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.generate-container {
  min-height: 100vh;
  background-color: $bg-color;
  display: flex;
  flex-direction: column;
}

/* 自定义导航栏 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  background-color: #fff;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 999;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-back-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 8rpx;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.navbar-right {
  width: 100rpx;
}

/* 表单滚动区域 */
.form-scroll {
  flex: 1;
  padding: 30rpx;
}

.form {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

/* 高级选项 */
.advanced-section {
  margin-top: 20rpx;
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}

/* 提交按钮区域 */
.submit-section {
  padding: 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}
</style>
