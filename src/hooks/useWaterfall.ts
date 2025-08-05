import { useState, useCallback, useRef, useEffect } from 'react'

export interface WaterfallItem {
  id: string | number
  height?: number
  imageUrl?: string
  src?: string
  url?: string
  [key: string]: string | number | boolean | undefined
}

export interface WaterfallColumn {
  items: WaterfallItem[]
  height: number
}

/**
 * 瀑布流 Hook
 * @param initialItems 初始数据
 * @param columnCount 列数，默认为2
 * @returns 瀑布流相关状态和方法
 */
export function useWaterfall(
  initialItems: WaterfallItem[] = [],
  columnCount: number = 2
) {
  // 列数据
  const [columns, setColumns] = useState<WaterfallColumn[]>(() =>
    Array.from({ length: columnCount }, () => ({ items: [], height: 0 }))
  )

  // 所有数据
  const [allItems, setAllItems] = useState<WaterfallItem[]>(initialItems)

  // 加载状态
  const [loading, setLoading] = useState(false)

  // 是否还有更多数据
  const [hasMore, setHasMore] = useState(true)

  // 图片高度缓存
  const imageHeightCache = useRef<Map<string | number, number>>(new Map())

  /**
   * 获取图片实际高度
   */
  const getImageHeight = useCallback(
    (item: WaterfallItem, defaultHeight: number = 200): Promise<number> => {
      return new Promise((resolve) => {
        const cacheKey = item.id

        // 如果有缓存，直接返回
        if (imageHeightCache.current.has(cacheKey)) {
          resolve(imageHeightCache.current.get(cacheKey)!)
          return
        }

        // 如果item已经有height属性，使用它
        if (item.height) {
          imageHeightCache.current.set(cacheKey, item.height)
          resolve(item.height)
          return
        }

        // 如果有图片URL，计算实际高度
        if (item.imageUrl || item.src || item.url) {
          const img = new Image()
          img.onload = () => {
            // 基于375px宽度计算高度（移动端适配）
            const containerWidth = 375 / 2 - 10 // 减去间距
            const actualHeight = (img.height / img.width) * containerWidth
            imageHeightCache.current.set(cacheKey, actualHeight)
            resolve(actualHeight)
          }
          img.onerror = () => {
            imageHeightCache.current.set(cacheKey, defaultHeight)
            resolve(defaultHeight)
          }
          img.src = item.imageUrl || item.src || item.url
        } else {
          // 没有图片，使用默认高度
          imageHeightCache.current.set(cacheKey, defaultHeight)
          resolve(defaultHeight)
        }
      })
    },
    []
  )

  /**
   * 将新项目添加到最短的列
   */
  const addItemToColumns = useCallback(
    async (newItems: WaterfallItem[]) => {
      const newColumns = [...columns]

      for (const item of newItems) {
        // 获取图片高度
        const height = await getImageHeight(item)

        // 找到高度最小的列
        const minHeightColumnIndex = newColumns.reduce(
          (minIndex, column, index) =>
            column.height < newColumns[minIndex].height ? index : minIndex,
          0
        )

        // 添加到最短的列
        newColumns[minHeightColumnIndex].items.push({ ...item, height })
        newColumns[minHeightColumnIndex].height += height + 10 // 加上间距
      }

      setColumns(newColumns)
    },
    [columns, getImageHeight]
  )

  /**
   * 添加新数据
   */
  const addItems = useCallback(
    async (newItems: WaterfallItem[]) => {
      if (newItems.length === 0) return

      setLoading(true)

      // 更新所有数据
      setAllItems((prev) => [...prev, ...newItems])

      // 添加到列中
      await addItemToColumns(newItems)

      setLoading(false)
    },
    [addItemToColumns]
  )

  /**
   * 重置数据
   */
  const resetItems = useCallback(
    async (newItems: WaterfallItem[] = []) => {
      setLoading(true)

      // 清空列
      setColumns(
        Array.from({ length: columnCount }, () => ({ items: [], height: 0 }))
      )

      // 重置数据
      setAllItems(newItems)
      setHasMore(true)

      // 如果有新数据，添加到列中
      if (newItems.length > 0) {
        await addItemToColumns(newItems)
      }

      setLoading(false)
    },
    [columnCount, addItemToColumns]
  )

  /**
   * 设置是否还有更多数据
   */
  const setHasMoreData = useCallback((hasMore: boolean) => {
    setHasMore(hasMore)
  }, [])

  // 初始化时处理初始数据
  useEffect(() => {
    if (initialItems.length > 0) {
      resetItems(initialItems)
    }
  }, [initialItems.length, resetItems]) // 添加 resetItems 依赖

  return {
    columns,
    allItems,
    loading,
    hasMore,
    addItems,
    resetItems,
    setHasMore: setHasMoreData,
    setLoading
  }
}

export default useWaterfall
