// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取查询参数
    const { subject, grade, page = 1, page_size = 10 } = event

    // Mock数据（后续替换为数据库查询）
    const mockData = [
      {
        _id: 'history_001',
        subject: '数学',
        grade: '三年级',
        textbook: '人教版（部编版）',
        topic: '分数的初步认识',
        created_at: '2026-04-27 10:30',
        is_favorited: true,
        duration: 40
      },
      {
        _id: 'history_002',
        subject: '语文',
        grade: '五年级',
        textbook: '人教版（部编版）',
        topic: '草船借箭',
        created_at: '2026-04-26 15:20',
        is_favorited: false,
        duration: 45
      },
      {
        _id: 'history_003',
        subject: '科学',
        grade: '二年级',
        textbook: '苏教版',
        topic: '认识植物',
        created_at: '2026-04-25 09:45',
        is_favorited: false,
        duration: 35
      },
      {
        _id: 'history_004',
        subject: '数学',
        grade: '四年级',
        textbook: '人教版（部编版）',
        topic: '多位数的认识',
        created_at: '2026-04-24 14:00',
        is_favorited: true,
        duration: 40
      },
      {
        _id: 'history_005',
        subject: '语文',
        grade: '三年级',
        textbook: '北师大版',
        topic: '春天的故事',
        created_at: '2026-04-23 11:15',
        is_favorited: false,
        duration: 40
      },
      {
        _id: 'history_006',
        subject: '英语',
        grade: '五年级',
        textbook: '人教版（部编版）',
        topic: 'My Family',
        created_at: '2026-04-22 16:30',
        is_favorited: false,
        duration: 40
      }
    ]

    // 按创建时间倒序排列
    let filteredData = [...mockData].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })

    // 按学科筛选
    if (subject) {
      filteredData = filteredData.filter(item => item.subject === subject)
    }

    // 按年级筛选
    if (grade) {
      filteredData = filteredData.filter(item => item.grade === grade)
    }

    // 分页处理
    const total = filteredData.length
    const startIndex = (page - 1) * page_size
    const list = filteredData.slice(startIndex, startIndex + page_size)

    return {
      code: 0,
      data: {
        list,
        total,
        page,
        page_size,
        has_more: startIndex + page_size < total
      },
      message: 'success'
    }
  } catch (err) {
    console.error('获取历史记录失败:', err)
    return {
      code: -1,
      data: null,
      message: '获取历史记录失败，请稍后重试'
    }
  }
}
