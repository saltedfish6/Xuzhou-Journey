export interface Message {
  /** 消息唯一标识 */
  id: string
  /** 消息角色 */
  role: 'user' | 'assistant'
  /** 消息内容 */
  content: string
  /** 消息状态 */
  status?: 'sending' | 'sent' | 'error'
  /** 时间戳 */
  timestamp?: number
  /** 是否为流式响应 */
  streaming?: boolean
}

export interface ChatSession {
  /** 会话ID */
  id: string
  /** 会话标题 */
  title: string
  /** 消息列表 */
  messages: Message[]
  /** 创建时间 */
  createdAt: number
  /** 更新时间 */
  updatedAt: number
}

export interface AIConfig {
  /** API 端点 */
  apiEndpoint: string
  /** API 密钥 */
  apiKey: string
  /** 模型名称 */
  model: string
  /** 最大 token 数 */
  maxTokens?: number
  /** 温度参数 */
  temperature?: number
}
