import { useState } from 'react'
import { Button, Input, Loading, Toast } from 'react-vant'
import { UserO, ChatO } from '@react-vant/icons'
import useTitle from '@/hooks/useTitle'
import { kimiChat } from '@/llm'
import styles from './ai.module.styl'

const Aiassistant = () => {
  useTitle('旅游智能客服')
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  // 数据驱动界面
  // 静态界面
  const [messages, setMessages] = useState([
    // {
    //   id: 2,
    //   content: 'hello~',
    //   role: 'user'
    // },
    {
      id: 1,
      content: '你好，我是你的旅行小助手',
      role: 'assistant'
    }
  ])

  const handleChat = async () => {
    if (text.trim() === '') {
      Toast.info({ message: '内容不能为空' })
      return
    }

    const currentText = text.trim()
    setText('') // 立即清空输入框
    setIsSending(true)

    try {
      // 1. 先添加用户消息
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: currentText
      }

      // 2. 更新消息列表，添加用户消息
      setMessages((prev) => [...prev, userMessage])

      // 3. 准备上下文消息（包含历史对话）
      const contextMessages = messages.slice(-5).map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content
      }))

      // 添加当前用户消息到上下文
      contextMessages.push({
        role: 'user',
        content: currentText
      })

      // 4. 调用 AI
      const response = await kimiChat(contextMessages)

      // 5. 处理 AI 响应
      if (response.code === 0 && response.data) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.content
        }

        // 6. 添加 AI 回复到消息列表
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(response.msg || 'AI 回复失败')
      }
    } catch (error) {
      console.error('聊天错误:', error)
      Toast.fail({ message: 'AI 回复失败，请重试' })

      // 发生错误时，恢复输入框内容
      setText(currentText)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === 'user' ? styles.messageRight : styles.messageLeft
              }
            >
              {msg.role === 'assistant' ? <ChatO /> : <UserO />}
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputArea}>
        <Input
          value={text}
          onChange={(value) => setText(value)}
          placeholder="请输入消息"
          className={`flex-1 ${styles.input}`}
        />
        <Button disabled={isSending} type="primary" onClick={handleChat}>
          发送
        </Button>
      </div>
      {isSending && (
        <div className="fixed-loading">
          <Loading type="ball" />
        </div>
      )}
    </>
  )
}

export default Aiassistant
