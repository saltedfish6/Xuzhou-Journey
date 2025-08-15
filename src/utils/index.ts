/**
 * 工具函数集合
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined = undefined

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 移动端优化的防抖函数
 * 针对移动端输入特性优化，支持输入完成检测
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param options 配置选项
 * @returns 防抖后的函数
 */
export function mobileDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 800,
  options: {
    minLength?: number // 最小输入长度才触发
    maxDelay?: number // 最大延迟时间
  } = {}
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined = undefined
  let lastInputTime = 0
  const { minLength = 1, maxDelay = 1500 } = options

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const inputValue = args[0] as string

    clearTimeout(timeoutId)
    lastInputTime = now

    // 如果输入长度不足，不触发搜索
    if (inputValue.length < minLength) {
      return
    }

    // 动态调整延迟时间：输入越长，延迟越短
    const dynamicDelay = Math.max(
      delay - inputValue.length * 50, // 每个字符减少50ms延迟
      300 // 最小延迟300ms
    )

    timeoutId = window.setTimeout(() => {
      // 确保在最大延迟时间内执行
      if (now - lastInputTime <= maxDelay) {
        func.apply(this, args)
      }
    }, dynamicDelay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(this, args)
    }
  }
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | number | string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID字符串
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }
  return obj
}

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 设置本地存储
   * @param key 键名
   * @param value 值
   */
  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error:', error)
    }
  },

  /**
   * 获取本地存储
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 存储的值或默认值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : (defaultValue ?? null)
    } catch (error) {
      console.error('localStorage get error:', error)
      return defaultValue ?? null
    }
  },

  /**
   * 删除本地存储
   * @param key 键名
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage remove error:', error)
    }
  },

  /**
   * 清空本地存储
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}

/**
 * URL参数解析
 * @param url URL字符串，默认为当前页面URL
 * @returns 参数对象
 */
export function parseUrlParams(
  url: string = window.location.href
): Record<string, string> {
  const params: Record<string, string> = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

/**
 * 检查是否为移动端
 * @returns 是否为移动端
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * 图片预加载
 * @param src 图片地址
 * @returns Promise
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean>
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}
