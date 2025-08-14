import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './backHeader.module.styl'

interface BackHeaderProps {
  /** 页面标题 */
  title: string
  /** 右侧操作按钮 */
  rightAction?: React.ReactNode
  /** 自定义返回处理 */
  onBack?: () => void
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 额外的 CSS 类名 */
  className?: string
}

const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  rightAction,
  onBack,
  showBack = true,
  className = ''
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header className={`${styles.header} ${className}`} role="banner">
      <div className={styles.container}>
        {showBack && (
          <button
            className={styles.backButton}
            onClick={handleBack}
            aria-label="返回上一页"
            type="button"
          >
            <svg
              className={styles.backIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <h1 className={styles.title} id="page-title">
          {title}
        </h1>

        {rightAction && (
          <div className={styles.rightAction} role="toolbar">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  )
}

export default React.memo(BackHeader)
