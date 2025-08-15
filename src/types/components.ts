import React from 'react'

// 按钮组件相关类型
export interface ButtonProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  htmlType?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  block?: boolean
}

export interface GradientButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  style?: React.CSSProperties
}

export interface IconButtonProps {
  icon: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'glass'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  ariaLabel?: string
  tooltip?: string
  style?: React.CSSProperties
}

// 输入组件相关类型
export interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  variant?: 'default' | 'glass' | 'minimal'
  size?: 'small' | 'medium' | 'large'
  showSearchIcon?: boolean
  autoFocus?: boolean
}

// 卡片组件相关类型
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

// 空状态组件相关类型
export interface EmptyProps {
  description?: string
  icon?: React.ReactNode | string
  action?: {
    text: string
    onClick: () => void
    type?: 'primary' | 'secondary'
  }
  className?: string
}

// 头部组件相关类型
export interface BackHeaderProps {
  title?: string
  onBack?: () => void
  extra?: React.ReactNode
  className?: string
}

// 通用组件Props联合类型
export type CommonComponentProps =
  | ButtonProps
  | GradientButtonProps
  | IconButtonProps
  | SearchInputProps
  | CardProps
  | EmptyProps
  | BackHeaderProps

// 组件尺寸类型
export type ComponentSize = 'small' | 'medium' | 'large'

// 组件变体类型
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'text'

// 组件状态类型
export interface ComponentState {
  loading?: boolean
  disabled?: boolean
  active?: boolean
  focused?: boolean
}
