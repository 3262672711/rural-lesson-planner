<template>
  <view class="index-container">
    <!-- 顶部Banner区域 -->
    <u-card class="banner-card">
      <view class="banner-content">
        <text class="banner-title">为乡村教师打造的AI备课助手</text>
        <text class="banner-subtitle">输入课题信息，30秒生成完整教案、课件和练习题</text>
        <u-button 
          type="primary" 
          size="large" 
          class="start-button" 
          @click="goToGenerate"
          :custom-style="buttonStyle"
        >
          开始备课
        </u-button>
      </view>
    </u-card>

    <!-- 最近生成区域 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">最近生成</text>
      </view>
      
      <!-- 加载中状态 -->
      <view v-if="loading" class="loading-state">
        <u-loading-icon size="40" color="#FF8C42"></u-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 数据列表 -->
      <scroll-view 
        v-else-if="recentItems.length > 0"
        scroll-x 
        class="recent-scroll"
        show-scrollbar="false"
      >
        <view class="recent-list">
          <view 
            class="recent-item" 
            v-for="(item, index) in recentItems" 
            :key="item._id || index"
            @click="goToResult(item)"
          >
            <view class="item-header">
              <u-tag 
                :type="getSubjectType(item.subject)" 
                :text="item.subject" 
                size="mini"
              ></u-tag>
              <text class="item-grade">{{ item.grade }}</text>
            </view>
            <text class="item-topic">{{ item.topic }}</text>
            <text class="item-time">{{ item.created_at }}</text>
          </view>
        </view>
      </scroll-view>
      
      <!-- 空状态 -->
      <u-empty 
        v-else 
        mode="data" 
        text="还没有生成过教案，点击上方按钮开始吧" 
        class="empty-state"
      ></u-empty>
    </view>

    <!-- 快速模板区域 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">快速模板</text>
      </view>
      <u-row :gutter="20">
        <u-col :span="12" v-for="(template, index) in templates" :key="index">
          <view class="template-card" @click="goToGenerateWithTemplate(template)">
            <u-icon :name="template.icon" :size="40" :color="template.color"></u-icon>
            <text class="template-name">{{ template.name }}</text>
          </view>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script>
import { getHistory } from '@/utils/services.js'

export default {
  data() {
    return {
      loading: false,
      buttonStyle: {
        backgroundColor: '#FF8C42',
        borderColor: '#FF8C42',
        height: '88rpx',
        fontSize: '32rpx',
        borderRadius: '16rpx'
      },
      // 最近生成的数据
      recentItems: [],
      // 快速模板数据
      templates: [
        {
          name: '新授课',
          icon: 'book',
          color: '#FF8C42',
          style: 'new'
        },
        {
          name: '复习课',
          icon: 'folder',
          color: '#2C3E50',
          style: 'review'
        },
        {
          name: '练习课',
          icon: 'clipboard',
          color: '#3498DB',
          style: 'practice'
        },
        {
          name: '公开课',
          icon: 'star',
          color: '#9B59B6',
          style: 'public'
        }
      ]
    }
  },
  onShow() {
    // 每次显示页面时加载最近生成数据
    this.loadRecentItems()
  },
  methods: {
    // 加载最近生成的数据
    async loadRecentItems() {
      this.loading = true
      try {
        const result = await getHistory({ page: 1, page_size: 6 })
        if (result && result.list) {
          this.recentItems = result.list
        }
      } catch (err) {
        console.error('加载最近生成失败:', err)
        // 加载失败时使用mock数据
        this.recentItems = this.getMockData()
      } finally {
        this.loading = false
      }
    },
    
    // 获取mock数据（用于云函数未部署时的降级处理）
    getMockData() {
      return [
        {
          _id: 'mock_001',
          subject: '数学',
          grade: '三年级',
          topic: '分数的初步认识',
          created_at: '2026-04-27 10:30',
          is_favorited: true,
          duration: 40
        },
        {
          _id: 'mock_002',
          subject: '语文',
          grade: '五年级',
          topic: '草船借箭',
          created_at: '2026-04-26 15:20',
          is_favorited: false,
          duration: 45
        },
        {
          _id: 'mock_003',
          subject: '科学',
          grade: '二年级',
          topic: '认识植物',
          created_at: '2026-04-25 09:45',
          is_favorited: false,
          duration: 35
        }
      ]
    },
    
    // 跳转到生成页
    goToGenerate() {
      uni.navigateTo({
        url: '/pages/generate/generate'
      })
    },
    
    // 跳转到结果页
    goToResult(item) {
      uni.navigateTo({
        url: `/pages/result/result?id=${item._id}`
      })
    },
    
    // 跳转到生成页并带参数
    goToGenerateWithTemplate(template) {
      uni.navigateTo({
        url: `/pages/generate/generate?style=${template.style}`
      })
    },
    
    // 根据学科返回标签类型
    getSubjectType(subject) {
      const typeMap = {
        '数学': 'primary',
        '语文': 'success',
        '英语': 'warning',
        '科学': 'info'
      }
      return typeMap[subject] || 'default'
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

/* Banner区域 */
.banner-card {
  margin-bottom: 40rpx;
  border-radius: 16rpx;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 20rpx;
  text-align: center;
}

.banner-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #2C3E50;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.banner-subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.start-button {
  width: 80%;
  margin-top: 10rpx;
}

/* 通用区块样式 */
.section {
  margin-bottom: 40rpx;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2C3E50;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #999;
}

/* 最近生成区域 */
.recent-scroll {
  width: 100%;
}

.recent-list {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  padding-bottom: 20rpx;
}

.recent-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 360rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.item-grade {
  font-size: 24rpx;
  color: #999;
  margin-left: 16rpx;
}

.item-topic {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.empty-state {
  padding: 60rpx 0;
}

/* 快速模板区域 */
.template-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.template-name {
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
</style>
