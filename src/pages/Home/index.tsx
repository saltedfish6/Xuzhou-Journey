import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

// 数据缓存 - 清空缓存以使用新的图片URL
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

// API 请求函数
const fetchWaterfallData = async (
  page: number,
  tab: string,
  pageSize: number = 20
) => {
  // 缓存键
  const cacheKey = `${tab}-${page}-${pageSize}`

  // 如果有缓存，直接返回缓存数据
  if (dataCache[cacheKey]) {
    console.log('使用缓存数据:', cacheKey)
    return dataCache[cacheKey]
  }

  try {
    const response = await fetch(
      `/api/home/waterfall?page=${page}&tab=${encodeURIComponent(tab)}&pageSize=${pageSize}`
    )
    const result = await response.json()

    if (result.code === 0) {
      // 缓存结果
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

// 预加载下一页数据
const preloadNextPage = (tab: string, page: number) => {
  if (page > 1) {
    fetchWaterfallData(page, tab, 20).catch(() => {
      // 预加载失败不处理
    })
  }
}

const Home: React.FC = () => {
  useTitle('发现 - 旅行助手')

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('推荐')
  const [items, setItems] = useState<WaterfallItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const tabs = ['推荐', '热门', '最新', '附近']

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchWaterfallData(1, activeTab, 20)
      setItems(result.items)
      setPage(2)
      setHasMore(result.hasMore)

      // 预加载图片
      if (result.items.length > 0) {
        const imageUrls = result.items.map(
          (item: WaterfallItemData) => item.imageUrl
        )
        preloadImages(imageUrls.slice(0, 8), true) // 高优先级预加载前8张

        if (imageUrls.length > 8) {
          preloadImages(imageUrls.slice(8), false) // 低优先级预加载剩余图片
        }
      }

      // 预加载下一页数据
      preloadNextPage(activeTab, 2)
    } catch (error) {
      console.error('加载数据失败', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  // 初始化数据
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const loadMoreData = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await fetchWaterfallData(page, activeTab, 20)

      if (result.items.length === 0) {
        setHasMore(false)
        return
      }

      setItems((prev) => [...prev, ...result.items])
      const nextPage = page + 1
      setPage(nextPage)
      setHasMore(result.hasMore)

      // 预加载新加载项的图片
      if (result.items.length > 0) {
        const imageUrls = result.items.map(
          (item: WaterfallItemData) => item.imageUrl
        )
        preloadImages(imageUrls, false)
      }

      // 预加载下一页数据
      if (result.hasMore) {
        preloadNextPage(activeTab, nextPage)
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

  const handleSearchClick = () => {
    navigate('/search')
  }

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return

    setActiveTab(tab)
    setItems([])
    setPage(0)
    setHasMore(true)
  }
  return (
    <div className={styles.home}>
      {/* 顶部搜索栏 */}
      <div className={styles.header}>
        <div className={styles.searchBar} onClick={handleSearchClick}>
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
        )}
      </div>
    </div>
  )
}

export default Home
