/**
 * 云函数调用封装
 * 统一请求/响应格式，统一错误处理
 */

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传递给云函数的参数
 * @param {object} options - 可选配置
 * @param {number} options.timeout - 超时时间（毫秒），默认60秒
 * @param {boolean} options.showError - 是否显示错误提示，默认true
 * @returns {Promise} - 返回云函数执行结果
 */
export const callCloud = (name, data = {}, options = {}) => {
  const { timeout = 60000, showError = true } = options

  return new Promise((resolve, reject) => {
    // 检查网络状态
    uni.getNetworkType({
      success: (networkRes) => {
        if (networkRes.networkType === 'none') {
          if (showError) {
            uni.showToast({
              title: '网络连接失败，请检查网络',
              icon: 'none',
              duration: 2000
            })
          }
          reject({ code: -1, message: '网络连接失败', data: null })
          return
        }

        // 调用云函数
        uniCloud.callFunction({
          name,
          data,
          success: (res) => {
            const result = res.result || {}
            
            // 统一响应格式处理
            if (result.code === 0) {
              resolve(result.data)
            } else {
              // 业务错误
              const errorMsg = result.message || '请求失败，请稍后重试'
              if (showError) {
                uni.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
              reject(result)
            }
          },
          fail: (err) => {
            // 云函数调用失败
            console.error('云函数调用失败:', err)
            let errorMsg = '网络连接失败，请检查网络'
            
            // 根据错误类型返回友好提示
            if (err.errMsg) {
              if (err.errMsg.includes('timeout')) {
                errorMsg = '请求超时，请稍后重试'
              } else if (err.errMsg.includes('not found')) {
                errorMsg = '云函数不存在'
              }
            }
            
            if (showError) {
              uni.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
            reject({ code: -1, message: errorMsg, data: null, error: err })
          }
        })
      },
      fail: () => {
        // 获取网络状态失败，仍然尝试调用
        uniCloud.callFunction({
          name,
          data,
          success: (res) => {
            const result = res.result || {}
            if (result.code === 0) {
              resolve(result.data)
            } else {
              const errorMsg = result.message || '请求失败，请稍后重试'
              if (showError) {
                uni.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
              reject(result)
            }
          },
          fail: (err) => {
            console.error('云函数调用失败:', err)
            if (showError) {
              uni.showToast({
                title: '网络连接失败，请检查网络',
                icon: 'none',
                duration: 2000
              })
            }
            reject({ code: -1, message: '网络连接失败', data: null, error: err })
          }
        })
      }
    })
  })
}

/**
 * 带加载提示的云函数调用
 * @param {string} name - 云函数名称
 * @param {object} data - 传递给云函数的参数
 * @param {string} loadingText - 加载提示文字
 * @returns {Promise} - 返回云函数执行结果
 */
export const callCloudWithLoading = (name, data = {}, loadingText = '加载中...') => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: loadingText,
      mask: true
    })

    callCloud(name, data, { showError: true })
      .then((res) => {
        uni.hideLoading()
        resolve(res)
      })
      .catch((err) => {
        uni.hideLoading()
        reject(err)
      })
  })
}

/**
 * 批量调用云函数
 * @param {Array} requests - 请求列表 [{ name, data }]
 * @returns {Promise} - 返回所有结果
 */
export const callCloudBatch = (requests = []) => {
  return Promise.all(
    requests.map((req) => callCloud(req.name, req.data, { showError: false }))
  )
}

export default {
  callCloud,
  callCloudWithLoading,
  callCloudBatch
}
