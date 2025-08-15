import { useEffect, memo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import SearchBox from '@/components/SearchBox'
import useSearchStore from '@/store/useSearchStore'
import styles from './search.module.styl'

// ✅ 定义 HotListItems 的 props 类型
interface HotListProps {
  hotList: { id: string; city: string }[]
  onCityClick: (city: string) => void
}

const HotListItems = memo((props: HotListProps) => {
  // console.log('------', props)
  const { hotList, onCityClick } = props

  return (
    <div className={styles.hot}>
      <h1>热门推荐</h1>
      {hotList.map((item) => (
        <div
          key={item.id}
          className={styles.item}
          onClick={() => onCityClick(item.city)}
        >
          {item.city}
        </div>
      ))}
    </div>
  )
})

const Search = () => {
  const searchBoxRef = useRef<{ updateInput: (value: string) => void }>(null)
  const location = useLocation()

  const { suggestList, hotList, setHotList, setSuggetList } = useSearchStore()

  // console.log('hotList', hotList)

  useEffect(() => {
    setHotList()
  }, [setHotList])

  // 处理从首页传递的搜索参数
  useEffect(() => {
    const state = location.state as { searchQuery?: string } | null
    if (state?.searchQuery) {
      // console.log('从首页接收到搜索参数:', state.searchQuery)
      // 更新搜索框的输入值
      if (searchBoxRef.current) {
        searchBoxRef.current.updateInput(state.searchQuery)
      }
      // 执行搜索
      setSuggetList(state.searchQuery)
    }
  }, [location.state, setSuggetList])

  const handleQuery = (query: string) => {
    // console.log('debounce之后', query)
    if (query.trim()) {
      setSuggetList(query.trim())
    } else {
      // 清空搜索建议
      setSuggetList('')
    }
  }

  // 处理热门城市点击
  const handleCityClick = (city: string) => {
    // console.log('点击热门城市:', city)
    setSuggetList(city)

    // 更新搜索框的输入值
    if (searchBoxRef.current) {
      searchBoxRef.current.updateInput(city)
    }
  }

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: string) => {
    // console.log('点击搜索建议:', suggestion)
    setSuggetList(suggestion)

    // 更新搜索框的输入值
    if (searchBoxRef.current) {
      searchBoxRef.current.updateInput(suggestion)
    }
  }

  const suggestListStyle = {
    display: suggestList.length ? 'block' : 'none'
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <SearchBox ref={searchBoxRef} handleQuery={handleQuery} />
          <HotListItems hotList={hotList} onCityClick={handleCityClick} />
          <div className={styles.list} style={suggestListStyle}>
            {suggestList.map((item: string) => (
              <div
                key={item}
                className={styles.item}
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default Search
