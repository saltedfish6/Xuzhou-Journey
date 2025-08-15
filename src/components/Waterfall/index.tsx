// src/components/Waterfall/Waterfall.tsx
import React, { useEffect, useRef, useCallback } from 'react'
import { useWaterfall } from '@/hooks/useWaterfall'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import Loading from '@/components/Loading'
import styles from './waterfall.module.styl'

export interface WaterfallItemData {
  id: string | number
  imageUrl: string
  title: string
  description?: string
  author?: string
  likes?: number
  height?: number
  [key: string]: string | number | undefined
}

interface WaterfallProps {
  items: WaterfallItemData[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onItemClick?: (item: WaterfallItemData) => void
  columnCount?: number
  gap?: number
}

const WaterfallItem: React.FC<{
  item: WaterfallItemData
  onClick?: (item: WaterfallItemData) => void
}> = React.memo(({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const itemRef = React.useRef<HTMLDivElement>(null)

  // 计算固定高度，避免布局跳动 - 参考小红书移动端设计
  const imageHeight = item.height
    ? Math.min(Math.max(item.height, 180), 280)
    : 220 // 高度范围180-280px，默认220px

  // 使用Intersection Observer实现图片懒加载
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      ref={itemRef}
      className={styles.waterfallItem}
      onClick={() => onClick?.(item)}
    >
      <div
        className={styles.imageContainer}
        style={{ height: `${imageHeight}px` }}
      >
        {/* 骨架屏 - 在图片未加载时显示 */}
        {!imageLoaded && !imageError && (
          <Loading
            type="skeleton"
            size="large"
            className={styles.imageSkeleton}
          />
        )}

        {/* 占位图片 - 在加载失败时显示 */}
        {imageError && (
          <img
            src="/placeholder.svg"
            alt="占位图片"
            className={styles.placeholderImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1
            }}
          />
        )}

        {/* 真实图片 - 只有在可见时才加载 */}
        {!imageError && isVisible && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`${styles.image} ${imageLoaded ? styles.imageLoaded : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              zIndex: 2
            }}
          />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}

        <div className={styles.meta}>
          {item.author && <span className={styles.author}>{item.author}</span>}
          {item.likes && <span className={styles.likes}>❤️ {item.likes}</span>}
        </div>
      </div>
    </div>
  )
})

WaterfallItem.displayName = 'WaterfallItem'

const Waterfall: React.FC<WaterfallProps> = ({
  items,
  loading = false,
  hasMore = true,
  onLoadMore,
  onItemClick,
  columnCount = 2,
  gap = 8 // 参考小红书卡片间距
}) => {
  const {
    columns,
    // loading: waterfallLoading,
    // hasMore: waterfallHasMore,
    setLoading,
    setHasMore
  } = useWaterfall(items, columnCount)

  const [loadMoreRef, , isLoadMoreVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px' // 提前100px触发加载
  })

  useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  useEffect(() => {
    setHasMore(hasMore)
  }, [hasMore, setHasMore])

  // 添加适度的防抖机制，避免重复触发但不影响正常滚动
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadingRef = useRef(false)

  const debouncedLoadMore = useCallback(() => {
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current)
    }

    loadMoreTimeoutRef.current = setTimeout(() => {
      // 添加调试日志
      // console.log('无限滚动状态检查:', {
      //   isLoadMoreVisible,
      //   hasMore,
      //   loading,
      //   isLoadingRef: isLoadingRef.current,
      //   onLoadMore: !!onLoadMore
      // })

      // 只在非loading状态且未被保护时触发
      if (
        isLoadMoreVisible &&
        hasMore &&
        !loading &&
        !isLoadingRef.current &&
        onLoadMore
      ) {
        // console.log('触发加载更多数据')
        isLoadingRef.current = true
        onLoadMore()
      }
    }, 1000) // 保持1000ms防抖延迟
  }, [isLoadMoreVisible, hasMore, loading, onLoadMore])

  // 当loading状态变化时，管理触发标志
  useEffect(() => {
    if (loading) {
      isLoadingRef.current = true
    } else {
      // loading完成后，延迟重置以避免立即重新触发
      setTimeout(() => {
        isLoadingRef.current = false
      }, 1000)
    }
  }, [loading])

  useEffect(() => {
    debouncedLoadMore()

    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current)
      }
    }
  }, [debouncedLoadMore])

  return (
    <div className={styles.waterfall}>
      <div className={styles.waterfallContainer} style={{ gap: `${gap}px` }}>
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={styles.waterfallColumn}
            style={{ gap: `${gap}px` }}
          >
            {column.items.map((item, itemIndex) => (
              <WaterfallItem
                key={`col_${columnIndex}_idx_${itemIndex}_id_${item.id}`}
                item={item}
                onClick={onItemClick}
              />
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {loading ? (
            <Loading type="spinner" size="medium" text="加载中..." />
          ) : (
            <div style={{ height: '20px', background: 'transparent' }}>
              {/* 占位元素，确保触发区域可见 */}
            </div>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className={styles.noMoreData}>没有更多内容了</div>
      )}

      {!loading && items.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📷</div>
          <p>暂无内容</p>
        </div>
      )}
    </div>
  )
}

export default Waterfall
