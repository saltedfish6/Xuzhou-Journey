import React from 'react'
import styles from './button.module.styl'

export interface ButtonProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  htmlType?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  block = false,
  icon,
  onClick,
  className = '',
  htmlType = 'button',
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick?.(e)
  }

  const buttonClass = [
    styles.button,
    styles[type],
    styles[size],
    block && styles.block,
    disabled && styles.disabled,
    loading && styles.loading,
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={htmlType}
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.loadingIcon}>⏳</span>}
      {!loading && icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </button>
  )
}

export default Button
