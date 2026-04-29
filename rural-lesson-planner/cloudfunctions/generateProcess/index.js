// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const { callLLMWithRetry } = require('../shared/ai.js')
const { SYSTEM_PROMPT, generateProcessPrompt } = require('../shared/prompt.js')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取请求参数（包含Step1的输出）
    const { subject, grade, textbook, topic, classProfile, teachingStyle, objectives, key_points, difficulties, total_duration } = event

    // 参数验证
    if (!objectives || !key_points || !difficulties) {
      return {
        code: -1,
        data: null,
        message: '缺少教学目标和重难点数据'
      }
    }

    // 构建Step1的输出
    const step1Output = {
      objectives,
      key_points,
      difficulties,
      total_duration: total_duration || 40
    }

    // 构建Prompt
    const prompt = generateProcessPrompt(step1Output, {
      classProfile,
      teachingStyle
    })

    // 调用AI生成
    const result = await callLLMWithRetry(prompt, SYSTEM_PROMPT, 2)

    // 验证结果
    if (!result.process || result.process.length === 0) {
      return {
        code: -1,
        data: null,
        message: '生成结果格式不正确'
      }
    }

    // 验证时间分配
    const processDuration = result.process.reduce((sum, p) => sum + (p.duration || 0), 0)
    if (processDuration !== step1Output.total_duration) {
      console.warn(`时间分配不匹配: ${processDuration} != ${step1Output.total_duration}`)
    }

    return {
      code: 0,
      data: result,
      message: 'success'
    }
  } catch (err) {
    console.error('生成教学过程失败:', err)
    return {
      code: -1,
      data: null,
      message: err.message || '生成教学过程失败，请稍后重试'
    }
  }
}
