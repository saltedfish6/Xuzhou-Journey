// import { useState } from 'react'
// import { Toast } from 'react-vant'
import { Close } from '@react-vant/icons'
import styles from './avatar-preview.module.styl'

interface AvatarPreviewProps {
  visible: boolean
  onClose: () => void
  avatarUrl?: string
  onUploadNew: () => void
  onCreateAI: () => void
  onGetFrame: () => void
}

const AvatarPreview = ({
  visible,
  onClose,
  avatarUrl,
  onUploadNew,
  onCreateAI,
  onGetFrame
}: AvatarPreviewProps) => {
  if (!visible) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className={styles.closeBtn} onClick={onClose}>
          <Close />
        </button>

        {/* 头像预览 */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="头像预览" />
            ) : (
              <div className={styles.defaultAvatar}>
                <span>头像</span>
              </div>
            )}
          </div>
        </div>

        {/* 操作面板 */}
        <div className={styles.actionPanel}>
          <div className={styles.actionItem} onClick={onUploadNew}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="7,10 12,15 17,10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className={styles.actionText}>上传新头像</span>
          </div>

          <div className={styles.actionItem} onClick={onCreateAI}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className={styles.actionText}>制作AI头像</span>
            <div className={styles.aiIcon}>
              <span>🤖</span>
            </div>
          </div>

          <div className={styles.actionItem} onClick={onGetFrame}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className={styles.actionText}>获取头像挂件</span>
            <div className={styles.frameIcon}>
              <span>⚙️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvatarPreview
