// 云函数调用封装

/**
 * 调用云函数
 * @param {string} name - 云函数名称
 * @param {object} data - 传递给云函数的参数
 * @returns {Promise} - 返回云函数执行结果
 */
export const callCloudFunction = (name, data = {}) => {
  return new Promise((resolve, reject) => {
    uniCloud.callFunction({
      name,
      data,
      success: (res) => {
        resolve(res.result)
      },
      fail: (err) => {
        console.error('云函数调用失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 生成教案
 * @param {object} params - 生成参数
 * @returns {Promise} - 返回生成结果
 */
export const generateLessonPlan = (params) => {
  return callCloudFunction('generateLessonPlan', params)
}

/**
 * 获取历史记录
 * @returns {Promise} - 返回历史记录列表
 */
export const getHistoryList = () => {
  return callCloudFunction('getHistoryList')
}

/**
 * 保存教案到历史记录
 * @param {object} lessonPlan - 教案数据
 * @returns {Promise} - 返回保存结果
 */
export const saveToHistory = (lessonPlan) => {
  return callCloudFunction('saveToHistory', { lessonPlan })
}

/**
 * 删除历史记录
 * @param {string} id - 记录ID
 * @returns {Promise} - 返回删除结果
 */
export const deleteHistory = (id) => {
  return callCloudFunction('deleteHistory', { id })
}