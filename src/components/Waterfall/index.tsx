// src/components/Waterfall/Waterfall.tsx
import React, { useEffect } from 'react'
import { useWaterfallSimple } from '@/hooks/useWaterfallSimple'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
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

  // 计算固定高度，避免布局跳动
  const imageHeight = item.height || 250

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={styles.waterfallItem} onClick={() => onClick?.(item)}>
      <div
        className={styles.imageContainer}
        style={{ height: `${imageHeight}px` }}
      >
        {/* 占位图片 - 始终显示，作为背景 */}
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

        {/* 真实图片 - 加载完成后覆盖占位图片 */}
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
            transition: 'opacity 0.5s ease',
            zIndex: 2
          }}
        />

        {/* 错误占位符 */}
        {imageError && (
          <div className={styles.errorPlaceholder} style={{ zIndex: 3 }}>
            <div className={styles.errorIcon}>📷</div>
            <div className={styles.errorText}>图片加载失败</div>
          </div>
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
  gap = 10
}) => {
  const { columns, setLoading, setHasMore } = useWaterfallSimple(
    items,
    columnCount
  )

  const [loadMoreRef, , isLoadMoreVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  })

  useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  useEffect(() => {
    setHasMore(hasMore)
  }, [hasMore, setHasMore])

  useEffect(() => {
    if (isLoadMoreVisible && hasMore && !loading && onLoadMore) {
      onLoadMore()
    }
  }, [isLoadMoreVisible, hasMore, loading, onLoadMore])

  return (
    <div className={styles.waterfall}>
      <div className={styles.waterfallContainer} style={{ gap: `${gap}px` }}>
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={styles.waterfallColumn}
            style={{ gap: `${gap}px` }}
          >
            {column.items.map((item) => (
              <WaterfallItem key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {loading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <span>加载中...</span>
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
