// 通用的 mock 数据和工具函数

// 通用响应状态码
export const ResponseCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const

// 通用响应消息
export const ResponseMessage = {
  SUCCESS: 'success',
  FAILED: 'failed',
  UNAUTHORIZED: '未授权访问',
  NOT_FOUND: '资源不存在',
  INTERNAL_ERROR: '服务器内部错误',
  INVALID_PARAMS: '参数错误'
} as const

// 模拟网络延迟
export const mockDelay = (
  min: number = 300,
  max: number = 1000
): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 生成随机时间戳
export const generateTimestamp = (daysAgo: number = 30): string => {
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * daysAgo)
  const timestamp = now - randomDays * 24 * 60 * 60 * 1000
  return new Date(timestamp).toISOString()
}

// 格式化时间显示
export const formatTimeAgo = (timestamp: string): string => {
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else {
    return new Date(timestamp).toLocaleDateString()
  }
}

// 生成随机数字范围
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 从数组中随机选择元素
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// 从数组中随机选择多个元素
export const randomChoices = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 生成分页数据
export const generatePaginatedResponse = <T>(
  data: T[],
  page: number,
  pageSize: number,
  total?: number
) => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)
  const actualTotal = total || data.length

  return {
    list: paginatedData,
    total: actualTotal,
    page,
    pageSize,
    totalPages: Math.ceil(actualTotal / pageSize),
    hasMore: endIndex < actualTotal
  }
}

// 模拟API响应包装器
export const createMockResponse = <T>(
  data: T,
  code: number = ResponseCode.SUCCESS,
  message: string = ResponseMessage.SUCCESS
) => {
  return {
    code,
    data,
    message,
    timestamp: Date.now()
  }
}

// 模拟错误响应
export const createErrorResponse = (
  code: number,
  message: string,
  details?: any
) => {
  return {
    code,
    message,
    details,
    timestamp: Date.now()
  }
}

// 常用的中文城市列表
export const chineseCities = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '西安',
  '南京',
  '武汉',
  '重庆',
  '苏州',
  '天津',
  '青岛',
  '大连',
  '厦门',
  '三亚',
  '丽江',
  '桂林',
  '张家界',
  '九寨沟',
  '黄山',
  '泰山',
  '华山',
  '峨眉山',
  '普陀山',
  '五台山',
  '武当山',
  '庐山',
  '雁荡山',
  '长沙',
  '郑州',
  '济南',
  '福州',
  '昆明',
  '贵阳',
  '兰州',
  '银川',
  '西宁',
  '乌鲁木齐',
  '哈尔滨',
  '长春',
  '沈阳',
  '石家庄',
  '太原',
  '呼和浩特',
  '南昌',
  '合肥',
  '海口',
  '拉萨'
]

// 常用的旅行标签
export const travelTags = [
  '旅行',
  '攻略',
  '摄影',
  '美食',
  '文化',
  '自然',
  '历史',
  '建筑',
  '民俗',
  '体验',
  '推荐',
  '分享',
  '探索',
  '发现',
  '冒险',
  '休闲',
  '度假',
  '购物',
  '娱乐',
  '运动',
  '艺术',
  '音乐',
  '节庆',
  '温泉',
  '海滩',
  '山川',
  '古镇',
  '都市',
  '乡村',
  '边境'
]

// 常用的用户昵称前缀
export const nicknamePrefix = [
  '旅行达人',
  '摄影师',
  '背包客',
  '美食探索者',
  '文艺青年',
  '户外运动爱好者',
  '历史文化学者',
  '自然风光摄影师',
  '城市探索者',
  '民俗文化研究者',
  '建筑艺术爱好者',
  '美食评论家',
  '旅游博主',
  '风景摄影师',
  '文化传播者'
]

// 生成随机用户昵称
export const generateNickname = (): string => {
  const prefix = randomChoice(nicknamePrefix)
  const suffix = randomChoice([
    '小王',
    '小李',
    '小张',
    '小刘',
    '小陈',
    '小赵',
    '小孙',
    '小周'
  ])
  return `${prefix}${suffix}`
}

// 生成随机图片URL
export const generateImageUrl = (
  width: number = 300,
  height: number = 200,
  seed?: number
): string => {
  const randomSeed = seed || Math.floor(Math.random() * 1000)
  return '/placeholder.svg'
}

export default {
  ResponseCode,
  ResponseMessage,
  mockDelay,
  generateId,
  generateTimestamp,
  formatTimeAgo,
  randomInRange,
  randomChoice,
  randomChoices,
  generatePaginatedResponse,
  createMockResponse,
  createErrorResponse,
  chineseCities,
  travelTags,
  nicknamePrefix,
  generateNickname,
  generateImageUrl
}
