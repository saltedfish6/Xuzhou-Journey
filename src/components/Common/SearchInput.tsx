import React, { useState, useRef, useEffect } from 'react'
import type { SearchInputProps } from '@/types/components'
import styles from './SearchInput.module.styl'

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '搜索...',
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'medium',
  showSearchIcon = true,
  autoFocus = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (!disabled) {
      onSearch?.(inputValue)
    }
  }

  const handleFocus = () => {
    onFocus?.()
  }

  const handleBlur = () => {
    onBlur?.()
  }

  return (
    <div
      className={`${styles.searchInput} ${styles[variant]} ${styles[size]} ${className} ${disabled ? styles.disabled : ''}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
        {...props}
      />
      {showSearchIcon && (
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={disabled}
          aria-label="搜索"
        >
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput
