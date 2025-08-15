import { useState, useCallback, useRef, useEffect } from 'react'

export interface WaterfallItem {
  id: string | number
  height?: number
  imageUrl: string // 改为必需属性，与 WaterfallItemData 保持一致
  title: string // 添加必需的 title 属性
  description?: string
  author?: string
  likes?: number
  src?: string
  url?: string
  [key: string]: string | number | undefined // 移除 boolean 类型，与 WaterfallItemData 保持一致
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
          img.src = item.imageUrl || item.src || item.url || ''
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

  // 用于跟踪初始项目的引用
  const prevItemsRef = useRef<string>('')
  const isInitializedRef = useRef(false)

  // 初始化时处理初始数据
  useEffect(() => {
    if (initialItems.length > 0) {
      // 使用一个标记来防止无限循环
      const itemsJSON = JSON.stringify(initialItems.map((item) => item.id))

      if (prevItemsRef.current !== itemsJSON && !isInitializedRef.current) {
        prevItemsRef.current = itemsJSON
        isInitializedRef.current = true

        // 直接处理初始数据，避免依赖 resetItems
        setLoading(true)
        setColumns(
          Array.from({ length: columnCount }, () => ({ items: [], height: 0 }))
        )
        setAllItems(initialItems)
        setHasMore(true)

        // 异步处理列布局
        const processInitialItems = async () => {
          const newColumns: WaterfallColumn[] = Array.from(
            { length: columnCount },
            () => ({
              items: [],
              height: 0
            })
          )

          for (const item of initialItems) {
            const height = await getImageHeight(item)
            const minHeightColumnIndex = newColumns.reduce(
              (minIndex, column, index) =>
                column.height < newColumns[minIndex].height ? index : minIndex,
              0
            )

            const itemWithHeight: WaterfallItem = { ...item, height }
            newColumns[minHeightColumnIndex].items.push(itemWithHeight)
            newColumns[minHeightColumnIndex].height += height + 10
          }

          setColumns(newColumns)
          setLoading(false)
        }

        processInitialItems()
      }
    } else if (initialItems.length === 0 && isInitializedRef.current) {
      // 重置状态
      prevItemsRef.current = ''
      isInitializedRef.current = false
      setColumns(
        Array.from({ length: columnCount }, () => ({ items: [], height: 0 }))
      )
      setAllItems([])
      setHasMore(true)
    }
  }, [initialItems, columnCount, getImageHeight])

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
