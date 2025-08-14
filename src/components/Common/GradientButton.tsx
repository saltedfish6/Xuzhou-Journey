import React from 'react'
import type { GradientButtonProps } from '@/types/components'
import styles from './GradientButton.module.styl'

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
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
      type={type}
      className={`${styles.gradientButton} ${styles[variant]} ${styles[size]} ${className} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}

export default GradientButton
