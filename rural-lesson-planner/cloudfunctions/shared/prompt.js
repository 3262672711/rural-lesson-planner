/**
 * Prompt模板（云函数版本）
 * 与前端共用相同的Prompt模板
 */

/**
 * 系统Prompt - 角色设定
 */
const SYSTEM_PROMPT = `你是一位有20年乡村小学教学经验的特级教师。你熟悉人教版、部编版、北师大版等主流教材的教学内容和编排逻辑。

你的教学风格注重：
1. 联系学生生活实际，用贴近乡村生活的例子辅助教学
2. 注重基础知识的扎实掌握，循序渐进
3. 设计丰富的课堂活动，让学生在操作和体验中学习
4. 关注学困生，提供分层教学策略

你必须严格按照指定的JSON格式输出，确保内容准确、专业、可落地。`

/**
 * Step 1 - 生成教学目标和重难点
 */
const generateObjectivesPrompt = (params) => {
  const { subject, grade, textbook, topic, classProfile } = params

  return `请为以下课程设计教学目标和重难点：

【课程信息】
- 学科：${subject}
- 年级：${grade}
- 教材版本：${textbook}
- 课题：${topic}
- 班级学情：${classProfile || '无特殊说明'}

【输出要求】
请严格按以下JSON格式输出，不要添加任何其他内容：

{
  "objectives": {
    "knowledge_skill": "知识与技能目标（具体、可检测，使用'能够''掌握''理解'等行为动词）",
    "process_method": "过程与方法目标（描述学生通过什么活动、用什么方法学习）",
    "emotion_attitude": "情感态度与价值观目标（培养什么情感、态度或价值观）"
  },
  "key_points": [
    {
      "point": "教学重点描述",
      "strategy": "突破策略（具体操作步骤，联系乡村生活实际）",
      "common_mistakes": ["常见误区1", "常见误区2"]
    }
  ],
  "difficulties": [
    {
      "point": "教学难点描述",
      "breakthrough": "突破方法（具体操作步骤，考虑农村教学条件）"
    }
  ],
  "total_duration": 40
}

【注意事项】
1. 教学目标要符合${grade}学生的认知水平
2. 重点一般2-3个，难点一般1-2个
3. 突破策略要具体可操作，适合农村学校条件
4. 常见误区要基于教学经验，真实反映学生可能出现的错误`
}

/**
 * Step 2 - 设计教学过程
 */
const generateProcessPrompt = (step1Output, params) => {
  const { classProfile, teachingStyle } = params

  return `基于以下教学目标和重难点，设计完整的教学过程：

【教学目标和重难点】
${JSON.stringify(step1Output, null, 2)}

【教学条件】
- 班级学情：${classProfile || '无特殊说明'}
- 教学风格：${teachingStyle || '互动探究式'}
- 总时长：${step1Output.total_duration}分钟

【输出要求】
请严格按以下JSON格式输出，不要添加任何其他内容：

{
  "process": [
    {
      "stage": "导入",
      "duration": 5,
      "activity": "活动描述（用乡村生活实例引入）",
      "teacher_action": "教师具体行为（说什么、做什么、展示什么）",
      "student_action": "学生具体行为（听、看、说、做）",
      "design_intent": "设计意图（为什么要这样设计）"
    },
    {
      "stage": "新授",
      "duration": 15,
      "activity": "活动描述",
      "teacher_action": "教师具体行为",
      "student_action": "学生具体行为",
      "design_intent": "设计意图"
    },
    {
      "stage": "练习",
      "duration": 12,
      "activity": "活动描述",
      "teacher_action": "教师具体行为",
      "student_action": "学生具体行为",
      "design_intent": "设计意图"
    },
    {
      "stage": "总结",
      "duration": 5,
      "activity": "活动描述",
      "teacher_action": "教师具体行为",
      "student_action": "学生具体行为",
      "design_intent": "设计意图"
    },
    {
      "stage": "作业",
      "duration": 3,
      "activity": "布置作业",
      "teacher_action": "教师具体行为",
      "student_action": "学生具体行为",
      "design_intent": "设计意图"
    }
  ],
  "board_design": "板书设计（简洁明了，突出重点，用文字描述布局）",
  "homework": "作业布置（分层：必做题+选做题，联系生活实际）",
  "reflection_prompts": ["教学反思问题1", "教学反思问题2", "教学反思问题3"]
}

【注意事项】
1. 各环节duration之和必须等于${step1Output.total_duration}分钟
2. 必须包含导入、新授、练习、总结、作业五个环节
3. 导入环节要用乡村生活实例引入，激发学生兴趣
4. 教师活动和学生活动要具体，可直接用于教学
5. 设计意图要说明每个环节的教学价值
6. 板书设计要简洁，适合农村教室黑板条件
7. 作业要分层，必做题巩固基础，选做题拓展提升`
}

/**
 * Step 3 - 生成练习题
 */
const generateExercisesPrompt = (step1Output, params) => {
  const { subject, grade, topic } = params

  return `基于以下教学目标，设计配套练习题：

【教学目标】
${JSON.stringify(step1Output.objectives, null, 2)}

【课程信息】
- 学科：${subject}
- 年级：${grade}
- 课题：${topic}

【输出要求】
请严格按以下JSON格式输出，不要添加任何其他内容：

{
  "basic": [
    {
      "type": "填空题或选择题",
      "question": "题目内容",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": "正确答案",
      "explanation": "解析说明",
      "knowledge_tag": "知识点标签"
    }
  ],
  "intermediate": [
    {
      "type": "简答题或计算题",
      "question": "题目内容",
      "answer": "参考答案",
      "explanation": "解析说明",
      "knowledge_tag": "知识点标签"
    }
  ],
  "advanced": [
    {
      "type": "应用题或探究题",
      "question": "题目内容（联系乡村生活实际）",
      "answer": "参考答案",
      "explanation": "解析说明",
      "knowledge_tag": "知识点标签"
    }
  ]
}

【注意事项】
1. basic（基础题）：2-3题，考查基本概念和基础知识
2. intermediate（提高题）：2题，考查知识应用能力
3. advanced（拓展题）：1题，考查综合应用能力，联系乡村生活实际
4. 题目难度要符合${grade}学生水平
5. 选择题必须有options字段，其他题型不需要
6. 解析要详细，帮助学生理解解题思路`
}

/**
 * Step 4 - 生成课件大纲
 */
const generateSlidesPrompt = (lessonPlan) => {
  return `基于以下教案，生成PPT课件大纲：

${JSON.stringify(lessonPlan, null, 2)}

要求：
1. 封面页：课题名称 + 教材版本 + 年级
2. 教学目标页：列出三维教学目标
3. 教学过程页：按教案的每个教学环节生成1-3页
   - 每页包含标题、要点列表（不超过5个要点）
   - 标注建议的呈现方式（layout: title/image_text/text_list/comparison/summary）
   - 添加教师备注（notes字段，作为演讲者备注）
4. 练习页：展示2-3道典型练习题
5. 总结页：本课要点回顾
6. 作业页：展示分层作业

请严格按以下JSON格式输出：
{
  "slides": [
    {
      "page": 1,
      "title": "页面标题",
      "subtitle": "副标题（可选）",
      "layout": "布局类型（title/image_text/text_list/comparison/summary）",
      "content": ["要点1", "要点2", "要点3"],
      "image_suggestion": "配图建议描述（可选）",
      "notes": "教师备注/参考话术"
    }
  ]
}`
}

/**
 * Step 5 - 生成知识图谱
 */
const generateKnowledgeGraphPrompt = (step1Output, params) => {
  const { subject, grade, topic } = params

  return `基于以下教学内容，构建知识图谱：

【教学目标】
${JSON.stringify(step1Output.objectives, null, 2)}

【课程信息】
- 学科：${subject}
- 年级：${grade}
- 课题：${topic}

【输出要求】
请严格按以下JSON格式输出，不要添加任何其他内容：

{
  "prerequisite": ["前置知识1", "前置知识2", "前置知识3"],
  "current": ["本课知识点1", "本课知识点2", "本课知识点3"],
  "following": ["后续知识1", "后续知识2"],
  "cross_subject": [
    "语文：相关阅读材料",
    "科学：相关实验或现象",
    "美术：相关创作活动"
  ]
}

【注意事项】
1. prerequisite：学习本课之前需要掌握的知识
2. current：本课的核心知识点
3. following：本课学习后将要学习的知识
4. cross_subject：与其他学科的联系
5. 每类知识2-4个即可
6. 知识点要具体，便于教师把握教学脉络`
}

module.exports = {
  SYSTEM_PROMPT,
  generateObjectivesPrompt,
  generateProcessPrompt,
  generateExercisesPrompt,
  generateSlidesPrompt,
  generateKnowledgeGraphPrompt
}
