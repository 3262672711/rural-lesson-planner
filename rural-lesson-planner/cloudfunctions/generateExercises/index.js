// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const { callLLMWithRetry } = require('../shared/ai.js')
const { SYSTEM_PROMPT, generateExercisesPrompt } = require('../shared/prompt.js')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取请求参数
    const { subject, grade, topic, objectives } = event

    // 参数验证
    if (!subject || !grade || !topic || !objectives) {
      return {
        code: -1,
        data: null,
        message: '缺少必要参数'
      }
    }

    // 构建Step1的输出
    const step1Output = { objectives }

    // 构建Prompt
    const prompt = generateExercisesPrompt(step1Output, {
      subject,
      grade,
      topic
    })

    // 调用AI生成
    const result = await callLLMWithRetry(prompt, SYSTEM_PROMPT, 2)

    // 验证结果
    if (!result.basic && !result.intermediate && !result.advanced) {
      return {
        code: -1,
        data: null,
        message: '生成结果格式不正确'
      }
    }

    return {
      code: 0,
      data: result,
      message: 'success'
    }
  } catch (err) {
    console.error('生成练习题失败:', err)
    return {
      code: -1,
      data: null,
      message: err.message || '生成练习题失败，请稍后重试'
    }
  }
}
