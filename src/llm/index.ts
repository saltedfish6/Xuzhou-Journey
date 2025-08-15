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

// 解析AI响应中的行程信息
export const parseItineraryFromAI = (content: string) => {
  const lines = content.split('\n')
  const itinerary = {
    title: '新行程',
    destination: '',
    days: 1,
    items: [] as any[]
  }

  let currentDay = 0
  let currentDayItems: any[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 匹配天数
    const dayMatch = trimmedLine.match(/第(\d+)天|Day\s*(\d+)/i)
    if (dayMatch) {
      if (currentDayItems.length > 0) {
        // 保存前一天的项目
        itinerary.items.push(...currentDayItems)
        currentDayItems = []
      }
      currentDay = parseInt(dayMatch[1] || dayMatch[2])
      itinerary.days = Math.max(itinerary.days, currentDay)
      continue
    }

    // 匹配时间和活动
    const timeMatch = trimmedLine.match(
      /(\d{1,2}:\d{2}|\d{1,2}点|上午|下午|晚上).*?[:：]\s*(.+)/
    )
    if (timeMatch && currentDay > 0) {
      const timeStr = timeMatch[1]
      const activity = timeMatch[2]

      currentDayItems.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: activity,
        address: '',
        latitude: 0,
        longitude: 0,
        type: 'attraction' as const,
        duration: 120, // 默认2小时
        startTime: timeStr.includes(':') ? timeStr : '',
        day: currentDay,
        notes: ''
      })
    }

    // 匹配目的地
    if (trimmedLine.includes('目的地') || trimmedLine.includes('地点')) {
      const destMatch = trimmedLine.match(/[:：]\s*(.+)/)
      if (destMatch) {
        itinerary.destination = destMatch[1]
      }
    }
  }

  // 添加最后一天的项目
  if (currentDayItems.length > 0) {
    itinerary.items.push(...currentDayItems)
  }

  return itinerary
}
