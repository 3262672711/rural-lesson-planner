// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取请求参数
    const { subject, grade, textbook, topic, classProfile, teachingStyle, lessonCount } = event

    // 参数验证
    if (!subject || !grade || !textbook || !topic) {
      return {
        code: -1,
        data: null,
        message: '缺少必要参数'
      }
    }

    // Mock数据（后续替换为AI生成）
    const mockLessonPlan = {
      metadata: {
        subject,
        grade,
        textbook,
        topic,
        duration: 40
      },
      objectives: {
        knowledge_skill: `初步认识${topic}，理解其基本概念和原理，能够正确运用相关知识解决问题`,
        process_method: `通过观察、操作、讨论等活动，培养学生的观察能力、思维能力和合作能力`,
        emotion_attitude: `感受${subject}与生活的联系，激发学习兴趣，培养良好的学习习惯`
      },
      key_points: [
        {
          point: `${topic}的基本概念`,
          strategy: '通过具体实例和直观演示，帮助学生理解概念',
          common_mistakes: '学生容易混淆相关概念，需要通过对比进行区分'
        },
        {
          point: `${topic}的应用方法`,
          strategy: '通过练习和实际操作，巩固应用技能',
          common_mistakes: '应用时容易忽略前提条件'
        }
      ],
      difficulties: [
        {
          point: `${topic}的深入理解`,
          breakthrough: '通过多种教学手段，帮助学生建立完整的知识体系'
        }
      ],
      process: [
        {
          stage: '导入',
          duration: 5,
          activity: '创设情境，激发兴趣',
          teacher_action: '展示相关图片或视频，提出问题，引导学生思考',
          student_action: '观察、思考，尝试回答问题',
          design_intent: '从生活情境引入，激发学生的学习兴趣'
        },
        {
          stage: '新授',
          duration: 15,
          activity: '讲解新知识',
          teacher_action: '讲解核心概念，演示操作方法，引导学生理解',
          student_action: '认真听讲，做好笔记，参与互动',
          design_intent: '通过讲解和演示，帮助学生理解新知识'
        },
        {
          stage: '练习',
          duration: 12,
          activity: '巩固练习',
          teacher_action: '布置练习题，巡视指导，纠正错误',
          student_action: '独立完成练习，小组讨论交流',
          design_intent: '通过练习巩固所学知识'
        },
        {
          stage: '总结',
          duration: 5,
          activity: '课堂小结',
          teacher_action: '引导学生总结本节课学到的知识',
          student_action: '回顾本节课内容，分享收获',
          design_intent: '培养学生的总结归纳能力'
        },
        {
          stage: '作业',
          duration: 3,
          activity: '布置作业',
          teacher_action: '布置课后练习，说明要求',
          student_action: '记录作业内容',
          design_intent: '延伸课堂学习，巩固知识'
        }
      ],
      board_design: `${topic}\n\n一、概念\n\n二、方法\n\n三、应用`,
      homework: `1. 完成课后练习题\n2. 预习下一课内容`,
      reflection_prompts: [
        '学生对本节课内容的理解程度如何？',
        '教学过程中有哪些环节需要改进？',
        '学生的参与度和积极性如何？'
      ]
    }

    const mockSlides = [
      { page: 1, title: topic, subtitle: `${grade}${subject}`, layout: 'title', content: [], notes: '封面页' },
      { page: 2, title: '情境导入', layout: 'content', content: ['展示相关图片或视频', '提出问题'], notes: '激发兴趣' },
      { page: 3, title: '新知识讲解', layout: 'content', content: ['概念讲解', '方法演示'], notes: '重点内容' },
      { page: 4, title: '练习巩固', layout: 'content', content: ['练习题', '讨论交流'], notes: '巩固知识' },
      { page: 5, title: '课堂总结', layout: 'content', content: ['知识要点', '注意事项'], notes: '总结归纳' }
    ]

    const mockExercises = {
      basic: [
        {
          type: '填空题',
          question: `关于${topic}的基本概念是______`,
          answer: '根据具体内容填写',
          explanation: '这是基础概念的考查',
          knowledge_tag: topic
        }
      ],
      advanced: [
        {
          type: '简答题',
          question: `请简述${topic}的应用方法`,
          answer: '根据具体内容回答',
          explanation: '考查学生对知识应用的理解',
          knowledge_tag: topic
        }
      ],
      extension: [
        {
          type: '应用题',
          question: `请运用${topic}的知识解决实际问题`,
          answer: '根据具体问题解答',
          explanation: '考查学生的综合应用能力',
          knowledge_tag: topic
        }
      ]
    }

    const mockKnowledgeGraph = {
      prerequisite: ['基础知识', '相关概念'],
      current: [topic, '核心方法', '应用技能'],
      following: ['进阶知识', '拓展应用'],
      cross_subject: ['语文：相关阅读', '科学：实际应用']
    }

    // 模拟延迟（模拟AI生成时间）
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      code: 0,
      data: {
        lesson_plan: mockLessonPlan,
        slides: mockSlides,
        exercises: mockExercises,
        knowledge_graph: mockKnowledgeGraph
      },
      message: 'success'
    }
  } catch (err) {
    console.error('生成教案失败:', err)
    return {
      code: -1,
      data: null,
      message: '生成教案失败，请稍后重试'
    }
  }
}
