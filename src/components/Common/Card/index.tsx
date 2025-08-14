import React from 'react'
import styles from './card.module.styl'

export interface CardProps {
  children: React.ReactNode
  title?: string
  extra?: React.ReactNode
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  cover?: React.ReactNode
  actions?: React.ReactNode[]
  size?: 'small' | 'default' | 'large'
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  extra,
  hoverable = false,
  bordered = true,
  loading = false,
  className = '',
  onClick,
  cover,
  actions,
  size = 'default'
}) => {
  const cardClass = [
    styles.card,
    styles[size],
    hoverable && styles.hoverable,
    bordered && styles.bordered,
    loading && styles.loading,
    onClick && styles.clickable,
    className
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    if (onClick && !loading) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && !loading && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={cardClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-disabled={loading}
    >
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>⏳</div>
        </div>
      )}

      {cover && <div className={styles.cover}>{cover}</div>}

      {(title || extra) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      )}

      <div className={styles.body}>{children}</div>

      {actions && actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <div key={index} className={styles.action}>
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Card
