/**
 * 质量检查器
 * 前端+云函数共用
 */

/**
 * 检查教案质量
 * @param {object} lessonPlan - 教案数据
 * @returns {{passed: boolean, errors: string[], warnings: string[]}} - 检查结果
 */
export const checkQuality = (lessonPlan) => {
  const errors = []
  const warnings = []

  // 1. 目标完整性检查
  if (!lessonPlan.objectives) {
    errors.push('缺少教学目标')
  } else {
    const { knowledge_skill, process_method, emotion_attitude } = lessonPlan.objectives
    if (!knowledge_skill || knowledge_skill.trim() === '') {
      errors.push('缺少知识与技能目标')
    }
    if (!process_method || process_method.trim() === '') {
      errors.push('缺少过程与方法目标')
    }
    if (!emotion_attitude || emotion_attitude.trim() === '') {
      errors.push('缺少情感态度与价值观目标')
    }
  }

  // 2. 重难点检查
  if (!lessonPlan.key_points || lessonPlan.key_points.length === 0) {
    warnings.push('缺少教学重点')
  }
  if (!lessonPlan.difficulties || lessonPlan.difficulties.length === 0) {
    warnings.push('缺少教学难点')
  }

  // 3. 教学过程检查
  if (!lessonPlan.process || lessonPlan.process.length === 0) {
    errors.push('缺少教学过程')
  } else {
    // 3.1 环节完整性检查
    const requiredStages = ['导入', '新授', '练习', '总结', '作业']
    const existingStages = lessonPlan.process.map(p => p.stage)
    requiredStages.forEach(stage => {
      if (!existingStages.includes(stage)) {
        errors.push(`缺少"${stage}"环节`)
      }
    })

    // 3.2 时间合理性检查
    const totalDuration = lessonPlan.total_duration || 40
    const processDuration = lessonPlan.process.reduce((sum, p) => sum + (p.duration || 0), 0)
    if (processDuration !== totalDuration) {
      errors.push(`各环节时间之和(${processDuration}分钟)不等于总时长(${totalDuration}分钟)`)
    }

    // 3.3 内容非空检查
    lessonPlan.process.forEach((stage, index) => {
      if (!stage.activity || stage.activity.trim() === '') {
        errors.push(`第${index + 1}个环节"${stage.stage}"缺少活动描述`)
      }
      if (!stage.teacher_action || stage.teacher_action.trim() === '') {
        errors.push(`第${index + 1}个环节"${stage.stage}"缺少教师活动`)
      }
      if (!stage.student_action || stage.student_action.trim() === '') {
        errors.push(`第${index + 1}个环节"${stage.stage}"缺少学生活动`)
      }
    })
  }

  // 4. 板书设计检查
  if (!lessonPlan.board_design || lessonPlan.board_design.trim() === '') {
    warnings.push('缺少板书设计')
  }

  // 5. 作业布置检查
  if (!lessonPlan.homework || lessonPlan.homework.trim() === '') {
    warnings.push('缺少作业布置')
  }

  // 6. 教学反思检查
  if (!lessonPlan.reflection_prompts || lessonPlan.reflection_prompts.length === 0) {
    warnings.push('缺少教学反思提示')
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * 检查教案质量（旧版兼容）
 * @param {object} lessonPlan - 教案数据
 * @returns {object} - 质量评估结果
 */
export const checkLessonPlanQuality = (lessonPlan) => {
  const qualityResult = checkQuality(lessonPlan)
  const issues = [
    ...qualityResult.errors.map(e => ({ type: 'error', message: e })),
    ...qualityResult.warnings.map(w => ({ type: 'warning', message: w }))
  ]

  let score = 100
  issues.forEach(issue => {
    if (issue.type === 'error') score -= 20
    if (issue.type === 'warning') score -= 10
  })
  score = Math.max(0, score)

  return {
    score,
    issues,
    level: getQualityLevel(score),
    passed: qualityResult.passed
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
  const qualityResult = checkQuality(lessonPlan)

  qualityResult.errors.forEach(error => {
    suggestions.push(`【必须修复】${error}`)
  })

  qualityResult.warnings.forEach(warning => {
    suggestions.push(`【建议优化】${warning}`)
  })

  // 额外建议
  if (!lessonPlan.objectives?.knowledge_skill?.includes('能够') &&
      !lessonPlan.objectives?.knowledge_skill?.includes('掌握') &&
      !lessonPlan.objectives?.knowledge_skill?.includes('理解')) {
    suggestions.push('【建议优化】教学目标建议使用"能够""掌握""理解"等行为动词')
  }

  const content = JSON.stringify(lessonPlan)
  if (!content.includes('生活') && !content.includes('实际')) {
    suggestions.push('【建议优化】建议结合学生的生活实际设计教学内容')
  }

  return suggestions
}

/**
 * 验证教案数据完整性
 * @param {object} lessonPlan - 教案数据
 * @returns {boolean} - 是否完整
 */
export const validateLessonPlan = (lessonPlan) => {
  const qualityResult = checkQuality(lessonPlan)
  return qualityResult.passed
}

export default {
  checkQuality,
  checkLessonPlanQuality,
  generateImprovementSuggestions,
  validateLessonPlan
}
