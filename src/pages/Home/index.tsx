import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PullRefresh } from 'react-vant'
import { useTitle } from '@/hooks/useTitle'
import Waterfall from '@/components/Waterfall'
import { preloadImages } from '@/utils/imageOptimizer'
import styles from './home.module.styl'

interface WaterfallItemData {
  id: string | number
  imageUrl: string
  title: string
  description?: string
  height?: number
  [key: string]: string | number | undefined
}

// 数据缓存 - 已清空缓存以使用新的图片URL
const dataCache: Record<
  string,
  {
    items: WaterfallItemData[]
    hasMore: boolean
    page: number
    pageSize: number
    total: number
  }
> = {}

// 清空所有缓存，确保使用新的图片URL
Object.keys(dataCache).forEach((key) => {
  delete dataCache[key]
})

// API 请求函数
const fetchWaterfallData = async (
  page: number,
  tab: string,
  pageSize: number = 20,
  forceRefresh: boolean = false
) => {
  // 缓存键
  const cacheKey = `${tab}-${page}-${pageSize}`

  // 如果有缓存且不是强制刷新，直接返回缓存数据
  if (dataCache[cacheKey] && !forceRefresh) {
    // console.log('使用缓存数据:', cacheKey)
    return dataCache[cacheKey]
  }

  try {
    // 如果是强制刷新或者是第一页，添加时间戳参数确保获取新数据
    const timestamp = forceRefresh || page === 1 ? Date.now() : ''
    const timestampParam = timestamp ? `&timestamp=${timestamp}` : ''
    const response = await fetch(
      `/api/home/waterfall?page=${page}&tab=${encodeURIComponent(tab)}&pageSize=${pageSize}${timestampParam}`
    )
    const result = await response.json()

    if (result.code === 0) {
      // 缓存结果，但限制缓存数量避免内存泄漏
      const cacheKeys = Object.keys(dataCache)
      if (cacheKeys.length > 50) {
        // 删除最旧的缓存
        delete dataCache[cacheKeys[0]]
      }
      dataCache[cacheKey] = result.data
      return result.data
    } else {
      throw new Error(result.message || '请求失败')
    }
  } catch (error) {
    console.error('获取瀑布流数据失败:', error)
    throw error
  }
}

const Home: React.FC = () => {
  useTitle('发现 - 旅行助手')

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('推荐')
  const [items, setItems] = useState<WaterfallItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const tabs = ['推荐', '热门', '最新', '附近']
  const refreshTimeoutRef = useRef<NodeJS.Timeout>()

  const loadInitialData = useCallback(
    async (tab: string, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      try {
        const result = await fetchWaterfallData(1, tab, 15, isRefresh) // 传递刷新标志
        setItems(result.items)
        setPage(2)
        setHasMore(result.hasMore)

        // 预加载图片 - 只预加载第一张，最小化性能影响
        if (result.items.length > 0) {
          const imageUrls = result.items.map(
            (item: WaterfallItemData) => item.imageUrl
          )
          preloadImages(imageUrls.slice(0, 1), true) // 只预加载第一张
        }
      } catch (error) {
        console.error('加载数据失败', error)
      } finally {
        if (isRefresh) {
          setRefreshing(false)
        } else {
          setLoading(false)
        }
      }
    },
    []
  )

  // 初始化数据
  useEffect(() => {
    loadInitialData(activeTab)
  }, [activeTab, loadInitialData])

  const loadMoreData = async () => {
    if (loading || refreshing || !hasMore) {
      return
    }

    setLoading(true)
    const nextPage = page + 1 // 先计算下一页
    try {
      const result = await fetchWaterfallData(nextPage, activeTab, 15, false) // 传递下一页页码

      // 更新hasMore状态，即使没有数据也要根据API返回的hasMore字段
      setHasMore(result.hasMore)

      if (result.items.length > 0) {
        setItems((prev) => [...prev, ...result.items])
      }

      setPage(nextPage) // 更新页码

      // 预加载新加载项的图片 - 只预加载前2张，进一步减少预加载
      if (result.items.length > 0) {
        const imageUrls = result.items.map(
          (item: WaterfallItemData) => item.imageUrl
        )
        preloadImages(imageUrls.slice(0, 2), false)
      }
    } catch (error) {
      console.error('加载更多失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (item: {
    id: string | number
    imageUrl: string
    title: string
    description?: string
    height?: number
  }) => {
    // 跳转到详情页
    navigate(`/detail/${item.id}`)
  }

  const handleGoToSearch = () => {
    navigate('/search')
  }

  // 下拉刷新处理
  const handleRefresh = useCallback(async () => {
    // 清除之前的定时器
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    // 清空当前标签的所有缓存，确保获取新数据
    Object.keys(dataCache).forEach((key) => {
      if (key.startsWith(activeTab)) {
        delete dataCache[key]
      }
    })

    // 重置状态
    setItems([])
    setPage(1) // 重置为1，因为loadInitialData会设置为2
    setHasMore(true)

    // 加载新数据，传入刷新标志
    await loadInitialData(activeTab, true)
  }, [activeTab, loadInitialData])

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return

    setActiveTab(tab)
    setItems([])
    setPage(1) // 重置为1，保持与loadInitialData一致
    setHasMore(true)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])
  return (
    <div className={styles.home}>
      {/* 顶部搜索栏 */}
      <div className={styles.header}>
        <div className={styles.searchBar} onClick={handleGoToSearch}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className={styles.searchText}>搜索目的地、攻略...</span>
        </div>
      </div>

      {/* 标签页 */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {items.length === 0 && loading ? (
          <div className={styles.loadingContainer}>
            <div>加载中...</div>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>🏞️</div>
            <div className={styles.emptyText}>
              暂无内容
              <br />
              换个标签试试吧
            </div>
          </div>
        ) : (
          <PullRefresh
            v-model:refresh={refreshing}
            onRefresh={handleRefresh}
            pullingText="下拉刷新"
            loosingText="释放刷新"
            loadingText="刷新中..."
            successText="刷新成功"
            successDuration={1000}
          >
            <div className={styles.waterfallContainer}>
              <Waterfall
                items={items}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMoreData}
                onItemClick={handleItemClick}
                columnCount={2}
                gap={8}
              />
            </div>
          </PullRefresh>
        )}
      </div>
    </div>
  )
}

export default Home
