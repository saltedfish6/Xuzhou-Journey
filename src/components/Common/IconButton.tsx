import React from 'react'
import type { IconButtonProps } from '@/types/components'
import styles from './IconButton.module.styl'

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className = '',
  ariaLabel,
  style,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <button
      className={`${styles.iconButton} ${styles[variant]} ${styles[size]} ${className} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={style}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton
