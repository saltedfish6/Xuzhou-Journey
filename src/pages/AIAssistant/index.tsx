import { useState, useRef, useEffect } from 'react'
import {
  Button,
  Input,
  ActionSheet,
  Dialog,
  type TextAreaInstance
} from 'react-vant'
import { Toast } from '@/components/Toast'
import { UserO, ChatO, Arrow, Delete, Edit } from '@react-vant/icons'
import { useTitle } from '@/hooks/useTitle'
import { useAIStore } from '@/store/useAIStore'
import { useItineraryStore } from '@/store/useItineraryStore'
import type { ChatMessage } from '@/store/useAIStore'
import styles from './ai.module.styl'

const AIAssistant = () => {
  useTitle('AI 旅行助手')

  const {
    currentSession,
    sessions,
    loading,
    error,
    currentModel,
    availableModels,
    config,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    sendMessage,
    regenerateResponse,
    clearCurrentSession,
    switchModel,
    parseItineraryFromResponse,
    clearError
  } = useAIStore()

  const { importFromAI } = useItineraryStore()

  const [inputText, setInputText] = useState('')
  const [showSessionList, setShowSessionList] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const chatAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<TextAreaInstance>(null)

  // 快捷问题建议
  const quickQuestions = [
    '帮我规划3天杭州行程',
    '推荐北京必去景点',
    '上海有什么特色美食？',
    '适合情侣的旅行地推荐',
    '制定一周云南深度游计划',
    '推荐性价比高的住宿'
  ]

  // 自动滚动到底部
  const scrollToBottom = (delay = 100, extraScroll = 50) => {
    if (chatAreaRef.current) {
      setTimeout(() => {
        if (chatAreaRef.current) {
          const scrollHeight = chatAreaRef.current.scrollHeight
          chatAreaRef.current.scrollTop = scrollHeight + extraScroll
        }
      }, delay)
    }
  }

  useEffect(() => {
    // 消息更新时滚动到底部
    scrollToBottom()

    // 确保在内容渲染完成后再次滚动（处理图片和复杂内容）
    setTimeout(() => {
      scrollToBottom(300, 100)
    }, 500)

    // 再次延迟滚动，确保所有内容都已渲染
    setTimeout(() => {
      scrollToBottom(800, 150)
    }, 1000)
  }, [currentSession?.messages])

  useEffect(() => {
    if (error) {
      Toast.fail(error)
      clearError()
    }
  }, [error, clearError])

  // 发送消息
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim()

    if (!text) {
      Toast.info('请输入消息内容')
      return
    }

    // 如果没有当前会话，创建新会话
    if (!currentSession) {
      createSession('新对话')
    }

    setInputText('')
    await sendMessage(text)
  }

  // 创建新会话
  const handleCreateSession = () => {
    createSession('新对话')
    setInputText('')
    Toast.success('已创建新对话')
  }

  // 删除会话
  const handleDeleteSession = (sessionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    Dialog.confirm({
      title: '确认删除',
      message: '确定要删除这个对话吗？',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
      .then(() => {
        deleteSession(sessionId)
        Toast.success('对话已删除')
      })
      .catch(() => {
        // 用户取消
      })
  }

  // 重命名会话
  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId)
    setEditingTitle(currentTitle)
  }

  const confirmRename = () => {
    if (editingSessionId && editingTitle.trim()) {
      renameSession(editingSessionId, editingTitle.trim())
      Toast.success('重命名成功')
    }
    setEditingSessionId(null)
    setEditingTitle('')
  }

  // 导入行程
  const handleImportItinerary = async (message: ChatMessage) => {
    try {
      const itineraryData = parseItineraryFromResponse(message.content)
      if (itineraryData.items.length > 0) {
        await importFromAI(itineraryData)
        Toast.success('行程已导入到行程规划')
      } else {
        Toast.info('未检测到有效的行程信息')
      }
    } catch {
      Toast.fail('导入行程失败')
    }
  }

  // 分享对话
  const handleShareSession = () => {
    if (!currentSession) return

    const shareText = currentSession.messages
      .map((msg) => `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}`)
      .join('\n\n')

    if (navigator.share) {
      navigator.share({
        title: currentSession.title,
        text: shareText
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
      Toast.success('对话内容已复制到剪贴板')
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) {
      // 1分钟内
      return '刚刚'
    } else if (diff < 3600000) {
      // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      // 24小时内
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  // 检测是否包含行程信息
  const containsItinerary = (content: string) => {
    const itineraryKeywords = [
      '行程',
      '景点',
      '游览',
      '旅游',
      '参观',
      '游玩',
      '第一天',
      '第二天',
      '第三天',
      '第1天',
      '第2天',
      '第3天',
      'Day 1',
      'Day 2',
      'Day 3',
      'day1',
      'day2',
      'day3',
      '上午',
      '下午',
      '晚上',
      '早上',
      '推荐路线',
      '旅行计划',
      '出行安排'
    ]

    // 检查是否包含任意一个关键词
    return itineraryKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 模型选择操作
  // const modelActions = availableModels.map((model) => ({
  //   name: model
  // }))

  return (
    <main className={styles.container} role="main" aria-label="AI旅行助手">
      {/* 顶部标题栏 */}
      <header className={styles.header} role="banner">
        <div className={styles.headerLeft}>
          <Button
            size="small"
            onClick={() => setShowSessionList(true)}
            className={styles.sessionButton}
            aria-label="打开会话列表"
          >
            ☰
          </Button>
          <h1 className={styles.headerTitle}>
            <ChatO className={styles.headerIcon} aria-hidden="true" />
            <span>{currentSession?.title || 'AI 旅行助手'}</span>
          </h1>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.headerStatus} role="status" aria-live="polite">
            <span
              className={
                loading ? styles.streamingIndicator : styles.onlineIndicator
              }
              aria-hidden="true"
            ></span>
            {loading ? '回复中' : '在线'}
          </div>
          <Button
            size="small"
            onClick={() => setShowSettings(true)}
            className={styles.settingButton}
            aria-label="打开设置"
          >
            ⚙️
          </Button>
        </div>
      </header>

      {/* 聊天区域 */}
      <section
        className={styles.chatArea}
        ref={chatAreaRef}
        role="log"
        aria-label="对话记录"
        aria-live="polite"
        tabIndex={0}
      >
        {!currentSession || currentSession.messages.length === 0 ? (
          // 欢迎界面
          <div
            className={styles.welcomeArea}
            role="region"
            aria-label="欢迎界面"
          >
            <div className={styles.welcomeIcon} aria-hidden="true">
              <ChatO />
            </div>
            <h2 className={styles.welcomeTitle}>AI 旅行助手</h2>
            <p className={styles.welcomeDesc}>
              我是您的专业旅行顾问，可以帮您规划行程、推荐景点、解答旅行问题
            </p>

            {/* 快捷问题 */}
            <section className={styles.quickQuestions} aria-label="快捷问题">
              <h3 className={styles.quickTitle}>💡 试试这些问题</h3>
              <ul className={styles.quickList} role="list">
                {quickQuestions.map((question, index) => (
                  <li key={index} role="listitem">
                    <button
                      className={styles.quickItem}
                      onClick={() => handleSendMessage(question)}
                      aria-label={`发送问题: ${question}`}
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          // 消息列表
          currentSession.messages.map((message) => (
            <article key={message.id} className={styles.messageWrapper}>
              <div
                className={
                  message.role === 'user'
                    ? styles.messageRight
                    : styles.messageLeft
                }
                role={message.role === 'user' ? 'user' : 'assistant'}
              >
                <div className={styles.messageAvatar} aria-hidden="true">
                  {message.role === 'assistant' ? (
                    <div className={styles.aiAvatar}>
                      <ChatO />
                    </div>
                  ) : (
                    <div className={styles.userAvatar}>
                      <UserO />
                    </div>
                  )}
                </div>

                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>
                      {message.content}
                      {loading &&
                        message ===
                          currentSession.messages[
                            currentSession.messages.length - 1
                          ] && (
                          <span className={styles.cursor} aria-hidden="true">
                            |
                          </span>
                        )}
                    </p>
                  </div>

                  <footer className={styles.messageFooter}>
                    <time
                      className={styles.messageTime}
                      dateTime={new Date(message.timestamp).toISOString()}
                    >
                      {formatTime(message.timestamp)}
                    </time>

                    {message.role === 'assistant' && (
                      <div
                        className={styles.messageActions}
                        role="group"
                        aria-label="消息操作"
                      >
                        <Button
                          size="mini"
                          onClick={() => regenerateResponse(message.id)}
                          disabled={loading}
                          className={styles.actionButton}
                          aria-label="重新生成回复"
                        >
                          <span className={styles.refreshIcon}>↻</span>
                        </Button>

                        <Button
                          size="mini"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(message.content)
                              Toast.success('内容已复制到剪贴板')
                            } else {
                              Toast.info('浏览器不支持复制功能')
                            }
                          }}
                          className={styles.actionButton}
                          aria-label="复制回复内容"
                        >
                          <span className={styles.copyIcon}>⧉</span>
                        </Button>

                        {containsItinerary(message.content) && (
                          <Button
                            size="mini"
                            onClick={() => handleImportItinerary(message)}
                            className={styles.actionButton}
                            aria-label="导入行程到行程规划"
                          >
                            <span className={styles.importIcon}>⤓</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </footer>
                </div>
              </div>
            </article>
          ))
        )}

        {/* 加载指示器 */}
        {loading && (
          <div
            className={styles.messageWrapper}
            role="status"
            aria-label="AI正在回复"
          >
            <div className={styles.messageLeft}>
              <div className={styles.messageAvatar} aria-hidden="true">
                <div className={styles.aiAvatar}>
                  <ChatO />
                </div>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator} aria-label="正在输入">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 输入区域 */}
      <footer className={styles.inputArea} role="contentinfo">
        <div className={styles.inputWrapper}>
          <form
            className={styles.inputContainer}
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            role="form"
            aria-label="发送消息"
          >
            <Input.TextArea
              ref={inputRef}
              value={inputText}
              onChange={setInputText}
              placeholder="输入消息..."
              className={styles.input}
              disabled={loading}
              aria-label="消息输入框"
              aria-describedby="send-button"
              autoSize
              rows={1}
            />

            <Button
              id="send-button"
              disabled={loading || !inputText.trim()}
              type="primary"
              className={styles.sendButton}
              onClick={() => handleSendMessage()}
              icon={<Arrow aria-hidden="true" />}
              aria-label="发送消息"
            />
          </form>
        </div>
      </footer>

      {/* 会话列表弹窗 */}
      <ActionSheet
        visible={showSessionList}
        onClose={() => setShowSessionList(false)}
        title="对话管理"
        duration={300}
        actions={[
          { name: '新建对话' },
          { name: '清空当前对话' },
          { name: '分享对话' }
        ]}
        onSelect={(_, index) => {
          setShowSessionList(false)

          switch (index) {
            case 0:
              handleCreateSession()
              break
            case 1:
              if (currentSession) {
                Dialog.confirm({
                  title: '确认清空',
                  message: '确定要清空当前对话吗？',
                  confirmButtonText: '确认',
                  cancelButtonText: '取消'
                })
                  .then(() => {
                    clearCurrentSession()
                    Toast.success('对话已清空')
                  })
                  .catch(() => {
                    // 用户取消操作
                  })
              } else {
                Toast.info('没有当前对话可清空')
              }
              break
            case 2:
              handleShareSession()
              break
          }
        }}
      >
        <nav
          className={styles.sessionList}
          role="navigation"
          aria-label="会话列表"
        >
          {sessions.map((session) => (
            <article
              key={session.id}
              className={`${styles.sessionItem} ${
                session.id === currentSession?.id ? styles.activeSession : ''
              }`}
              onClick={() => {
                switchSession(session.id)
                setShowSessionList(false)
              }}
              role="button"
              aria-label={`切换到会话: ${session.title}`}
            >
              <div className={styles.sessionInfo}>
                <h4 className={styles.sessionTitle}>{session.title}</h4>
                <p className={styles.sessionMeta}>
                  {session.messages.length} 条消息 ·{' '}
                  <time dateTime={new Date(session.updatedAt).toISOString()}>
                    {formatTime(session.updatedAt)}
                  </time>
                </p>
              </div>

              <div
                className={styles.sessionActions}
                role="group"
                aria-label="会话操作"
              >
                <Button
                  size="mini"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameSession(session.id, session.title)
                  }}
                  aria-label={`重命名会话: ${session.title}`}
                >
                  <Edit aria-hidden="true" />
                </Button>
                <Button
                  size="mini"
                  onClick={(e) => {
                    handleDeleteSession(session.id, e)
                  }}
                  aria-label={`删除会话: ${session.title}`}
                >
                  <Delete aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))}
        </nav>
      </ActionSheet>

      {/* 设置弹窗 */}
      <ActionSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        title="AI 设置"
        duration={300}
        cancelText="取消"
        actions={[
          {
            name: `切换模型 (当前: ${currentModel})`,
            callback: () => {
              // 延迟打开新弹窗，确保动画平滑
              setTimeout(() => {
                setShowModelSelector(true)
              }, 300)
            }
          },
          {
            name: `创造性: ${config.temperature} (数值越高越有创意)`,
            disabled: true
          },
          { name: `回复长度: ${config.maxTokens} 字符`, disabled: true }
        ]}
      />

      {/* 模型选择器 */}
      <ActionSheet
        visible={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        title="选择AI模型"
        duration={300}
        actions={availableModels.map((model) => ({
          name: model === currentModel ? `${model} (当前)` : model,
          callback: () => {
            switchModel(model)
            Toast.success(`已切换到 ${model}`)
          }
        }))}
      />

      {/* 重命名对话框 */}
      <Dialog
        visible={editingSessionId !== null}
        title="重命名对话"
        showCancelButton
        onConfirm={confirmRename}
        onCancel={() => {
          setEditingSessionId(null)
          setEditingTitle('')
        }}
      >
        <Input
          value={editingTitle}
          onChange={setEditingTitle}
          placeholder="输入新的对话标题"
          aria-label="新的对话标题"
        />
      </Dialog>
    </main>
  )
}

export default AIAssistant
