<template>
  <view class="result-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
        <text class="navbar-back-text">返回</text>
      </view>
      <text class="navbar-title">{{ lessonInfo.grade }}{{ lessonInfo.subject }} · {{ lessonInfo.topic }}</text>
      <view class="navbar-right">
        <u-icon 
          :name="isFavorite ? 'star-fill' : 'star'" 
          size="22" 
          :color="isFavorite ? '#FF8C42' : '#666'"
          @click="toggleFavorite"
        ></u-icon>
        <u-icon name="file-text" size="22" color="#666" @click="exportWord" style="margin-left: 24rpx;"></u-icon>
        <u-icon name="play-circle" size="22" color="#666" @click="exportPpt" style="margin-left: 24rpx;"></u-icon>
      </view>
    </view>

    <!-- Tab切换栏 -->
    <view class="tabs-wrapper">
      <u-tabs 
        :list="tabList" 
        :current="currentTab" 
        @change="onTabChange"
        :activeStyle="{color: '#FF8C42', fontWeight: 'bold'}"
        :inactiveStyle="{color: '#666'}"
        lineColor="#FF8C42"
        :scrollable="true"
      ></u-tabs>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-scroll">
      <!-- 教案Tab -->
      <view v-if="currentTab === 0" class="tab-content">
        <!-- 教学目标卡片 -->
        <view class="card">
          <view class="card-title">教学目标</view>
          <view class="objective-item">
            <text class="objective-icon">📋</text>
            <view class="objective-content">
              <text class="objective-label">知识与技能</text>
              <text class="objective-text">{{ lessonData.objectives.knowledge }}</text>
            </view>
          </view>
          <view class="objective-item">
            <text class="objective-icon">🔧</text>
            <view class="objective-content">
              <text class="objective-label">过程与方法</text>
              <text class="objective-text">{{ lessonData.objectives.process }}</text>
            </view>
          </view>
          <view class="objective-item">
            <text class="objective-icon">❤️</text>
            <view class="objective-content">
              <text class="objective-label">情感态度与价值观</text>
              <text class="objective-text">{{ lessonData.objectives.emotion }}</text>
            </view>
          </view>
        </view>

        <!-- 教学重难点卡片 -->
        <view class="card">
          <view class="card-title">教学重难点</view>
          <view class="difficulty-section">
            <text class="difficulty-label">重点</text>
            <view class="difficulty-list">
              <view v-for="(item, index) in lessonData.keyPoints" :key="'key-' + index" class="difficulty-item">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-strategy">→ 突破策略：{{ item.strategy }}</text>
                <text class="item-warning">⚠️ 常见误区：{{ item.mistake }}</text>
              </view>
            </view>
          </view>
          <view class="difficulty-section">
            <text class="difficulty-label">难点</text>
            <view class="difficulty-list">
              <view v-for="(item, index) in lessonData.difficulties" :key="'diff-' + index" class="difficulty-item">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-strategy">→ 突破策略：{{ item.strategy }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 教学过程卡片 -->
        <view class="card">
          <view class="card-header-row">
            <text class="card-title">教学过程</text>
            <text class="total-time">⏱ 共{{ lessonData.totalDuration }}分钟</text>
          </view>
          <u-collapse>
            <u-collapse-item 
              v-for="(stage, index) in lessonData.stages" 
              :key="index"
              :title="stage.name + '（' + stage.duration + '分钟）'"
              :name="index"
            >
              <view class="stage-content">
                <text class="stage-desc">{{ stage.description }}</text>
                <view class="stage-detail">
                  <text class="detail-label">👤 教师活动</text>
                  <text class="detail-text">{{ stage.teacherActivity }}</text>
                </view>
                <view class="stage-detail">
                  <text class="detail-label">🙋 学生活动</text>
                  <text class="detail-text">{{ stage.studentActivity }}</text>
                </view>
                <view class="stage-detail">
                  <text class="detail-label">💡 设计意图</text>
                  <text class="detail-text">{{ stage.designIntent }}</text>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>

        <!-- 板书设计 -->
        <view class="card">
          <view class="card-title">板书设计</view>
          <view class="board-design">
            <text class="board-text">{{ lessonData.boardDesign }}</text>
          </view>
        </view>

        <!-- 教学反思提示 -->
        <view class="card">
          <view class="card-title">教学反思提示</view>
          <view class="reflection-list">
            <view v-for="(item, index) in lessonData.reflections" :key="index" class="reflection-item">
              <text class="reflection-dot">•</text>
              <text class="reflection-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 课件大纲Tab -->
      <view v-if="currentTab === 1" class="tab-content">
        <view class="card">
          <view class="card-title">课件大纲</view>
          <view class="slide-list">
            <view v-for="(slide, index) in lessonData.slides" :key="index" class="slide-item">
              <view class="slide-header">
                <text class="slide-page">第{{ slide.page }}页</text>
                <text class="slide-title">{{ slide.title }}</text>
              </view>
              <text class="slide-content">{{ slide.content }}</text>
              <text class="slide-note">备注：{{ slide.note }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 练习题Tab -->
      <view v-if="currentTab === 2" class="tab-content">
        <view class="card">
          <view class="card-title">基础题</view>
          <u-collapse>
            <u-collapse-item 
              v-for="(exercise, index) in lessonData.exercises.basic" 
              :key="'basic-' + index"
              :title="exercise.question"
              :name="'basic-' + index"
            >
              <view class="exercise-detail">
                <view class="answer-row">
                  <text class="answer-label">参考答案：</text>
                  <text class="answer-text">{{ exercise.answer }}</text>
                </view>
                <view class="analysis-row">
                  <text class="analysis-label">解析：</text>
                  <text class="analysis-text">{{ exercise.analysis }}</text>
                </view>
                <view class="tag-row">
                  <u-tag v-for="(tag, i) in exercise.tags" :key="i" :text="tag" size="mini" type="info"></u-tag>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>

        <view class="card">
          <view class="card-title">提高题</view>
          <u-collapse>
            <u-collapse-item 
              v-for="(exercise, index) in lessonData.exercises.intermediate" 
              :key="'inter-' + index"
              :title="exercise.question"
              :name="'inter-' + index"
            >
              <view class="exercise-detail">
                <view class="answer-row">
                  <text class="answer-label">参考答案：</text>
                  <text class="answer-text">{{ exercise.answer }}</text>
                </view>
                <view class="analysis-row">
                  <text class="analysis-label">解析：</text>
                  <text class="analysis-text">{{ exercise.analysis }}</text>
                </view>
                <view class="tag-row">
                  <u-tag v-for="(tag, i) in exercise.tags" :key="i" :text="tag" size="mini" type="info"></u-tag>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>

        <view class="card">
          <view class="card-title">拓展题</view>
          <u-collapse>
            <u-collapse-item 
              v-for="(exercise, index) in lessonData.exercises.advanced" 
              :key="'adv-' + index"
              :title="exercise.question"
              :name="'adv-' + index"
            >
              <view class="exercise-detail">
                <view class="answer-row">
                  <text class="answer-label">参考答案：</text>
                  <text class="answer-text">{{ exercise.answer }}</text>
                </view>
                <view class="analysis-row">
                  <text class="analysis-label">解析：</text>
                  <text class="analysis-text">{{ exercise.analysis }}</text>
                </view>
                <view class="tag-row">
                  <u-tag v-for="(tag, i) in exercise.tags" :key="i" :text="tag" size="mini" type="info"></u-tag>
                </view>
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>
      </view>

      <!-- 重难点Tab -->
      <view v-if="currentTab === 3" class="tab-content">
        <view class="card">
          <view class="card-title">重点详解</view>
          <view v-for="(item, index) in lessonData.keyPointsDetail" :key="'key-detail-' + index" class="detail-card">
            <text class="detail-name">{{ item.name }}</text>
            <view class="detail-section">
              <text class="detail-label">突破策略</text>
              <text class="detail-text">{{ item.strategy }}</text>
            </view>
            <view class="detail-section">
              <text class="detail-label">生活化类比</text>
              <text class="detail-text">{{ item.analogy }}</text>
            </view>
            <view class="detail-section">
              <text class="detail-label">过渡性练习</text>
              <text class="detail-text">{{ item.practice }}</text>
            </view>
          </view>
        </view>

        <view class="card">
          <view class="card-title">难点详解</view>
          <view v-for="(item, index) in lessonData.difficultiesDetail" :key="'diff-detail-' + index" class="detail-card">
            <text class="detail-name">{{ item.name }}</text>
            <view class="detail-section">
              <text class="detail-label">突破策略</text>
              <text class="detail-text">{{ item.strategy }}</text>
            </view>
            <view class="detail-section">
              <text class="detail-label">生活化类比</text>
              <text class="detail-text">{{ item.analogy }}</text>
            </view>
            <view class="detail-section">
              <text class="detail-label">过渡性练习</text>
              <text class="detail-text">{{ item.practice }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 知识图谱Tab -->
      <view v-if="currentTab === 4" class="tab-content">
        <view class="card">
          <view class="card-title">知识图谱</view>
          <view class="knowledge-tree">
            <view class="tree-section">
              <text class="tree-label">前置知识</text>
              <view class="tree-items">
                <view v-for="(item, index) in lessonData.knowledgeGraph.prerequisite" :key="'pre-' + index" class="tree-item">
                  <text class="tree-dot">●</text>
                  <text class="tree-text">{{ item }}</text>
                </view>
              </view>
            </view>
            <view class="tree-section current">
              <text class="tree-label">本课内容</text>
              <view class="tree-items">
                <view v-for="(item, index) in lessonData.knowledgeGraph.current" :key="'cur-' + index" class="tree-item">
                  <text class="tree-dot active">●</text>
                  <text class="tree-text active">{{ item }}</text>
                </view>
              </view>
            </view>
            <view class="tree-section">
              <text class="tree-label">后续知识</text>
              <view class="tree-items">
                <view v-for="(item, index) in lessonData.knowledgeGraph.following" :key="'fol-' + index" class="tree-item">
                  <text class="tree-dot">●</text>
                  <text class="tree-text">{{ item }}</text>
                </view>
              </view>
            </view>
            <view class="tree-section">
              <text class="tree-label">跨学科关联</text>
              <view class="tree-items">
                <view v-for="(item, index) in lessonData.knowledgeGraph.crossSubject" :key="'cross-' + index" class="tree-item">
                  <text class="tree-dot cross">●</text>
                  <text class="tree-text">{{ item }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isFavorite: false,
      currentTab: 0,
      tabList: [
        { name: '教案' },
        { name: '课件大纲' },
        { name: '练习题' },
        { name: '重难点' },
        { name: '知识图谱' }
      ],
      lessonInfo: {
        grade: '三年级',
        subject: '数学',
        topic: '分数的初步认识'
      },
      lessonData: {
        totalDuration: 40,
        objectives: {
          knowledge: '初步认识分数，理解分数的含义，会读、写简单的分数',
          process: '通过动手操作、观察比较等活动，培养学生的观察能力和思维能力',
          emotion: '感受数学与生活的联系，激发学习数学的兴趣'
        },
        keyPoints: [
          {
            name: '分数的意义',
            strategy: '通过实物分一分，让学生直观感受平均分',
            mistake: '学生容易忽略"平均分"这个前提条件'
          },
          {
            name: '分数的读写',
            strategy: '结合具体情境，反复练习读法和写法',
            mistake: '分子分母的位置容易写反'
          }
        ],
        difficulties: [
          {
            name: '理解分数的本质',
            strategy: '通过多种实物模型，建立分数的直观表象'
          }
        ],
        stages: [
          {
            name: '导入',
            duration: 5,
            description: '创设情境，激发兴趣',
            teacherActivity: '出示一个月饼，问：把一个月饼分给两个小朋友，怎么分才公平？',
            studentActivity: '思考并回答：平均分，每人一半',
            designIntent: '从生活情境引入，激发学生的学习兴趣'
          },
          {
            name: '新授',
            duration: 15,
            description: '认识二分之一',
            teacherActivity: '演示把一个月饼平均分成两份，引出1/2的概念，讲解读法和写法',
            studentActivity: '观察演示，动手折纸，表示出图形的1/2',
            designIntent: '通过动手操作，加深对分数意义的理解'
          },
          {
            name: '练习',
            duration: 12,
            description: '巩固练习',
            teacherActivity: '出示练习题，引导学生判断哪些图形的涂色部分可以用1/2表示',
            studentActivity: '独立完成练习，小组讨论交流',
            designIntent: '通过练习巩固所学知识'
          },
          {
            name: '总结',
            duration: 5,
            description: '课堂小结',
            teacherActivity: '引导学生总结本节课学到的知识',
            studentActivity: '回顾本节课内容，分享收获',
            designIntent: '培养学生的总结归纳能力'
          },
          {
            name: '作业',
            duration: 3,
            description: '布置作业',
            teacherActivity: '布置课后练习：用纸折出1/4、1/8',
            studentActivity: '记录作业内容',
            designIntent: '延伸课堂学习，巩固知识'
          }
        ],
        boardDesign: '分数的初步认识\n\n把一个物体平均分成几份，每份就是它的几分之一\n\n1/2 读作：二分之一\n\n分子 — 表示取了几份\n分母 — 表示平均分成了几份',
        reflections: [
          '学生对"平均分"的理解是否到位？',
          '动手操作环节是否充分？学生的参与度如何？',
          '练习题的设计是否难易适中？'
        ],
        slides: [
          { page: 1, title: '分数的初步认识', content: '三年级数学', note: '封面页，吸引学生注意力' },
          { page: 2, title: '情境导入', content: '把一个月饼分给两个小朋友，怎么分才公平？', note: '引导学生思考"平均分"' },
          { page: 3, title: '认识1/2', content: '把一个月饼平均分成2份，每份是它的1/2', note: '重点讲解分数的意义' },
          { page: 4, title: '分数的读写', content: '1/2 读作：二分之一\n分子：1\n分数线：—\n分母：2', note: '强调分子分母的位置' },
          { page: 5, title: '动手操作', content: '用一张纸折出它的1/2', note: '让学生动手操作' },
          { page: 6, title: '巩固练习', content: '判断：哪些图形的涂色部分可以用1/2表示？', note: '检验学习效果' },
          { page: 7, title: '课堂总结', content: '今天我们学习了什么？', note: '引导学生总结' },
          { page: 8, title: '课后作业', content: '用纸折出1/4、1/8', note: '延伸学习' }
        ],
        exercises: {
          basic: [
            {
              question: '把一个苹果平均分成4份，每份是它的（  ）分之（  ）',
              answer: '四分之一，写作1/4',
              analysis: '把一个物体平均分成几份，每份就是它的几分之一',
              tags: ['分数意义', '基础概念']
            },
            {
              question: '读出下列分数：1/3、1/5、1/8',
              answer: '三分之一、五分之一、八分之一',
              analysis: '读分数时，先读分母，再读"分之"，最后读分子',
              tags: ['分数读法', '基础技能']
            }
          ],
          intermediate: [
            {
              question: '判断：把一张纸分成4份，每份是它的1/4',
              answer: '错误',
              analysis: '必须是"平均分"成4份，每份才是它的1/4',
              tags: ['分数意义', '易错点']
            },
            {
              question: '用分数表示图中的涂色部分（图：一个圆被平均分成6份，涂了1份）',
              answer: '1/6',
              analysis: '圆被平均分成6份，涂色部分占其中1份，所以是1/6',
              tags: ['分数表示', '图形理解']
            }
          ],
          advanced: [
            {
              question: '小明吃了一个蛋糕的1/2，小红吃了同一个蛋糕的1/4，谁吃得多？',
              answer: '小明吃得多',
              analysis: '同一个蛋糕，1/2表示平均分成2份取1份，1/4表示平均分成4份取1份，所以1/2 > 1/4',
              tags: ['分数比较', '应用题']
            }
          ]
        },
        keyPointsDetail: [
          {
            name: '分数的意义',
            strategy: '通过实物分一分，让学生直观感受平均分',
            analogy: '就像把一个苹果平均分给两个小朋友，每人得到的一半就是1/2',
            practice: '让学生用纸折出1/2、1/4，加深理解'
          },
          {
            name: '分数的读写',
            strategy: '结合具体情境，反复练习读法和写法',
            analogy: '分数就像一个"小房子"，分子住在楼上，分母住在楼下',
            practice: '出示多个分数让学生读写，及时纠正错误'
          }
        ],
        difficultiesDetail: [
          {
            name: '理解分数的本质',
            strategy: '通过多种实物模型，建立分数的直观表象',
            analogy: '分数就是把一个整体平均分成若干份，取其中的一份或几份',
            practice: '用不同的实物（月饼、苹果、纸张）演示，让学生体会分数的本质'
          }
        ],
        knowledgeGraph: {
          prerequisite: ['整数的认识', '平均分的概念', '除法的意义'],
          current: ['分数的意义', '分数的读写', '简单分数的比较'],
          following: ['分数的加减法', '分数的乘除法', '分数与小数的互化'],
          crossSubject: ['语文：分数相关的故事阅读', '科学：测量中的分数应用', '美术：图形的分割与组合']
        }
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      // TODO: 根据id从云函数获取数据
    }
    if (options.demo) {
      // 使用mock数据
    }
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
    onTabChange(index) {
      this.currentTab = index
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      uni.showToast({
        title: this.isFavorite ? '已收藏' : '已取消收藏',
        icon: 'success'
      })
    },
    exportWord() {
      uni.showToast({
        title: '正在导出Word...',
        icon: 'loading'
      })
    },
    exportPpt() {
      uni.showToast({
        title: '正在导出PPT...',
        icon: 'loading'
      })
    }
  }
}
</script>

<style scoped>
.result-container {
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
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar-right {
  display: flex;
  align-items: center;
}

/* Tab切换栏 */
.tabs-wrapper {
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

/* 内容滚动区域 */
.content-scroll {
  flex: 1;
  padding: 20rpx;
}

.tab-content {
  padding-bottom: 40rpx;
}

/* 卡片样式 */
.card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2C3E50;
  margin-bottom: 20rpx;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.total-time {
  font-size: 24rpx;
  color: #666;
}

/* 教学目标 */
.objective-item {
  display: flex;
  margin-bottom: 20rpx;
}

.objective-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.objective-content {
  flex: 1;
}

.objective-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #2C3E50;
  display: block;
  margin-bottom: 8rpx;
}

.objective-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 重难点 */
.difficulty-section {
  margin-bottom: 20rpx;
}

.difficulty-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF8C42;
  display: block;
  margin-bottom: 12rpx;
}

.difficulty-item {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
}

.item-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.item-strategy {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 6rpx;
}

.item-warning {
  font-size: 24rpx;
  color: #e74c3c;
  display: block;
}

/* 教学过程 */
.stage-content {
  padding: 20rpx;
}

.stage-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.stage-detail {
  margin-bottom: 12rpx;
}

.detail-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #2C3E50;
  display: block;
  margin-bottom: 6rpx;
}

.detail-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

/* 板书设计 */
.board-design {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
}

.board-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 教学反思 */
.reflection-item {
  display: flex;
  margin-bottom: 12rpx;
}

.reflection-dot {
  font-size: 28rpx;
  color: #FF8C42;
  margin-right: 12rpx;
}

.reflection-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 课件大纲 */
.slide-item {
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0;
}

.slide-item:last-child {
  border-bottom: none;
}

.slide-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.slide-page {
  font-size: 24rpx;
  color: #FF8C42;
  background-color: #fff5f0;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.slide-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.slide-content {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.slide-note {
  font-size: 24rpx;
  color: #999;
}

/* 练习题 */
.exercise-detail {
  padding: 20rpx;
}

.answer-row, .analysis-row {
  margin-bottom: 12rpx;
}

.answer-label, .analysis-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #2C3E50;
}

.answer-text, .analysis-text {
  font-size: 26rpx;
  color: #666;
}

.tag-row {
  display: flex;
  gap: 12rpx;
  margin-top: 12rpx;
}

/* 重难点详解 */
.detail-card {
  background-color: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.detail-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF8C42;
  display: block;
  margin-bottom: 12rpx;
}

.detail-section {
  margin-bottom: 12rpx;
}

.detail-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #2C3E50;
  display: block;
  margin-bottom: 6rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 知识图谱 */
.knowledge-tree {
  padding: 20rpx;
}

.tree-section {
  margin-bottom: 24rpx;
  padding-left: 20rpx;
  border-left: 4rpx solid #eee;
}

.tree-section.current {
  border-left-color: #FF8C42;
  background-color: #fff5f0;
  margin-left: -20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
}

.tree-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #2C3E50;
  display: block;
  margin-bottom: 12rpx;
}

.tree-items {
  padding-left: 20rpx;
}

.tree-item {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.tree-dot {
  font-size: 20rpx;
  color: #999;
  margin-right: 12rpx;
}

.tree-dot.active {
  color: #FF8C42;
}

.tree-dot.cross {
  color: #3498db;
}

.tree-text {
  font-size: 26rpx;
  color: #666;
}

.tree-text.active {
  color: #FF8C42;
  font-weight: bold;
}
</style>
