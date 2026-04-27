// Prompt模板

/**
 * 生成教案的Prompt模板
 * @param {object} params - 生成参数
 * @returns {string} - 完整的Prompt
 */
export const generateLessonPlanPrompt = (params) => {
  const {
    courseName,
    objective,
    content,
    duration
  } = params

  return `你是一位经验丰富的农村教育教师，请根据以下信息为我生成一份详细的教案：

课程名称：${courseName}
教学目标：${objective}
教学内容：${content}
教学时长：${duration}分钟

请按照以下结构生成教案：
1. 教学目标
2. 教学重难点
3. 教学准备
4. 教学过程（详细的时间分配和教学活动）
5. 作业布置
6. 板书设计

要求：
- 教案要符合农村学生的认知水平和生活实际
- 教学过程要具体、可操作
- 要体现互动性和趣味性
- 语言要简洁明了，符合教学实际
- 要考虑农村学校的教学条件限制`
}

/**
 * 优化教案的Prompt模板
 * @param {string} lessonPlan - 原始教案
 * @returns {string} - 完整的Prompt
 */
export const optimizeLessonPlanPrompt = (lessonPlan) => {
  return `你是一位教育专家，请帮我优化以下教案，使其更加适合农村学校的教学实际：

${lessonPlan}

优化要求：
1. 确保教案符合农村学生的认知水平和生活实际
2. 调整教学过程，使其更加具体、可操作
3. 增加互动性和趣味性，提高学生参与度
4. 考虑农村学校的教学条件限制，提供可行的教学方案
5. 保持教案的结构完整，语言简洁明了`
}

/**
 * 评估教案质量的Prompt模板
 * @param {string} lessonPlan - 教案内容
 * @returns {string} - 完整的Prompt
 */
export const evaluateLessonPlanPrompt = (lessonPlan) => {
  return `你是一位教育评估专家，请从以下几个维度评估这份教案的质量：

${lessonPlan}

评估维度：
1. 教学目标的明确性和可达成性
2. 教学内容的合理性和针对性
3. 教学过程的逻辑性和可操作性
4. 对农村学生的适应性
5. 教学方法的多样性和有效性
6. 作业布置的合理性

请给出具体的评估意见和改进建议`
}