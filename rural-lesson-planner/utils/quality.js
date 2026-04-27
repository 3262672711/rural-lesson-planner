// 质量检查器

/**
 * 检查教案质量
 * @param {object} lessonPlan - 教案数据
 * @returns {object} - 质量评估结果
 */
export const checkLessonPlanQuality = (lessonPlan) => {
  const issues = []
  
  // 检查教学目标
  if (!lessonPlan.objective || lessonPlan.objective.length < 20) {
    issues.push({
      type: 'warning',
      message: '教学目标过于简单，建议详细描述'
    })
  }
  
  // 检查教学过程
  if (!lessonPlan.process || lessonPlan.process.length < 100) {
    issues.push({
      type: 'error',
      message: '教学过程过于简略，建议详细设计'
    })
  }
  
  // 检查时间分配
  if (!lessonPlan.duration || isNaN(lessonPlan.duration)) {
    issues.push({
      type: 'error',
      message: '请设置合理的教学时长'
    })
  }
  
  // 检查作业布置
  if (!lessonPlan.homework) {
    issues.push({
      type: 'warning',
      message: '建议添加作业布置环节'
    })
  }
  
  // 检查农村适应性
  const ruralKeywords = ['农村', '生活实际', '当地', '乡土']
  const hasRuralContent = ruralKeywords.some(keyword => 
    JSON.stringify(lessonPlan).includes(keyword)
  )
  
  if (!hasRuralContent) {
    issues.push({
      type: 'suggestion',
      message: '建议结合农村学生的生活实际设计教学内容'
    })
  }
  
  // 计算质量分数
  let score = 100
  issues.forEach(issue => {
    if (issue.type === 'error') score -= 20
    if (issue.type === 'warning') score -= 10
    if (issue.type === 'suggestion') score -= 5
  })
  
  score = Math.max(0, score)
  
  return {
    score,
    issues,
    level: getQualityLevel(score)
  }
}

/**
 * 获取质量等级
 * @param {number} score - 质量分数
 * @returns {string} - 质量等级
 */
const getQualityLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 75) return '良好'
  if (score >= 60) return '合格'
  return '需要改进'
}

/**
 * 生成改进建议
 * @param {object} lessonPlan - 教案数据
 * @returns {string[]} - 改进建议列表
 */
export const generateImprovementSuggestions = (lessonPlan) => {
  const suggestions = []
  
  if (!lessonPlan.objective) {
    suggestions.push('明确教学目标，确保目标具体可测量')
  }
  
  if (!lessonPlan.process) {
    suggestions.push('详细设计教学过程，包括具体的教学活动和时间分配')
  }
  
  if (!lessonPlan.homework) {
    suggestions.push('添加适合农村学生的作业任务')
  }
  
  suggestions.push('结合农村学生的生活实际，增加乡土元素')
  suggestions.push('考虑农村学校的教学条件，设计可行的教学方案')
  suggestions.push('增加互动性和趣味性，提高学生参与度')
  
  return suggestions
}

/**
 * 验证教案数据完整性
 * @param {object} lessonPlan - 教案数据
 * @returns {boolean} - 是否完整
 */
export const validateLessonPlan = (lessonPlan) => {
  const requiredFields = ['courseName', 'objective', 'content', 'duration', 'process']
  
  for (const field of requiredFields) {
    if (!lessonPlan[field]) {
      return false
    }
  }
  
  return true
}