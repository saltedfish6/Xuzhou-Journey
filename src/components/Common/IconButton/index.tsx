import React from 'react'
import styles from './iconButton.module.styl'

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className = '',
  ariaLabel
}) => {
  const buttonClass = [
    styles.iconButton,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  )
}

export default IconButton
