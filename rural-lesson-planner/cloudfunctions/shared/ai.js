/**
 * AI服务封装
 * 支持DeepSeek API和Qwen API
 */

const https = require('https')

/**
 * 调用大模型API
 * @param {string} prompt - 用户Prompt
 * @param {string} systemPrompt - 系统Prompt
 * @param {object} options - 配置选项
 * @returns {Promise<object>} - 返回JSON解析后的结果
 */
const callLLM = async (prompt, systemPrompt, options = {}) => {
  const { timeout = 50000, retries = 1 } = options

  // 获取API配置
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.QWEN_API_KEY
  if (!apiKey) {
    throw new Error('未配置API密钥，请设置DEEPSEEK_API_KEY或QWEN_API_KEY环境变量')
  }

  // 判断使用哪个API
  const useDeepSeek = !!process.env.DEEPSEEK_API_KEY
  const baseUrl = useDeepSeek ? 'api.deepseek.com' : 'dashscope.aliyuncs.com'
  const apiPath = useDeepSeek ? '/v1/chat/completions' : '/api/v1/services/aigc/text-generation/generation'
  const model = useDeepSeek ? 'deepseek-chat' : 'qwen-turbo'

  return new Promise((resolve, reject) => {
    const makeRequest = (attempt) => {
      // 构建请求体
      let requestBody
      if (useDeepSeek) {
        requestBody = JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      } else {
        requestBody = JSON.stringify({
          model,
          input: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 4000
          }
        })
      }

      const requestOptions = {
        hostname: baseUrl,
        port: 443,
        path: apiPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(requestBody)
        },
        timeout
      }

      const req = https.request(requestOptions, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            const response = JSON.parse(data)

            // 检查API错误
            if (response.error) {
              throw new Error(response.error.message || 'API调用失败')
            }

            // 提取内容
            let content
            if (useDeepSeek) {
              content = response.choices?.[0]?.message?.content
            } else {
              content = response.output?.choices?.[0]?.message?.content
            }

            if (!content) {
              throw new Error('API返回内容为空')
            }

            // 解析JSON
            const parsedResult = parseJSON(content)
            resolve(parsedResult)
          } catch (error) {
            console.error('解析响应失败:', error.message)
            if (attempt < retries) {
              console.log(`第${attempt + 1}次重试...`)
              makeRequest(attempt + 1)
            } else {
              reject(new Error(`解析响应失败: ${error.message}`))
            }
          }
        })
      })

      req.on('error', (error) => {
        console.error('请求失败:', error.message)
        if (attempt < retries) {
          console.log(`第${attempt + 1}次重试...`)
          makeRequest(attempt + 1)
        } else {
          reject(error)
        }
      })

      req.on('timeout', () => {
        req.destroy()
        if (attempt < retries) {
          console.log(`请求超时，第${attempt + 1}次重试...`)
          makeRequest(attempt + 1)
        } else {
          reject(new Error('请求超时'))
        }
      })

      req.write(requestBody)
      req.end()
    }

    makeRequest(0)
  })
}

/**
 * 解析JSON（支持markdown代码块包裹）
 * @param {string} content - 原始内容
 * @returns {object} - 解析后的对象
 */
const parseJSON = (content) => {
  let jsonStr = content.trim()

  // 尝试提取markdown代码块中的JSON
  const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonBlockMatch) {
    jsonStr = jsonBlockMatch[1].trim()
  }

  // 尝试直接解析
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    // 尝试修复常见的JSON格式问题
    // 1. 移除尾逗号
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')
    // 2. 单引号替换为双引号
    jsonStr = jsonStr.replace(/'/g, '"')
    // 3. 尝试再次解析
    try {
      return JSON.parse(jsonStr)
    } catch (e2) {
      throw new Error(`JSON解析失败: ${e2.message}`)
    }
  }
}

/**
 * 带重试的LLM调用
 * @param {string} prompt - 用户Prompt
 * @param {string} systemPrompt - 系统Prompt
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<object>} - 返回JSON解析后的结果
 */
const callLLMWithRetry = async (prompt, systemPrompt, maxRetries = 2) => {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await callLLM(prompt, systemPrompt, { retries: 1 })
      return result
    } catch (error) {
      lastError = error
      console.error(`第${i + 1}次调用失败:`, error.message)

      // 如果是JSON解析失败，在Prompt中强调格式要求
      if (error.message.includes('JSON解析失败') && i < maxRetries - 1) {
        prompt = prompt + '\n\n【重要】请确保输出是有效的JSON格式，不要添加任何其他内容。'
      }
    }
  }

  throw lastError
}

module.exports = {
  callLLM,
  callLLMWithRetry,
  parseJSON
}
