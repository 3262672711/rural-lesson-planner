// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const { callLLMWithRetry } = require('../shared/ai.js')
const { SYSTEM_PROMPT, generateSlidesPrompt } = require('../shared/prompt.js')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const { lessonPlan } = event

    if (!lessonPlan) {
      return {
        code: -1,
        data: null,
        message: '缺少必要参数 lessonPlan'
      }
    }

    const prompt = generateSlidesPrompt(lessonPlan)

    const result = await callLLMWithRetry(prompt, SYSTEM_PROMPT, 2)

    if (!result.slides || result.slides.length === 0) {
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
    console.error('生成课件大纲失败:', err)
    return {
      code: -1,
      data: null,
      message: err.message || '生成课件大纲失败，请稍后重试'
    }
  }
}
