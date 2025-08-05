import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuggestList, getHotList } from '@/api/search'
import { debounce } from '@/utils'
import useSearchStore from '@/store/useSearchStore'
import styles from './home-search-bar.module.styl'

const HomeSearchBar: React.FC = () => {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [hotKeywords, setHotKeywords] = useState<
    { id: string; city: string }[]
  >([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const { addSearchHistory } = useSearchStore()

  // 获取热门搜索关键词
  useEffect(() => {
    const fetchHotKeywords = async () => {
      try {
        const res = await getHotList()
        if (res.data) {
          setHotKeywords(res.data)
        }
      } catch (error) {
        console.error('获取热门搜索失败:', error)
      }
    }

    fetchHotKeywords()
  }, [])

  // 防抖处理搜索建议
  const fetchSuggestions = useMemo(() => {
    return debounce(async (keyword: string) => {
      if (!keyword.trim()) {
        setSuggestions([])
        return
      }

      try {
        const res = await getSuggestList(keyword)
        setSuggestions(res.data?.list || [])
      } catch (error) {
        console.error('获取搜索建议失败:', error)
        setSuggestions([])
      }
    }, 300)
  }, [])

  // 输入变化时获取搜索建议
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    fetchSuggestions(value)
  }

  // 处理搜索
  const handleSearch = (keyword: string = inputValue) => {
    if (!keyword.trim()) return

    // 添加到搜索历史
    addSearchHistory(keyword)

    // 跳转到搜索结果页
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
  }

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSearch(suggestion)
  }

  // 处理热门关键词点击
  const handleHotKeywordClick = (keyword: string) => {
    setInputValue(keyword)
    handleSearch(keyword)
  }

  // 处理点击搜索框
  const handleSearchBarClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // 处理点击搜索按钮
  const handleSearchButtonClick = () => {
    handleSearch()
  }

  // 处理点击外部关闭搜索面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar} onClick={handleSearchBarClick}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="搜索目的地、攻略..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearchButtonClick}
        >
          搜索
        </button>
      </div>

      {/* 搜索面板：包含搜索建议和热门搜索 */}
      {isFocused && (
        <div className={styles.searchPanel} ref={searchPanelRef}>
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className={styles.suggestionsContainer}>
              <h3 className={styles.sectionTitle}>搜索建议</h3>
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={`suggestion-${index}`}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg
                      className={styles.suggestionIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 热门搜索 */}
          {hotKeywords.length > 0 && (
            <div className={styles.hotSearchContainer}>
              <h3 className={styles.sectionTitle}>热门搜索</h3>
              <div className={styles.hotKeywordsList}>
                {hotKeywords.map((item) => (
                  <div
                    key={item.id}
                    className={styles.hotKeywordItem}
                    onClick={() => handleHotKeywordClick(item.city)}
                  >
                    {item.city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomeSearchBar
