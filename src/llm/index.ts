/**
 * chat 聊天
 *
 */
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions'
const KIMI_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions'
// console.log(process.env.VITE_DEEPSEEK_API_KEY, '------');

export const chat = async (
  messages: Message[],
  api_url = DEEPSEEK_CHAT_API_URL,
  api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
  model = 'deepseek-chat'
) => {
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false
      })
    })
    const data = await response.json()
    return {
      code: 0,
      data: {
        role: 'assistant',
        content: data.choices[0].message.content
      }
    }
  } catch {
    return {
      code: 1,
      msg: '出错了...'
    }
  }
}

export const kimiChat = async (messages: Message[]) => {
  const res = await chat(
    messages,
    KIMI_CHAT_API_URL,
    import.meta.env.VITE_KIMI_API_KEY,
    'moonshot-v1-32k'
  )
  return res
}
