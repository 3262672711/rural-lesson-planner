<template>
  <view class="history-container">
    <view class="history-list">
      <view class="history-item" v-for="(item, index) in historyList" :key="index">
        <view class="item-header">
          <text class="item-title">{{ item.courseName }}</text>
          <text class="item-time">{{ item.createTime }}</text>
        </view>
        <view class="item-content">
          <text class="item-brief">{{ item.brief }}</text>
        </view>
        <view class="item-footer">
          <u-button type="primary" size="small" @click="viewDetail(item.id)">
            查看详情
          </u-button>
          <u-button type="default" size="small" @click="deleteItem(index)">
            删除
          </u-button>
        </view>
      </view>
      <view v-if="historyList.length === 0" class="empty">
        <u-icon name="document" size="64" color="#CCCCCC"></u-icon>
        <text class="empty-text">暂无历史记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: [
        {
          id: 1,
          courseName: '小学语文 - 春天的故事',
          createTime: '2026-04-27 10:30',
          brief: '教学目标：理解课文内容，感受春天的美好...'
        },
        {
          id: 2,
          courseName: '小学数学 - 分数的认识',
          createTime: '2026-04-26 15:20',
          brief: '教学目标：掌握分数的基本概念和计算方法...'
        }
      ]
    }
  },
  methods: {
    viewDetail(id) {
      uni.navigateTo({
        url: '/pages/result/result'
      })
    },
    deleteItem(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.historyList.splice(index, 1)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding: 40rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.item-title {
  font-size: 18px;
  color: $title-color;
  font-weight: bold;
}

.item-time {
  font-size: 14px;
  color: #999999;
}

.item-content {
  margin-bottom: 20rpx;
}

.item-brief {
  font-size: $text-size;
  color: $text-color;
  line-height: $text-line-height;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #CCCCCC;
}

.empty-text {
  margin-top: 20rpx;
  font-size: $text-size;
}
</style>