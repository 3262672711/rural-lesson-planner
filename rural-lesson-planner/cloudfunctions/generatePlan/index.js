// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const { checkLessonPlanQuality } = require('../shared/quality.js')

/**
 * 调用其他云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 参数
 * @returns {Promise<object>} - 返回结果
 */
const callCloudFunction = async (name, data) => {
  try {
    const result = await cloud.callFunction({
      name,
      data
    })
    return result.result
  } catch (err) {
    console.error(`调用云函数 ${name} 失败:`, err)
    throw err
  }
}

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

    console.log('开始生成教案:', { subject, grade, textbook, topic })

    // Step 1: 调用 generateObjectives 云函数
    console.log('Step 1: 生成教学目标和重难点...')
    const objectivesResult = await callCloudFunction('generateObjectives', {
      subject,
      grade,
      textbook,
      topic,
      classProfile
    })

    if (objectivesResult.code !== 0) {
      return {
        code: -1,
        data: null,
        message: objectivesResult.message || '生成教学目标失败'
      }
    }

    console.log('Step 1 完成')

    // Step 2: 调用 generateProcess 云函数
    console.log('Step 2: 生成教学过程...')
    const processResult = await callCloudFunction('generateProcess', {
      subject,
      grade,
      textbook,
      topic,
      classProfile,
      teachingStyle,
      ...objectivesResult.data
    })

    if (processResult.code !== 0) {
      return {
        code: -1,
        data: null,
        message: processResult.message || '生成教学过程失败'
      }
    }

    console.log('Step 2 完成')

    // 合并结果
    const lessonPlan = {
      metadata: {
        subject,
        grade,
        textbook,
        topic,
        duration: objectivesResult.data.total_duration || 40
      },
      ...objectivesResult.data,
      ...processResult.data
    }

    // Step 3: 质量检查
    console.log('Step 3: 质量检查...')
    const qualityReport = checkLessonPlanQuality(lessonPlan)
    console.log('质量检查结果:', qualityReport)

    // Step 4: 保存到云数据库
    console.log('Step 4: 保存到数据库...')
    try {
      const saveResult = await db.collection('generation_history').add({
        data: {
          openid,
          subject,
          grade,
          textbook,
          topic,
          lesson_plan: lessonPlan,
          quality_score: qualityReport.score,
          quality_level: qualityReport.level,
          is_favorited: false,
          created_at: db.serverDate()
        }
      })
      console.log('保存成功, ID:', saveResult._id)
      lessonPlan._id = saveResult._id
    } catch (dbErr) {
      console.error('保存到数据库失败:', dbErr)
      // 不影响主流程，继续返回结果
    }

    return {
      code: 0,
      data: {
        lessonPlan,
        qualityReport
      },
      message: 'success'
    }
  } catch (err) {
    console.error('生成教案失败:', err)
    return {
      code: -1,
      data: null,
      message: err.message || '生成教案失败，请稍后重试'
    }
  }
}
