import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItineraryItem {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'other'
  duration: number // 停留时间（分钟）
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  notes?: string
  images?: string[]
  cost?: number
  rating?: number
}

export interface Itinerary {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  destination: string
  items: ItineraryItem[]
  createdAt: string
  updatedAt: string
  isPublic: boolean
  coverImage?: string
  tags?: string[]
}

interface ItineraryState {
  // 当前行程列表
  itineraries: Itinerary[]

  // 当前正在编辑的行程
  currentItinerary: Itinerary | null

  // 加载状态
  loading: boolean

  // 错误信息
  error: string | null
}

interface ItineraryActions {
  // 获取所有行程
  getItineraries: () => Promise<void>

  // 创建新行程
  createItinerary: (
    itinerary: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>

  // 更新行程
  updateItinerary: (id: string, updates: Partial<Itinerary>) => Promise<void>

  // 删除行程
  deleteItinerary: (id: string) => Promise<void>

  // 设置当前行程
  setCurrentItinerary: (itinerary: Itinerary | null) => void

  // 添加行程项目
  addItineraryItem: (
    itineraryId: string,
    item: Omit<ItineraryItem, 'id'>
  ) => Promise<void>

  // 更新行程项目
  updateItineraryItem: (
    itineraryId: string,
    itemId: string,
    updates: Partial<ItineraryItem>
  ) => Promise<void>

  // 删除行程项目
  removeItineraryItem: (itineraryId: string, itemId: string) => Promise<void>

  // 重新排序行程项目
  reorderItineraryItems: (
    itineraryId: string,
    items: ItineraryItem[]
  ) => Promise<void>

  // 复制行程
  duplicateItinerary: (id: string) => Promise<string>

  // 分享行程
  shareItinerary: (id: string) => Promise<string>

  // 导入行程（从AI助手）
  importFromAI: (aiResponse: any) => Promise<string>

  // 清除错误
  clearError: () => void

  // 设置加载状态
  setLoading: (loading: boolean) => void
}

type ItineraryStore = ItineraryState & ItineraryActions

// 生成唯一ID
const generateId = () =>
  `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      itineraries: [],
      currentItinerary: null,
      loading: false,
      error: null,

      // 获取所有行程
      getItineraries: async () => {
        set({ loading: true, error: null })
        try {
          // 这里应该调用API获取行程数据
          // const response = await api.getItineraries()
          // set({ itineraries: response.data, loading: false })

          // 暂时使用本地数据
          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '获取行程失败',
            loading: false
          })
        }
      },

      // 创建新行程
      createItinerary: async (itineraryData) => {
        set({ loading: true, error: null })
        try {
          const now = new Date().toISOString()
          const newItinerary: Itinerary = {
            ...itineraryData,
            id: generateId(),
            createdAt: now,
            updatedAt: now
          }

          const { itineraries } = get()
          set({
            itineraries: [...itineraries, newItinerary],
            currentItinerary: newItinerary,
            loading: false
          })

          return newItinerary.id
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '创建行程失败',
            loading: false
          })
          throw error
        }
      },

      // 更新行程
      updateItinerary: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const { itineraries, currentItinerary } = get()
          const updatedItineraries = itineraries.map((itinerary) =>
            itinerary.id === id
              ? {
                  ...itinerary,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : itinerary
          )

          const updatedCurrent =
            currentItinerary?.id === id
              ? {
                  ...currentItinerary,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : currentItinerary

          set({
            itineraries: updatedItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '更新行程失败',
            loading: false
          })
        }
      },

      // 删除行程
      deleteItinerary: async (id) => {
        set({ loading: true, error: null })
        try {
          const { itineraries, currentItinerary } = get()
          const filteredItineraries = itineraries.filter(
            (itinerary) => itinerary.id !== id
          )
          const updatedCurrent =
            currentItinerary?.id === id ? null : currentItinerary

          set({
            itineraries: filteredItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '删除行程失败',
            loading: false
          })
        }
      },

      // 设置当前行程
      setCurrentItinerary: (itinerary) => {
        set({ currentItinerary: itinerary })
      },

      // 添加行程项目
      addItineraryItem: async (itineraryId, itemData) => {
        set({ loading: true, error: null })
        try {
          const newItem: ItineraryItem = {
            ...itemData,
            id: generateId()
          }

          const { itineraries, currentItinerary } = get()
          const updatedItineraries = itineraries.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  items: [...itinerary.items, newItem],
                  updatedAt: new Date().toISOString()
                }
              : itinerary
          )

          const updatedCurrent =
            currentItinerary?.id === itineraryId
              ? {
                  ...currentItinerary,
                  items: [...currentItinerary.items, newItem],
                  updatedAt: new Date().toISOString()
                }
              : currentItinerary

          set({
            itineraries: updatedItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '添加行程项目失败',
            loading: false
          })
        }
      },

      // 更新行程项目
      updateItineraryItem: async (itineraryId, itemId, updates) => {
        set({ loading: true, error: null })
        try {
          const { itineraries, currentItinerary } = get()
          const updatedItineraries = itineraries.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  items: itinerary.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: new Date().toISOString()
                }
              : itinerary
          )

          const updatedCurrent =
            currentItinerary?.id === itineraryId
              ? {
                  ...currentItinerary,
                  items: currentItinerary.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: new Date().toISOString()
                }
              : currentItinerary

          set({
            itineraries: updatedItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '更新行程项目失败',
            loading: false
          })
        }
      },

      // 删除行程项目
      removeItineraryItem: async (itineraryId, itemId) => {
        set({ loading: true, error: null })
        try {
          const { itineraries, currentItinerary } = get()
          const updatedItineraries = itineraries.map((itinerary) =>
            itinerary.id === itineraryId
              ? {
                  ...itinerary,
                  items: itinerary.items.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString()
                }
              : itinerary
          )

          const updatedCurrent =
            currentItinerary?.id === itineraryId
              ? {
                  ...currentItinerary,
                  items: currentItinerary.items.filter(
                    (item) => item.id !== itemId
                  ),
                  updatedAt: new Date().toISOString()
                }
              : currentItinerary

          set({
            itineraries: updatedItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '删除行程项目失败',
            loading: false
          })
        }
      },

      // 重新排序行程项目
      reorderItineraryItems: async (itineraryId, items) => {
        set({ loading: true, error: null })
        try {
          const { itineraries, currentItinerary } = get()
          const updatedItineraries = itineraries.map((itinerary) =>
            itinerary.id === itineraryId
              ? { ...itinerary, items, updatedAt: new Date().toISOString() }
              : itinerary
          )

          const updatedCurrent =
            currentItinerary?.id === itineraryId
              ? {
                  ...currentItinerary,
                  items,
                  updatedAt: new Date().toISOString()
                }
              : currentItinerary

          set({
            itineraries: updatedItineraries,
            currentItinerary: updatedCurrent,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '重新排序失败',
            loading: false
          })
        }
      },

      // 复制行程
      duplicateItinerary: async (id) => {
        set({ loading: true, error: null })
        try {
          const { itineraries } = get()
          const originalItinerary = itineraries.find(
            (itinerary) => itinerary.id === id
          )

          if (!originalItinerary) {
            throw new Error('行程不存在')
          }

          const now = new Date().toISOString()
          const duplicatedItinerary: Itinerary = {
            ...originalItinerary,
            id: generateId(),
            title: `${originalItinerary.title} (副本)`,
            createdAt: now,
            updatedAt: now,
            items: originalItinerary.items.map((item) => ({
              ...item,
              id: generateId()
            }))
          }

          set({
            itineraries: [...itineraries, duplicatedItinerary],
            loading: false
          })

          return duplicatedItinerary.id
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '复制行程失败',
            loading: false
          })
          throw error
        }
      },

      // 分享行程
      shareItinerary: async (id) => {
        set({ loading: true, error: null })
        try {
          // 这里应该调用API生成分享链接
          // const response = await api.shareItinerary(id)
          // return response.shareUrl

          // 暂时返回模拟链接
          const shareUrl = `${window.location.origin}/itinerary/share/${id}`
          set({ loading: false })
          return shareUrl
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '分享行程失败',
            loading: false
          })
          throw error
        }
      },

      // 从AI助手导入行程
      importFromAI: async (aiResponse) => {
        set({ loading: true, error: null })
        try {
          // 解析AI响应并创建行程
          const itineraryData = {
            title: aiResponse.title || '新行程',
            description: aiResponse.description || '',
            startDate:
              aiResponse.startDate || new Date().toISOString().split('T')[0],
            endDate:
              aiResponse.endDate || new Date().toISOString().split('T')[0],
            destination: aiResponse.destination || '',
            items: aiResponse.items || [],
            isPublic: false,
            tags: aiResponse.tags || []
          }

          const itineraryId = await get().createItinerary(itineraryData)
          return itineraryId
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '导入行程失败',
            loading: false
          })
          throw error
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ loading })
      }
    }),
    {
      name: 'itinerary-storage',
      partialize: (state) => ({
        itineraries: state.itineraries,
        currentItinerary: state.currentItinerary
      })
    }
  )
)
