import {
  memo,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import { ArrowLeft, Close, Search } from '@react-vant/icons'
import styles from './searchbox.module.styl'
import { debounce } from '@/utils'

interface SearchBoxProps {
  handleQuery: (query: string) => void
}

interface SearchBoxRef {
  updateInput: (value: string) => void
}

const SearchBox = forwardRef<SearchBoxRef, SearchBoxProps>((props, ref) => {
  const [query, setQuery] = useState('')
  const { handleQuery } = props
  const queryRef = useRef<HTMLInputElement>(null)

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    updateInput: (value: string) => {
      setQuery(value)
      if (queryRef.current) {
        queryRef.current.value = value
      }
    }
  }))

  // 创建防抖函数，包含handleQuery依赖
  const handleQueryDebonce = useMemo(() => {
    return debounce((searchQuery: string) => {
      handleQuery(searchQuery)
    }, 500)
  }, [handleQuery]) // 包含handleQuery依赖

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    setQuery(val)

    // 直接在这里调用防抖函数
    if (val.trim()) {
      handleQueryDebonce(val.trim())
    } else {
      // 如果输入为空，立即清空搜索结果
      handleQuery('')
    }
  }

  const clearQuery = () => {
    setQuery('')
    if (queryRef.current) {
      queryRef.current.value = ''
      queryRef.current.focus()
    }
    // 清空时也要清空搜索结果
    handleQuery('')
  }

  const handleSearch = () => {
    if (query.trim()) {
      handleQuery(query.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const displayStyle = query ? { display: 'block' } : { display: 'none' }

  return (
    <div className={styles.wrapper}>
      <div className={styles.backButton} onClick={() => history.go(-1)}>
        <ArrowLeft />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.ipt}
          placeholder="搜索旅游相关"
          ref={queryRef}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={query}
        />
        <Close
          onClick={clearQuery}
          className={styles.clearButton}
          style={displayStyle}
        />
        <div className={styles.searchButton} onClick={handleSearch}>
          <Search />
        </div>
      </div>
    </div>
  )
})

SearchBox.displayName = 'SearchBox'

export default memo(SearchBox)
