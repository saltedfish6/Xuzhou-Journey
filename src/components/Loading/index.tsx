import React from 'react'
import styles from './loading.module.styl'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
  type?: 'spinner' | 'dots' | 'skeleton'
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  className,
  type = 'spinner'
}) => {
  const renderSpinner = () => (
    <div className={`${styles.spinner} ${styles[size]}`}></div>
  )

  const renderDots = () => (
    <div className={`${styles.dots} ${styles[size]}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )

  const renderSkeleton = () => (
    <div className={`${styles.skeleton} ${styles[size]}`}></div>
  )

  const renderContent = () => {
    switch (type) {
      case 'dots':
        return renderDots()
      case 'skeleton':
        return renderSkeleton()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {renderContent()}
      {text && <div className={styles.text}>{text}</div>}
    </div>
  )
}

export default Loading
