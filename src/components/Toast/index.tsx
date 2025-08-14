import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import mitt from 'mitt'
import styles from './toast.module.styl'

// 事件类型定义
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface ToastConfig {
  type: ToastType
  message: string
  duration?: number
  onClose?: () => void
}

interface ToastItem extends ToastConfig {
  id: string
  visible: boolean
}

// 创建事件总线
const toastEmitter = mitt<{
  show: ToastConfig
  hide: string
  clear: void
}>()

// Toast 容器组件
const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    // 监听显示事件
    const handleShow = (config: ToastConfig) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newToast: ToastItem = {
        ...config,
        id,
        visible: true,
        duration: config.duration ?? (config.type === 'loading' ? 0 : 3000)
      }

      setToasts((prev) => [...prev, newToast])

      // 自动隐藏（loading类型不自动隐藏）
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          hideToast(id)
        }, newToast.duration)
      }
    }

    // 监听隐藏事件
    const handleHide = (id: string) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: false } : toast
        )
      )

      // 动画结束后移除
      setTimeout(() => {
        setToasts((prev) => {
          const toast = prev.find((t) => t.id === id)
          if (toast?.onClose) {
            toast.onClose()
          }
          return prev.filter((t) => t.id !== id)
        })
      }, 300)
    }

    // 监听清空事件
    const handleClear = () => {
      setToasts((prev) => prev.map((toast) => ({ ...toast, visible: false })))

      setTimeout(() => {
        setToasts([])
      }, 300)
    }

    toastEmitter.on('show', handleShow)
    toastEmitter.on('hide', handleHide)
    toastEmitter.on('clear', handleClear)

    return () => {
      toastEmitter.off('show', handleShow)
      toastEmitter.off('hide', handleHide)
      toastEmitter.off('clear', handleClear)
    }
  }, [])

  const hideToast = (id: string) => {
    toastEmitter.emit('hide', id)
  }

  if (toasts.length === 0) return null

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]} ${
            toast.visible ? styles.show : styles.hide
          }`}
          onClick={() => hideToast(toast.id)}
        >
          <div className={styles.toastContent}>
            {toast.type === 'loading' && <div className={styles.spinner}></div>}
            {toast.type === 'success' && <div className={styles.icon}>✓</div>}
            {toast.type === 'error' && <div className={styles.icon}>✕</div>}
            {toast.type === 'warning' && <div className={styles.icon}>⚠</div>}
            {toast.type === 'info' && <div className={styles.icon}>ℹ</div>}
            <span className={styles.message}>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}

// 支持对象参数的类型
interface ToastOptions {
  message: string
  duration?: number
  onClose?: () => void
}

// Toast API
export const Toast = {
  success: (
    messageOrOptions: string | ToastOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'success',
        message: messageOrOptions,
        duration,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'success',
        message: messageOrOptions.message,
        duration: messageOrOptions.duration,
        onClose: messageOrOptions.onClose
      })
    }
  },

  error: (
    messageOrOptions: string | ToastOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'error',
        message: messageOrOptions,
        duration,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'error',
        message: messageOrOptions.message,
        duration: messageOrOptions.duration,
        onClose: messageOrOptions.onClose
      })
    }
  },

  // 添加 fail 方法，作为 error 的别名
  fail: (
    messageOrOptions: string | ToastOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'error',
        message: messageOrOptions,
        duration,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'error',
        message: messageOrOptions.message,
        duration: messageOrOptions.duration,
        onClose: messageOrOptions.onClose
      })
    }
  },

  warning: (
    messageOrOptions: string | ToastOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'warning',
        message: messageOrOptions,
        duration,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'warning',
        message: messageOrOptions.message,
        duration: messageOrOptions.duration,
        onClose: messageOrOptions.onClose
      })
    }
  },

  info: (
    messageOrOptions: string | ToastOptions,
    duration?: number,
    onClose?: () => void
  ) => {
    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'info',
        message: messageOrOptions,
        duration,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'info',
        message: messageOrOptions.message,
        duration: messageOrOptions.duration,
        onClose: messageOrOptions.onClose
      })
    }
  },

  loading: (
    messageOrOptions: string | ToastOptions = '加载中...',
    onClose?: () => void
  ) => {
    // 先清除所有现有的loading toast
    toastEmitter.emit('clear')

    if (typeof messageOrOptions === 'string') {
      toastEmitter.emit('show', {
        type: 'loading',
        message: messageOrOptions,
        duration: 0,
        onClose
      })
    } else {
      toastEmitter.emit('show', {
        type: 'loading',
        message: messageOrOptions.message || '加载中...',
        duration: messageOrOptions.duration || 0,
        onClose: messageOrOptions.onClose
      })
    }

    // 返回一个函数来隐藏这个特定的toast
    return () => {
      // 清除所有loading类型的toast
      toastEmitter.emit('clear')
    }
  },

  hide: (id: string) => {
    toastEmitter.emit('hide', id)
  },

  clear: () => {
    toastEmitter.emit('clear')
  }
}

export { ToastContainer }
export default ToastContainer
