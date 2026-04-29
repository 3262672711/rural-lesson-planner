/**
 * 数据类型定义
 * 使用 JSDoc 注释定义数据结构
 */

/**
 * @typedef {Object} GenerateRequest - 生成教案请求参数
 * @property {string} subject - 学科
 * @property {string} grade - 年级
 * @property {string} textbook - 教材版本
 * @property {string} topic - 课题
 * @property {string} [classProfile] - 班级学情
 * @property {string} [teachingStyle] - 教学风格
 * @property {number} [lessonCount] - 课时数
 */

/**
 * @typedef {Object} Metadata - 教案元数据
 * @property {string} subject - 学科
 * @property {string} grade - 年级
 * @property {string} textbook - 教材版本
 * @property {string} topic - 课题
 * @property {number} duration - 总时长（分钟）
 */

/**
 * @typedef {Object} Objectives - 教学目标
 * @property {string} knowledge_skill - 知识与技能
 * @property {string} process_method - 过程与方法
 * @property {string} emotion_attitude - 情感态度与价值观
 */

/**
 * @typedef {Object} KeyPoint - 教学重点
 * @property {string} point - 重点内容
 * @property {string} strategy - 突破策略
 * @property {string} common_mistakes - 常见误区
 */

/**
 * @typedef {Object} Difficulty - 教学难点
 * @property {string} point - 难点内容
 * @property {string} breakthrough - 突破方法
 */

/**
 * @typedef {Object} ProcessStage - 教学过程环节
 * @property {string} stage - 环节名称
 * @property {number} duration - 时长（分钟）
 * @property {string} activity - 活动描述
 * @property {string} teacher_action - 教师活动
 * @property {string} student_action - 学生活动
 * @property {string} design_intent - 设计意图
 */

/**
 * @typedef {Object} LessonPlan - 教案数据
 * @property {Metadata} metadata - 元数据
 * @property {Objectives} objectives - 教学目标
 * @property {KeyPoint[]} key_points - 教学重点
 * @property {Difficulty[]} difficulties - 教学难点
 * @property {ProcessStage[]} process - 教学过程
 * @property {string} board_design - 板书设计
 * @property {string} homework - 作业布置
 * @property {string[]} reflection_prompts - 教学反思提示
 */

/**
 * @typedef {Object} SlideItem - 课件页
 * @property {number} page - 页码
 * @property {string} title - 标题
 * @property {string} [subtitle] - 副标题
 * @property {string} layout - 布局类型
 * @property {string[]} content - 内容列表
 * @property {string} [image_suggestion] - 图片建议
 * @property {string} [notes] - 备注
 */

/**
 * @typedef {Object} Exercise - 练习题
 * @property {string} type - 题型
 * @property {string} question - 题目
 * @property {string[]} [options] - 选项（选择题）
 * @property {string} answer - 答案
 * @property {string} explanation - 解析
 * @property {string} knowledge_tag - 知识点标签
 */

/**
 * @typedef {Object} Exercises - 练习题集合
 * @property {Exercise[]} basic - 基础题
 * @property {Exercise[]} advanced - 提高题
 * @property {Exercise[]} extension - 拓展题
 */

/**
 * @typedef {Object} KnowledgeNode - 知识节点
 * @property {string} name - 知识点名称
 * @property {string} description - 描述
 * @property {KnowledgeNode[]} [children] - 子节点
 */

/**
 * @typedef {Object} KnowledgeGraph - 知识图谱
 * @property {string[]} prerequisite - 前置知识
 * @property {string[]} current - 本课内容
 * @property {string[]} following - 后续知识
 * @property {string[]} cross_subject - 跨学科关联
 */

/**
 * @typedef {Object} HistoryItem - 历史记录项
 * @property {string} _id - 记录ID
 * @property {string} subject - 学科
 * @property {string} grade - 年级
 * @property {string} textbook - 教材版本
 * @property {string} topic - 课题
 * @property {string} created_at - 创建时间
 * @property {boolean} is_favorited - 是否收藏
 * @property {number} duration - 总时长
 */

/**
 * @typedef {Object} HistoryDetail - 历史记录详情
 * @property {string} _id - 记录ID
 * @property {string} subject - 学科
 * @property {string} grade - 年级
 * @property {string} textbook - 教材版本
 * @property {string} topic - 课题
 * @property {string} created_at - 创建时间
 * @property {boolean} is_favorited - 是否收藏
 * @property {LessonPlan} lesson_plan - 教案内容
 * @property {SlideItem[]} slides - 课件大纲
 * @property {Exercises} exercises - 练习题
 * @property {KnowledgeGraph} knowledge_graph - 知识图谱
 */

/**
 * @typedef {Object} ApiResponse - API响应格式
 * @property {number} code - 状态码（0成功，其他失败）
 * @property {*} data - 返回数据
 * @property {string} message - 提示信息
 */

/**
 * @typedef {Object} GetHistoryParams - 获取历史记录参数
 * @property {string} [subject] - 学科筛选
 * @property {string} [grade] - 年级筛选
 * @property {number} [page] - 页码
 * @property {number} [page_size] - 每页数量
 */

export default {}
