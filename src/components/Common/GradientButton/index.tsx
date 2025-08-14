import React from 'react'
import styles from './gradientButton.module.styl'

interface GradientButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warm' | 'cool'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const buttonClass = [
    styles.gradientButton,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default GradientButton
