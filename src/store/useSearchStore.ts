// search 全局共享状态
import { create } from 'zustand'
import { getSuggestList, getHotList } from '@/api/search'

interface SearchState {
  searchHistory: string[]
  suggestList: string[]
  hotList: { id: string; city: string }[]
}

interface SearchActions {
  setSuggetList: (keyword: string) => Promise<void>
  setHotList: () => Promise<void>
  // 可选：添加更新历史的方法
  addSearchHistory: (keyword: string) => void
}

type SearchStore = SearchState & SearchActions

const useSearchStore = create<SearchStore>((set, get) => {
  const getHistory = (): string[] => {
    try {
      const saved = localStorage.getItem('searchHistory')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  return {
    searchHistory: getHistory(),
    suggestList: [],
    hotList: [],

    setSuggetList: async (keyword) => {
      if (!keyword.trim()) {
        set({ suggestList: [] })
        return
      }
      try {
        const res = await getSuggestList(keyword)
        console.log('搜索建议API响应:', res)

        // 根据axios拦截器，res已经是处理后的数据
        // 数据格式：{keyword: '江西', list: [...]}
        const suggestionList = res.list || []
        console.log('提取的搜索建议列表:', suggestionList)
        set({ suggestList: suggestionList })
      } catch (error) {
        console.error('搜索建议API错误:', error)
        set({ suggestList: [] })
      }
    },

    setHotList: async () => {
      try {
        const res = await getHotList()
        console.log('热门城市API响应:', res)

        // 由于axios拦截器处理，res直接是数组格式：[{id: '101', city: '北京'}, ...]
        if (Array.isArray(res)) {
          set({ hotList: res })
        } else {
          set({ hotList: [] })
        }
      } catch (error) {
        console.error('获取热门城市失败:', error)
        set({ hotList: [] })
      }
    },

    addSearchHistory: (keyword) => {
      const { searchHistory } = get()
      const newHistory = [
        keyword,
        ...searchHistory.filter((k) => k !== keyword)
      ].slice(0, 10)
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      } catch {
        // 忽略 localStorage 错误
      }
      set({ searchHistory: newHistory })
    }
  }
})

export default useSearchStore
