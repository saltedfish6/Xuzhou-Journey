import React from 'react'
import Button from '../Button'
import styles from './empty.module.styl'

export interface EmptyProps {
  icon?: React.ReactNode | string
  title?: string
  description?: string
  action?: {
    text: string
    onClick: () => void
    type?: 'primary' | 'secondary'
    icon?: React.ReactNode
  }
  className?: string
  size?: 'small' | 'medium' | 'large'
}

const Empty: React.FC<EmptyProps> = ({
  icon = '📭',
  title = '暂无数据',
  description,
  action,
  className = '',
  size = 'medium'
}) => {
  const emptyClass = [styles.empty, styles[size], className]
    .filter(Boolean)
    .join(' ')

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <div className={styles.iconEmoji}>{icon}</div>
    }
    return <div className={styles.iconCustom}>{icon}</div>
  }

  return (
    <div className={emptyClass} role="status" aria-label="空状态">
      <div className={styles.content}>
        <div className={styles.icon}>{renderIcon()}</div>

        <h3 className={styles.title}>{title}</h3>

        {description && <p className={styles.description}>{description}</p>}

        {action && (
          <div className={styles.action}>
            <Button
              type={action.type || 'primary'}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Empty
