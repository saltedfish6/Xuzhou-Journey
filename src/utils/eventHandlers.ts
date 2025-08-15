/**
 * 事件处理相关的工具函数
 */

/**
 * 键盘事件处理器
 * @param callback 回调函数
 * @param keys 触发的按键列表
 * @returns 键盘事件处理函数
 */
export function createKeyboardHandler(
  callback: () => void,
  keys: string[] = ['Enter', ' ']
) {
  return (e: React.KeyboardEvent) => {
    if (keys.includes(e.key)) {
      e.preventDefault()
      callback()
    }
  }
}

/**
 * 点击外部区域处理器
 * @param refs 需要监听的元素引用数组
 * @param callback 点击外部时的回调函数
 * @returns 清理函数
 */
export function createClickOutsideHandler(
  refs: React.RefObject<HTMLElement>[],
  callback: () => void
) {
  const handleClickOutside = (event: MouseEvent) => {
    const isOutside = refs.every(
      (ref) => ref.current && !ref.current.contains(event.target as Node)
    )

    if (isOutside) {
      callback()
    }
  }

  document.addEventListener('mousedown', handleClickOutside)

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}

/**
 * 表单提交处理器
 * @param onSubmit 提交回调函数
 * @param validation 验证函数（可选）
 * @returns 表单提交事件处理函数
 */
export function createFormSubmitHandler(
  onSubmit: (data: FormData) => void | Promise<void>,
  validation?: (data: FormData) => boolean | string
) {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    // 验证表单
    if (validation) {
      const validationResult = validation(formData)
      if (validationResult !== true) {
        console.warn('表单验证失败:', validationResult)
        return
      }
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }
}

/**
 * 文件上传处理器
 * @param onFileSelect 文件选择回调函数
 * @param options 配置选项
 * @returns 文件选择处理函数
 */
export function createFileUploadHandler(
  onFileSelect: (files: FileList) => void,
  options: {
    accept?: string
    multiple?: boolean
    maxSize?: number // 字节
  } = {}
) {
  const { accept, multiple = false, maxSize } = options

  return () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept || '*'
    input.multiple = multiple

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files || files.length === 0) return

      // 检查文件大小
      if (maxSize) {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            console.warn(`文件 ${files[i].name} 超过大小限制`)
            return
          }
        }
      }

      onFileSelect(files)
    }

    input.click()
  }
}

/**
 * 滚动事件处理器
 * @param callback 滚动回调函数
 * @param options 配置选项
 * @returns 滚动事件处理函数
 */
export function createScrollHandler(
  callback: (scrollInfo: {
    scrollTop: number
    scrollHeight: number
    clientHeight: number
    isNearBottom: boolean
  }) => void,
  options: {
    threshold?: number // 距离底部多少像素时触发
    throttleDelay?: number // 节流延迟
  } = {}
) {
  const { threshold = 100, throttleDelay = 100 } = options

  let lastCallTime = 0

  return (e: React.UIEvent<HTMLElement>) => {
    const now = Date.now()
    if (now - lastCallTime < throttleDelay) return
    lastCallTime = now

    const target = e.currentTarget
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold

    callback({
      scrollTop,
      scrollHeight,
      clientHeight,
      isNearBottom
    })
  }
}

/**
 * 拖拽处理器
 * @param onDrop 拖拽完成回调函数
 * @param options 配置选项
 * @returns 拖拽事件处理函数对象
 */
export function createDragHandler(
  onDrop: (files: FileList) => void,
  options: {
    accept?: string[]
    maxFiles?: number
  } = {}
) {
  const { accept, maxFiles } = options

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    // 检查文件数量
    if (maxFiles && files.length > maxFiles) {
      console.warn(`最多只能上传 ${maxFiles} 个文件`)
      return
    }

    // 检查文件类型
    if (accept && accept.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const isAccepted = accept.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          return file.type.match(type)
        })

        if (!isAccepted) {
          console.warn(`文件类型 ${file.type} 不被支持`)
          return
        }
      }
    }

    onDrop(files)
  }

  return {
    onDragOver: handleDragOver,
    onDrop: handleDrop
  }
}
