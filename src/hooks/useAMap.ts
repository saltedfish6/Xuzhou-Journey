import { useEffect, useRef, useState, useCallback } from 'react'
import { loadAMapSDK, getAMapInstance } from '@/utils/mapLoader'

// 地图相关类型定义
export interface POI {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  type: string
  distance?: number
  rating?: number
  photos?: string[]
}

export interface MapInstance {
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  addMarker: (poi: POI) => void
  clearMarkers: () => void
  showRoute: (
    start: [number, number],
    end: [number, number],
    type?: 'driving' | 'walking'
  ) => void
  searchPOI: (keyword: string, center?: [number, number]) => Promise<any[]>
  geocoder: (address: string) => Promise<any>
  reverseGeocoder: (lnglat: [number, number]) => Promise<any>
}

export interface UseAMapOptions {
  center?: [number, number]
  zoom?: number
  mapStyle?: string
  onMapReady?: (map: MapInstance) => void
  onMapError?: (error: Error) => void
  autoLocate?: boolean // 新增：是否自动定位
}

// 声明全局 MapSDK 类型
declare global {
  interface Window {
    MapSDK?: {
      initMap: (container: HTMLElement, options: any) => Promise<MapInstance>
    }
  }
}

/**
 * 高德地图React Hook
 * 基于官方React集成指南实现
 */
export const useAMap = (options: UseAMapOptions = {}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<MapInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3
  const isInitializedRef = useRef(false) // 防止重复初始化

  const {
    center,
    zoom = 12,
    mapStyle = 'normal',
    autoLocate = false,
    onMapReady,
    onMapError
  } = options

  // 获取智能初始中心点
  const getInitialCenter = useCallback(async (): Promise<[number, number]> => {
    // 如果传入了center参数，直接使用
    if (center) {
      console.log('地图初始化：使用传入的中心点')
      return center
    }

    // 如果启用自动定位，尝试获取用户位置
    if (autoLocate && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0 // 不使用缓存，每次都获取最新位置
            })
          }
        )

        console.log('地图初始化：使用用户当前位置')
        return [position.coords.longitude, position.coords.latitude]
      } catch (error) {
        console.log('地图初始化：无法获取用户位置，使用默认位置（杭州）')
      }
    }

    // 默认使用杭州
    console.log('地图初始化：使用默认位置（杭州）')
    return [120.1551, 30.2741]
  }, [center, autoLocate])

  // 初始化地图
  const initMap = useCallback(async () => {
    if (!mapRef.current || isInitializedRef.current) return

    try {
      setIsLoading(true)
      setError(null)
      isInitializedRef.current = true

      // 确保容器有尺寸，限制重试次数
      const container = mapRef.current
      if (!container.offsetWidth || !container.offsetHeight) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++
          console.log(
            `等待容器渲染完成，重试次数: ${retryCountRef.current}/${maxRetries}`
          )
          setTimeout(initMap, 100)
          return
        } else {
          throw new Error('容器尺寸获取失败，已达到最大重试次数')
        }
      }

      // 重置重试计数
      retryCountRef.current = 0

      // 动态加载高德地图SDK
      await loadAMapSDK()

      // 获取AMap实例
      const AMap = getAMapInstance()
      if (!AMap) {
        throw new Error('高德地图SDK加载失败')
      }

      // 获取智能初始中心点
      const initialCenter = await getInitialCenter()

      // 创建地图实例
      const map = new AMap.Map(container, {
        center: initialCenter,
        zoom: zoom,
        mapStyle: `amap://styles/${mapStyle}`,
        viewMode: '2D',
        lang: 'zh_cn'
      })

      // 创建地图实例包装器
      const mapInstance: MapInstance = {
        setCenter: (newCenter: [number, number]) => {
          map.setCenter(new AMap.LngLat(newCenter[0], newCenter[1]))
        },
        setZoom: (newZoom: number) => {
          map.setZoom(newZoom)
        },
        addMarker: (poi: POI) => {
          console.log('添加标记:', poi.id, poi.name, poi.location)

          // 为用户位置使用特殊的标记样式
          const isUserLocation = poi.id === 'user_location'
          const isDefaultLocation = poi.id === 'default_location'

          let marker: any

          if (isUserLocation) {
            // 创建仿高德地图用户位置标记
            marker = new AMap.Marker({
              position: new AMap.LngLat(poi.location.lng, poi.location.lat),
              title: poi.name,
              content: `
                <div class="user-location-marker">
                  <div class="location-dot"></div>
                  <div class="location-pulse"></div>
                </div>
                <style>
                  .user-location-marker {
                    position: relative;
                    width: 20px;
                    height: 20px;
                  }
                  
                  .location-dot {
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
                    border: 3px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(74, 144, 226, 0.1);
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    z-index: 2;
                  }
                  
                  .location-pulse {
                    width: 20px;
                    height: 20px;
                    background: rgba(74, 144, 226, 0.3);
                    border-radius: 50%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: locationPulse 2s ease-out infinite;
                    z-index: 1;
                  }
                  
                  @keyframes locationPulse {
                    0% {
                      transform: scale(1);
                      opacity: 0.8;
                    }
                    50% {
                      transform: scale(1.5);
                      opacity: 0.4;
                    }
                    100% {
                      transform: scale(2.2);
                      opacity: 0;
                    }
                  }
                </style>
              `,
              anchor: 'center',
              zIndex: 9999
            })

            marker.setMap(map)
          } else if (isDefaultLocation) {
            // 创建默认位置标记
            marker = new AMap.Marker({
              position: new AMap.LngLat(poi.location.lng, poi.location.lat),
              title: poi.name,
              content: `<div style="
                width: 16px; 
                height: 16px; 
                background: #FF9500; 
                border: 2px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 6px rgba(255,149,0,0.4);
                transform: translate(-50%, -50%);
              "></div>`,
              anchor: 'center'
            })

            marker.setMap(map)
          } else {
            // 创建普通POI标记
            marker = new AMap.Marker({
              position: new AMap.LngLat(poi.location.lng, poi.location.lat),
              title: poi.name
            })

            marker.setMap(map)
          }
        },
        clearMarkers: () => {
          map.clearMap()
        },
        showRoute: async (
          start: [number, number],
          end: [number, number],
          type = 'driving'
        ) => {
          const routeService =
            type === 'driving' ? new AMap.Driving() : new AMap.Walking()
          routeService.search(
            new AMap.LngLat(start[0], start[1]),
            new AMap.LngLat(end[0], end[1]),
            (status: string, result: any) => {
              if (status === 'complete') {
                console.log('路线规划成功', result)
              }
            }
          )
        },
        searchPOI: async (keyword: string, searchCenter?: [number, number]) => {
          return new Promise((resolve) => {
            try {
              const placeSearch = new AMap.PlaceSearch({
                city: '全国',
                citylimit: false,
                pageSize: 20,
                extensions: 'base' // 只获取基础信息，提高成功率
              })

              const handleSearchResult = (status: string, result: any) => {
                console.log('POI搜索状态:', status, result)

                if (status === 'complete' && result && result.poiList) {
                  const pois = result.poiList.pois || []
                  console.log('POI搜索成功，找到', pois.length, '个结果')
                  resolve(pois)
                } else if (status === 'no_data') {
                  console.log('POI搜索无数据')
                  resolve([]) // 无数据时返回空数组而不是错误
                } else {
                  console.warn('POI搜索失败，状态:', status, '结果:', result)
                  // 搜索失败时返回空数组，让上层处理降级逻辑
                  resolve([])
                }
              }

              // 设置搜索超时
              const timeoutId = setTimeout(() => {
                console.warn('POI搜索超时')
                resolve([]) // 超时时返回空数组
              }, 10000) // 10秒超时

              if (searchCenter) {
                placeSearch.searchNearBy(
                  keyword,
                  searchCenter,
                  5000,
                  (status: string, result: any) => {
                    clearTimeout(timeoutId)
                    handleSearchResult(status, result)
                  }
                )
              } else {
                placeSearch.search(keyword, (status: string, result: any) => {
                  clearTimeout(timeoutId)
                  handleSearchResult(status, result)
                })
              }
            } catch (error) {
              console.error('POI搜索异常:', error)
              resolve([]) // 异常时返回空数组
            }
          })
        },
        geocoder: async (address: string) => {
          return new Promise((resolve, reject) => {
            const geocoder = new AMap.Geocoder()
            geocoder.getLocation(address, (status: string, result: any) => {
              if (status === 'complete') {
                resolve(result.geocodes[0])
              } else {
                reject(new Error('地理编码失败'))
              }
            })
          })
        },
        reverseGeocoder: async (lnglat: [number, number]) => {
          return new Promise((resolve, reject) => {
            const geocoder = new AMap.Geocoder()
            geocoder.getAddress(
              new AMap.LngLat(lnglat[0], lnglat[1]),
              (status: string, result: any) => {
                if (status === 'complete') {
                  resolve(result.regeocode)
                } else {
                  reject(new Error('逆地理编码失败'))
                }
              }
            )
          })
        }
      }

      mapInstanceRef.current = mapInstance
      onMapReady?.(mapInstance)
      console.log('高德地图初始化成功')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('地图初始化失败')
      setError(error)
      onMapError?.(error)
      console.error('地图初始化失败:', error)
      isInitializedRef.current = false // 初始化失败时重置标志
    } finally {
      setIsLoading(false)
    }
  }, [zoom, mapStyle, onMapReady, onMapError])

  // 组件挂载时初始化地图
  useEffect(() => {
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [initMap])

  // 地图操作方法
  const setCenter = useCallback((newCenter: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newCenter)
    }
  }, [])

  const setZoom = useCallback((newZoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(newZoom)
    }
  }, [])

  const addMarker = useCallback((poi: POI) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.addMarker(poi)
    }
  }, [])

  const clearMarkers = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.clearMarkers()
    }
  }, [])

  const showRoute = useCallback(
    (
      start: [number, number],
      end: [number, number],
      type: 'driving' | 'walking' = 'driving'
    ) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.showRoute(start, end, type)
      }
    },
    []
  )

  const searchPOI = useCallback(
    async (keyword: string, searchCenter?: [number, number]) => {
      if (mapInstanceRef.current && mapInstanceRef.current.searchPOI) {
        try {
          return await mapInstanceRef.current.searchPOI(keyword, searchCenter)
        } catch (error) {
          console.error('POI搜索失败:', error)
          throw error
        }
      }
      throw new Error('地图实例未初始化')
    },
    []
  )

  const geocoder = useCallback(async (address: string) => {
    if (mapInstanceRef.current && mapInstanceRef.current.geocoder) {
      try {
        return await mapInstanceRef.current.geocoder(address)
      } catch (error) {
        console.error('地理编码失败:', error)
        throw error
      }
    }
    throw new Error('地图实例未初始化')
  }, [])

  const reverseGeocoder = useCallback(async (lnglat: [number, number]) => {
    if (mapInstanceRef.current && mapInstanceRef.current.reverseGeocoder) {
      try {
        return await mapInstanceRef.current.reverseGeocoder(lnglat)
      } catch (error) {
        console.error('逆地理编码失败:', error)
        throw error
      }
    }
    throw new Error('地图实例未初始化')
  }, [])

  return {
    mapRef,
    mapInstance: mapInstanceRef.current,
    isLoading,
    error,
    // 地图操作方法
    setCenter,
    setZoom,
    addMarker,
    clearMarkers,
    showRoute,
    searchPOI,
    geocoder,
    reverseGeocoder,
    // 重新初始化地图
    reinitMap: initMap
  }
}

/**
 * 简化版地图Hook，用于基础显示
 */
export const useSimpleMap = (
  containerId: string,
  options: UseAMapOptions = {}
) => {
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initSimpleMap = async () => {
      const container = document.getElementById(containerId)
      if (!container) return

      try {
        // 动态加载高德地图SDK
        await loadAMapSDK()

        // 获取AMap实例
        const AMap = getAMapInstance()
        if (!AMap) {
          throw new Error('高德地图SDK加载失败')
        }

        // 创建地图实例
        const map = new AMap.Map(container, {
          center: options.center || [120.1551, 30.2741],
          zoom: options.zoom || 12,
          mapStyle: `amap://styles/${options.mapStyle || 'normal'}`,
          viewMode: '2D',
          lang: 'zh_cn'
        })

        // 创建简化的地图实例包装器
        const instance: MapInstance = {
          setCenter: (newCenter: [number, number]) => {
            map.setCenter(new AMap.LngLat(newCenter[0], newCenter[1]))
          },
          setZoom: (newZoom: number) => {
            map.setZoom(newZoom)
          },
          addMarker: (poi: POI) => {
            const marker = new AMap.Marker({
              position: new AMap.LngLat(poi.location.lng, poi.location.lat),
              title: poi.name
            })
            marker.setMap(map)
          },
          clearMarkers: () => {
            map.clearMap()
          },
          showRoute: async () => {
            console.log('简化版地图不支持路线规划')
          },
          searchPOI: async () => {
            console.log('简化版地图不支持POI搜索')
            return []
          },
          geocoder: async () => {
            console.log('简化版地图不支持地理编码')
            return null
          },
          reverseGeocoder: async () => {
            console.log('简化版地图不支持逆地理编码')
            return null
          }
        }

        setMapInstance(instance)
        setIsReady(true)
        options.onMapReady?.(instance)
      } catch (error) {
        console.error('简单地图初始化失败:', error)
        options.onMapError?.(
          error instanceof Error ? error : new Error('地图初始化失败')
        )
      }
    }

    initSimpleMap()
  }, [containerId, options])

  return {
    mapInstance,
    isReady
  }
}
