import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { kimiChat, parseItineraryFromAI } from '@/llm/index'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  type?: 'text' | 'itinerary' | 'location' | 'image'
  metadata?: {
    // 行程相关数据
    itinerary?: {
      title: string
      destination: string
      days: number
      items: any[]
    }
    // 位置相关数据
    location?: {
      name: string
      latitude: number
      longitude: number
      address: string
    }
    // 图片相关数据
    image?: {
      url: string
      description: string
    }
    // 其他元数据
    [key: string]: any
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  model: string
  isActive: boolean
}

interface AIState {
  // 当前会话
  currentSession: ChatSession | null

  // 所有会话
  sessions: ChatSession[]

  // 当前使用的模型
  currentModel: string

  // 可用的模型列表
  availableModels: string[]

  // 加载状态
  loading: boolean

  // 错误信息
  error: string | null

  // AI配置
  config: {
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
}

interface AIActions {
  // 创建新会话
  createSession: (title?: string) => string

  // 切换会话
  switchSession: (sessionId: string) => void

  // 删除会话
  deleteSession: (sessionId: string) => void

  // 重命名会话
  renameSession: (sessionId: string, title: string) => void

  // 发送消息
  sendMessage: (content: string, type?: ChatMessage['type']) => Promise<void>

  // 添加消息（新增）
  addMessage: (message: ChatMessage) => void

  // 更新消息（新增）
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void

  // 获取消息列表（新增）
  messages: ChatMessage[]

  // 重新生成回复
  regenerateResponse: (messageId: string) => Promise<void>

  // 停止生成
  stopGeneration: () => void

  // 清空当前会话
  clearCurrentSession: () => void

  // 导出会话
  exportSession: (sessionId: string) => string

  // 导入会话
  importSession: (data: string) => void

  // 切换模型
  switchModel: (model: string) => void

  // 更新配置
  updateConfig: (config: Partial<AIState['config']>) => void

  // 解析AI响应为行程
  parseItineraryFromResponse: (content: string) => any

  // 清除错误
  clearError: () => void

  // 设置加载状态
  setLoading: (loading: boolean) => void
}

type AIStore = AIState & AIActions

// 生成唯一ID
const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// 默认系统提示词
const DEFAULT_SYSTEM_PROMPT = `你是一个专业的旅行助手，擅长为用户规划旅行行程。你的回答应该：
1. 准确、实用、有针对性
2. 包含具体的地点、时间、交通方式建议
3. 考虑用户的预算和偏好
4. 提供当地的文化背景和注意事项
5. 格式清晰，便于理解和执行

当用户询问行程规划时，请按以下格式回复：
- 目的地概况
- 建议游玩天数
- 每日详细行程
- 交通建议
- 住宿推荐
- 美食推荐
- 注意事项`

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentSession: null,
      sessions: [],
      currentModel: 'moonshot-v1-8k',
      availableModels: [
        'moonshot-v1-8k',
        'moonshot-v1-32k',
        'moonshot-v1-128k',
        'deepseek-chat',
        'deepseek-coder'
      ],
      loading: false,
      error: null,
      config: {
        temperature: 0.7,
        maxTokens: 2000,
        systemPrompt: DEFAULT_SYSTEM_PROMPT
      },

      // 创建新会话
      createSession: (title = '新对话') => {
        const sessionId = generateId()
        const newSession: ChatSession = {
          id: sessionId,
          title,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().currentModel,
          isActive: true
        }

        const { sessions } = get()
        // 将其他会话设为非活跃状态
        const updatedSessions = sessions.map((session) => ({
          ...session,
          isActive: false
        }))

        set({
          sessions: [...updatedSessions, newSession],
          currentSession: newSession
        })

        return sessionId
      },

      // 切换会话
      switchSession: (sessionId) => {
        const { sessions } = get()
        const targetSession = sessions.find(
          (session) => session.id === sessionId
        )

        if (targetSession) {
          const updatedSessions = sessions.map((session) => ({
            ...session,
            isActive: session.id === sessionId
          }))

          set({
            sessions: updatedSessions,
            currentSession: targetSession
          })
        }
      },

      // 删除会话
      deleteSession: (sessionId) => {
        const { sessions, currentSession } = get()
        const filteredSessions = sessions.filter(
          (session) => session.id !== sessionId
        )

        // 如果删除的是当前会话，切换到最新的会话
        let newCurrentSession = currentSession
        if (currentSession?.id === sessionId) {
          newCurrentSession =
            filteredSessions.length > 0
              ? filteredSessions[filteredSessions.length - 1]
              : null
          if (newCurrentSession) {
            newCurrentSession.isActive = true
          }
        }

        set({
          sessions: filteredSessions,
          currentSession: newCurrentSession
        })
      },

      // 重命名会话
      renameSession: (sessionId, title) => {
        const { sessions, currentSession } = get()
        const updatedSessions = sessions.map((session) =>
          session.id === sessionId
            ? { ...session, title, updatedAt: Date.now() }
            : session
        )

        const updatedCurrentSession =
          currentSession?.id === sessionId
            ? { ...currentSession, title, updatedAt: Date.now() }
            : currentSession

        set({
          sessions: updatedSessions,
          currentSession: updatedCurrentSession
        })
      },

      // 发送消息
      sendMessage: async (content, type = 'text') => {
        const { currentSession, config } = get()

        // 如果没有当前会话，创建一个新会话
        let session = currentSession
        if (!session) {
          get().createSession('新对话')
          session = get().currentSession!
        }

        // 创建用户消息
        const userMessage: ChatMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: Date.now(),
          type
        }

        // 更新会话，添加用户消息
        const updatedMessages = [...session.messages, userMessage]
        const updatedSession = {
          ...session,
          messages: updatedMessages,
          updatedAt: Date.now()
        }

        set({
          currentSession: updatedSession,
          sessions: get().sessions.map((s) =>
            s.id === session!.id ? updatedSession : s
          ),
          loading: true,
          error: null
        })

        try {
          // 准备发送给AI的消息
          const messagesToSend = [
            { role: 'system' as const, content: config.systemPrompt },
            ...updatedMessages.map((msg) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))
          ]

          // 调用Kimi API
          const response = await kimiChat(messagesToSend)

          if (response.code === 0 && response.data) {
            // 创建AI回复消息
            const aiMessage: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: response.data.content,
              timestamp: Date.now(),
              type: 'text'
            }

            // 更新会话，添加AI回复
            const finalMessages = [...updatedMessages, aiMessage]
            const finalSession = {
              ...updatedSession,
              messages: finalMessages,
              updatedAt: Date.now()
            }

            set({
              currentSession: finalSession,
              sessions: get().sessions.map((s) =>
                s.id === session!.id ? finalSession : s
              ),
              loading: false
            })
          } else {
            set({
              error: response.msg || 'AI回复失败',
              loading: false
            })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '发送消息失败',
            loading: false
          })
        }
      },

      // 重新生成回复
      regenerateResponse: async (messageId) => {
        const { currentSession, config } = get()
        if (!currentSession) return

        // 找到要重新生成的消息
        const messageIndex = currentSession.messages.findIndex(
          (msg) => msg.id === messageId
        )
        if (
          messageIndex === -1 ||
          currentSession.messages[messageIndex].role !== 'assistant'
        )
          return

        // 移除该消息及之后的所有消息
        const messagesBeforeRegenerate = currentSession.messages.slice(
          0,
          messageIndex
        )

        const sessionBeforeRegenerate = {
          ...currentSession,
          messages: messagesBeforeRegenerate,
          updatedAt: Date.now()
        }

        set({
          currentSession: sessionBeforeRegenerate,
          sessions: get().sessions.map((s) =>
            s.id === currentSession.id ? sessionBeforeRegenerate : s
          ),
          loading: true,
          error: null
        })

        try {
          // 准备发送给AI的消息
          const messagesToSend = [
            { role: 'system' as const, content: config.systemPrompt },
            ...messagesBeforeRegenerate.map((msg) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))
          ]

          // 调用Kimi API重新生成
          const response = await kimiChat(messagesToSend)

          if (response.code === 0 && response.data) {
            // 创建新的AI回复消息
            const newAiMessage: ChatMessage = {
              id: generateId(),
              role: 'assistant',
              content: response.data.content,
              timestamp: Date.now(),
              type: 'text'
            }

            // 更新会话，添加新的AI回复
            const finalMessages = [...messagesBeforeRegenerate, newAiMessage]
            const finalSession = {
              ...currentSession,
              messages: finalMessages,
              updatedAt: Date.now()
            }

            set({
              currentSession: finalSession,
              sessions: get().sessions.map((s) =>
                s.id === currentSession.id ? finalSession : s
              ),
              loading: false
            })
          } else {
            set({
              error: response.msg || '重新生成失败',
              loading: false
            })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '重新生成失败',
            loading: false
          })
        }
      },

      // 停止生成
      stopGeneration: () => {
        set({ loading: false })
      },

      // 清空当前会话
      clearCurrentSession: () => {
        const { currentSession, sessions } = get()
        if (!currentSession) return

        const clearedSession = {
          ...currentSession,
          messages: [],
          updatedAt: Date.now()
        }

        const updatedSessions = sessions.map((s) =>
          s.id === currentSession.id ? clearedSession : s
        )

        set({
          currentSession: clearedSession,
          sessions: updatedSessions
        })
      },

      // 导出会话
      exportSession: (sessionId) => {
        const { sessions } = get()
        const session = sessions.find((s) => s.id === sessionId)
        if (!session) return ''

        return JSON.stringify(session, null, 2)
      },

      // 导入会话
      importSession: (data) => {
        try {
          const session: ChatSession = JSON.parse(data)
          session.id = generateId() // 生成新ID避免冲突
          session.isActive = false

          set({
            sessions: [...get().sessions, session]
          })
        } catch (error) {
          set({
            error: '导入会话失败，数据格式不正确'
          })
        }
      },

      // 切换模型
      switchModel: (model) => {
        set({ currentModel: model })
      },

      // 更新配置
      updateConfig: (newConfig) => {
        set({
          config: {
            ...get().config,
            ...newConfig
          }
        })
      },

      // 解析AI响应为行程
      parseItineraryFromResponse: (content) => {
        return parseItineraryFromAI(content)
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 添加消息
      addMessage: (message) => {
        const { currentSession, sessions } = get()
        if (!currentSession) return

        const updatedMessages = [...currentSession.messages, message]
        const updatedSession = {
          ...currentSession,
          messages: updatedMessages,
          updatedAt: Date.now()
        }

        set({
          currentSession: updatedSession,
          sessions: sessions.map((s) =>
            s.id === currentSession.id ? updatedSession : s
          )
        })
      },

      // 更新消息
      updateMessage: (messageId, updates) => {
        const { currentSession, sessions } = get()
        if (!currentSession) return

        const updatedMessages = currentSession.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
        const updatedSession = {
          ...currentSession,
          messages: updatedMessages,
          updatedAt: Date.now()
        }

        set({
          currentSession: updatedSession,
          sessions: sessions.map((s) =>
            s.id === currentSession.id ? updatedSession : s
          )
        })
      },

      // 获取当前消息列表
      get messages() {
        return get().currentSession?.messages || []
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ loading })
      }
    }),
    {
      name: 'ai-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
        currentModel: state.currentModel,
        config: state.config
      })
    }
  )
)
