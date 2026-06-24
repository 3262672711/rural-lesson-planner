/**
 * 业务服务函数
 * 封装云函数调用，提供业务级别的接口
 */

import { callCloud, callCloudWithLoading } from './cloud.js'

/**
 * 生成教案
 * @param {import('./types.js').GenerateRequest} data - 生成参数
 * @returns {Promise<import('./types.js').LessonPlan>} - 返回教案数据
 */
export const generateLessonPlan = (data) => {
  return callCloudWithLoading('generatePlan', data, '正在生成教案...')
}

/**
 * 获取历史记录列表
 * @param {import('./types.js').GetHistoryParams} params - 查询参数
 * @returns {Promise<{list: import('./types.js').HistoryItem[], total: number}>} - 返回历史记录列表
 */
export const getHistory = (params = {}) => {
  return callCloud('getHistory', params)
}

/**
 * 获取历史记录详情
 * @param {string} id - 记录ID
 * @returns {Promise<import('./types.js').HistoryDetail>} - 返回详情数据
 */
export const getHistoryDetail = (id) => {
  return callCloud('getHistoryDetail', { id })
}

/**
 * 切换收藏状态
 * @param {string} id - 记录ID
 * @returns {Promise<{is_favorited: boolean}>} - 返回新的收藏状态
 */
export const toggleFavorite = (id) => {
  return callCloud('toggleFavorite', { id })
}

/**
 * 删除历史记录
 * @param {string} id - 记录ID
 * @returns {Promise<{success: boolean}>} - 返回删除结果
 */
export const deleteHistory = (id) => {
  return callCloud('deleteHistory', { id })
}

/**
 * 保存编辑内容
 * @param {string} id - 记录ID
 * @param {object} content - 编辑内容
 * @returns {Promise<{success: boolean}>} - 返回保存结果
 */
export const saveEdit = (id, content) => {
  return callCloud('saveEdit', { id, content })
}

/**
 * 导出Word文档
 * @param {string} id - 记录ID
 * @returns {Promise<{file_url: string}>} - 返回文件下载地址
 */
export const exportDocx = (id) => {
  return callCloudWithLoading('exportDocx', { id }, '正在生成Word文档...')
}

/**
 * 导出PPT文档
 * @param {string} id - 记录ID
 * @returns {Promise<{file_url: string}>} - 返回文件下载地址
 */
export const exportPptx = (id) => {
  return callCloudWithLoading('exportPptx', { id }, '正在生成PPT文档...')
}

/**
 * 获取用户设置
 * @returns {Promise<object>} - 返回用户设置
 */
export const getUserSettings = () => {
  return callCloud('getUserSettings')
}

/**
 * 更新用户设置
 * @param {object} settings - 设置内容
 * @returns {Promise<{success: boolean}>} - 返回更新结果
 */
export const updateUserSettings = (settings) => {
  return callCloud('updateUserSettings', settings)
}

export default {
  generateLessonPlan,
  getHistory,
  getHistoryDetail,
  toggleFavorite,
  deleteHistory,
  saveEdit,
  exportDocx,
  exportPptx,
  getUserSettings,
  updateUserSettings
}
