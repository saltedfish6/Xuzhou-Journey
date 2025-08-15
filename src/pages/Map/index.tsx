import { useState, useEffect } from 'react'
import { Button, Input, Popup, Cell } from 'react-vant'
import { Search, Plus, Arrow } from '@react-vant/icons'
import { Toast } from '@/components/Toast'
import { useTitle } from '@/hooks/useTitle'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useItineraryStore } from '@/store/useItineraryStore'
import { useAMap, type POI } from '@/hooks/useAMap'
import styles from './map.module.styl'

const Map = () => {
  useTitle('地图 - 旅行助手')

  const [searchText, setSearchText] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<POI[]>([])
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [showPOIDetail, setShowPOIDetail] = useState(false)
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([])
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // 拖拽相关状态
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [cardTranslateY, setCardTranslateY] = useState(0)
  const [cardHeight, setCardHeight] = useState('50vh') // 默认高度
  const [isCardCollapsed, setIsCardCollapsed] = useState(false) // 卡片是否收起

  // 定位相关状态
  const [isLocating, setIsLocating] = useState(false) // 定位中状态
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null) // 定位精度
  const [lastLocationTime, setLastLocationTime] = useState<Date | null>(null) // 最后定位时间
  const [locationHistory, setLocationHistory] = useState<
    Array<{ lat: number; lng: number; time: Date; accuracy?: number }>
  >([]) // 定位历史

  // 使用地理位置Hook（禁用自动定位）
  const {
    latitude: _latitude,
    longitude: _longitude,
    error: locationError,
    getCurrentPosition,
    isDefaultLocation: _isDefaultLocation,
    loading: _locationLoading
  } = useGeolocation({ when: false })

  // 使用行程管理Store
  const { addItineraryItem, currentItinerary, createItinerary } =
    useItineraryStore()

  // 使用高德地图Hook
  const {
    mapRef,
    mapInstance: _mapInstance,
    isLoading: mapLoading,
    error: _mapError,
    setCenter,
    setZoom,
    addMarker,
    clearMarkers,
    showRoute,
    searchPOI
  } = useAMap({
    autoLocate: true, // 启用自动定位
    zoom: 12,
    onMapReady: (map) => {
      console.log('地图初始化完成:', map)
    },
    onMapError: (error) => {
      console.error('地图初始化失败:', error)
    }
  })

  // 初始化时设置默认位置（杭州）
  useEffect(() => {
    const defaultLat = 30.2741
    const defaultLng = 120.1551

    setCurrentLocation({
      lat: defaultLat,
      lng: defaultLng
    })

    // 设置地图中心为杭州
    setCenter([defaultLng, defaultLat])

    // 获取杭州周边POI
    fetchNearbyPOIs(defaultLat, defaultLng)
  }, [])

  // 获取周边POI
  const fetchNearbyPOIs = async (lat: number, lng: number) => {
    try {
      // 根据位置生成对应的POI数据
      const generateLocationBasedPOIs = (
        centerLat: number,
        centerLng: number
      ): POI[] => {
        // 判断位置区域，生成相应的POI
        let locationName = '未知地区'
        let province = '未知省'
        let city = '未知市'

        // 简单的地理位置判断（可以后续接入真实的地理编码API）
        if (
          centerLat >= 27 &&
          centerLat <= 29 &&
          centerLng >= 115 &&
          centerLng <= 117
        ) {
          locationName = '江西'
          province = '江西省'
          city = '南昌市'
        } else if (
          centerLat >= 29 &&
          centerLat <= 31 &&
          centerLng >= 119 &&
          centerLng <= 121
        ) {
          locationName = '杭州'
          province = '浙江省'
          city = '杭州市'
        } else if (
          centerLat >= 39 &&
          centerLat <= 41 &&
          centerLng >= 115 &&
          centerLng <= 118
        ) {
          locationName = '北京'
          province = '北京市'
          city = '北京市'
        } else if (
          centerLat >= 31 &&
          centerLat <= 32 &&
          centerLng >= 120 &&
          centerLng <= 122
        ) {
          locationName = '上海'
          province = '上海市'
          city = '上海市'
        }

        // 生成周边POI（在中心点附近随机分布）
        const pois: POI[] = []
        const poiTypes = ['景点', '餐厅', '购物', '酒店', '交通']
        const poiNames = {
          景点: ['风景区', '公园', '博物馆', '古迹', '广场'],
          餐厅: ['餐厅', '小吃店', '咖啡厅', '茶楼', '火锅店'],
          购物: ['购物中心', '商场', '超市', '专卖店', '市场'],
          酒店: ['酒店', '宾馆', '民宿', '客栈', '度假村'],
          交通: ['地铁站', '公交站', '停车场', '加油站', '服务区']
        }

        for (let i = 0; i < 6; i++) {
          const type = poiTypes[i % poiTypes.length]
          const nameOptions = poiNames[type as keyof typeof poiNames]
          const baseName =
            nameOptions[Math.floor(Math.random() * nameOptions.length)]

          // 在中心点周围生成随机位置（约1-3公里范围内）
          const offsetLat = (Math.random() - 0.5) * 0.03 // 约3公里范围
          const offsetLng = (Math.random() - 0.5) * 0.03
          const poiLat = centerLat + offsetLat
          const poiLng = centerLng + offsetLng

          // 计算距离（简单估算）
          const distance = Math.round(
            Math.sqrt(offsetLat * offsetLat + offsetLng * offsetLng) * 111000
          ) // 转换为米

          pois.push({
            id: `nearby_${i + 1}`,
            name: `${locationName}${baseName}${i + 1}`,
            address: `${province}${city}某某路${100 + i * 50}号`,
            location: { lat: poiLat, lng: poiLng },
            type,
            distance: Math.max(100, distance), // 最小100米
            rating: 3.5 + Math.random() * 1.5, // 3.5-5.0分
            photos: ['/placeholder.svg']
          })
        }

        return pois
      }

      const mockPOIs = generateLocationBasedPOIs(lat, lng)
      setNearbyPOIs(mockPOIs)

      // 在地图上添加标记（不清除用户位置标记）
      mockPOIs.forEach((poi) => {
        addMarker(poi)
      })
    } catch (error) {
      console.error('获取周边POI失败:', error)
      Toast.fail('获取周边信息失败')
    }
  }

  // 搜索POI
  const handleSearch = async () => {
    if (!searchText.trim()) {
      Toast.info('请输入搜索关键词')
      return
    }

    setIsSearching(true)

    try {
      console.log('开始搜索POI:', searchText)

      // 使用地图API搜索
      const results = await searchPOI(
        searchText,
        currentLocation ? [currentLocation.lng, currentLocation.lat] : undefined
      )

      console.log('搜索结果:', results)

      if (results && results.length > 0) {
        // 转换为标准POI格式
        const formattedResults: POI[] = results.map(
          (item: any, index: number) => ({
            id: `search_${index}`,
            name: item.name || `${searchText}相关地点${index + 1}`,
            address: item.address || item.district || item.adname || '地址未知',
            location: {
              lat:
                item.location?.lat ||
                item.location?.getLat?.() ||
                (currentLocation?.lat || 30.2741) +
                  (Math.random() - 0.5) * 0.01,
              lng:
                item.location?.lng ||
                item.location?.getLng?.() ||
                (currentLocation?.lng || 120.1551) +
                  (Math.random() - 0.5) * 0.01
            },
            type: item.type || item.typecode || '地点',
            rating: item.rating || 4.0 + Math.random() * 1.0,
            distance: item.distance
          })
        )

        console.log('格式化后的搜索结果:', formattedResults)
        setSearchResults(formattedResults)

        // 在地图上显示搜索结果
        clearMarkers()

        // 重新添加用户位置标记（如果存在）
        if (currentLocation) {
          const userLocationPOI: POI = {
            id: 'user_location',
            name: '我的位置',
            address: '当前位置',
            location: { lat: currentLocation.lat, lng: currentLocation.lng },
            type: '位置',
            rating: 5.0
          }
          addMarker(userLocationPOI)
        }

        // 添加搜索结果标记
        formattedResults.forEach((poi) => {
          addMarker(poi)
        })

        Toast.success(`找到 ${formattedResults.length} 个相关地点`)
      } else {
        // 如果API搜索无结果，生成基于当前位置的模拟数据
        console.log('API搜索无结果，使用模拟数据')

        const baseLat = currentLocation?.lat || 30.2741
        const baseLng = currentLocation?.lng || 120.1551
        const baseAddress = currentLocation ? '当前位置附近' : '杭州市'

        const mockResults: POI[] = [
          {
            id: 'search_1',
            name: `${searchText}相关景点`,
            address: `${baseAddress}某某路123号`,
            location: {
              lat: baseLat + (Math.random() - 0.5) * 0.01,
              lng: baseLng + (Math.random() - 0.5) * 0.01
            },
            type: '景点',
            rating: 4.7
          },
          {
            id: 'search_2',
            name: `${searchText}相关餐厅`,
            address: `${baseAddress}某某街456号`,
            location: {
              lat: baseLat + (Math.random() - 0.5) * 0.01,
              lng: baseLng + (Math.random() - 0.5) * 0.01
            },
            type: '餐厅',
            rating: 4.4
          },
          {
            id: 'search_3',
            name: `${searchText}相关商店`,
            address: `${baseAddress}某某大道789号`,
            location: {
              lat: baseLat + (Math.random() - 0.5) * 0.01,
              lng: baseLng + (Math.random() - 0.5) * 0.01
            },
            type: '购物',
            rating: 4.2
          }
        ]

        setSearchResults(mockResults)
        clearMarkers()

        // 重新添加用户位置标记（如果存在）
        if (currentLocation) {
          const userLocationPOI: POI = {
            id: 'user_location',
            name: '我的位置',
            address: '当前位置',
            location: { lat: currentLocation.lat, lng: currentLocation.lng },
            type: '位置',
            rating: 5.0
          }
          addMarker(userLocationPOI)
        }

        mockResults.forEach((poi) => {
          addMarker(poi)
        })

        Toast.info(`未找到"${searchText}"的精确结果，显示相关推荐`)
      }
    } catch (error) {
      console.error('搜索失败:', error)
      Toast.fail('搜索服务暂时不可用，请稍后重试')

      // 搜索异常时也提供降级体验
      const baseLat = currentLocation?.lat || 30.2741
      const baseLng = currentLocation?.lng || 120.1551
      const baseAddress = currentLocation ? '当前位置附近' : '杭州市'

      const fallbackResults: POI[] = [
        {
          id: 'fallback_1',
          name: `${searchText}`,
          address: `${baseAddress}推荐地点`,
          location: {
            lat: baseLat + (Math.random() - 0.5) * 0.01,
            lng: baseLng + (Math.random() - 0.5) * 0.01
          },
          type: '推荐',
          rating: 4.0
        }
      ]

      setSearchResults(fallbackResults)
      clearMarkers()

      if (currentLocation) {
        const userLocationPOI: POI = {
          id: 'user_location',
          name: '我的位置',
          address: '当前位置',
          location: { lat: currentLocation.lat, lng: currentLocation.lng },
          type: '位置',
          rating: 5.0
        }
        addMarker(userLocationPOI)
      }

      fallbackResults.forEach((poi) => {
        addMarker(poi)
      })
    } finally {
      setIsSearching(false)
    }
  }

  // 选择POI
  const handleSelectPOI = (poi: POI) => {
    setSelectedPOI(poi)
    setShowPOIDetail(true)

    // 地图中心移动到选中的POI
    setCenter([poi.location.lng, poi.location.lat])
    setZoom(16)
  }

  // 添加到行程
  const handleAddToItinerary = async () => {
    if (!selectedPOI) return

    try {
      // 如果没有当前行程，先创建一个默认行程
      let itineraryId = currentItinerary?.id

      if (!itineraryId) {
        const today = new Date().toISOString().split('T')[0]
        itineraryId = await createItinerary({
          title: '我的旅行计划',
          description: '通过地图添加的行程',
          startDate: today,
          endDate: today,
          destination:
            selectedPOI.address.split('省')[1]?.split('市')[0] || '未知',
          items: [],
          isPublic: false,
          tags: ['地图添加']
        })
      }

      // 添加POI到行程
      await addItineraryItem(itineraryId, {
        name: selectedPOI.name,
        address: selectedPOI.address,
        latitude: selectedPOI.location.lat,
        longitude: selectedPOI.location.lng,
        type:
          selectedPOI.type === '景点'
            ? 'attraction'
            : selectedPOI.type === '餐厅'
              ? 'restaurant'
              : 'other',
        duration: 60, // 默认停留1小时
        rating: selectedPOI.rating
      })

      Toast.success('已添加到行程')
      setShowPOIDetail(false)
    } catch (error) {
      console.error('添加到行程失败:', error)
      Toast.fail('添加失败，请重试')
    }
  }

  // 获取当前位置
  const handleGetCurrentLocation = async () => {
    if (isLocating) {
      Toast.info('正在定位中，请稍候...')
      return
    }

    setIsLocating(true)
    const hideLoading = Toast.loading('正在获取高精度位置...')

    try {
      // 强制获取最新位置，不使用缓存
      try {
        const position = await getCurrentPosition()

        // 定位成功，使用返回的位置信息
        const coords = position.coords
        const currentTime = new Date()

        hideLoading()

        // 显示定位精度信息
        const accuracy = Math.round(coords.accuracy)
        setLocationAccuracy(accuracy)
        setLastLocationTime(currentTime)

        if (accuracy <= 10) {
          Toast.success(`定位成功 (精度: ${accuracy}m)`)
        } else if (accuracy <= 50) {
          Toast.success(`定位成功 (精度: ${accuracy}m, 建议移至空旷区域)`)
        } else {
          Toast.info(`定位成功 (精度: ${accuracy}m, 精度较低)`)
        }

        // 先清除现有标记，确保地图显示最新位置
        clearMarkers()

        // 更新当前位置状态
        const newLocation = {
          lat: coords.latitude,
          lng: coords.longitude
        }
        setCurrentLocation(newLocation)

        // 添加到定位历史
        setLocationHistory((prev) => {
          const newHistory = [
            {
              lat: coords.latitude,
              lng: coords.longitude,
              time: currentTime,
              accuracy: accuracy
            },
            ...prev.slice(0, 9)
          ] // 保留最近10次定位记录
          return newHistory
        })

        // 更新地图中心并放大
        setCenter([coords.longitude, coords.latitude])
        setZoom(17) // 提高缩放级别以显示更多细节

        // 添加用户当前位置标记
        const userLocationPOI: POI = {
          id: 'user_location',
          name: `我的位置 (精度: ${accuracy}m)`,
          address: `当前位置 · ${currentTime.toLocaleTimeString()}`,
          location: { lat: coords.latitude, lng: coords.longitude },
          type: '位置',
          rating: 5.0
        }
        addMarker(userLocationPOI)

        // 获取用户位置的周边POI
        fetchNearbyPOIs(coords.latitude, coords.longitude)
      } catch (error: any) {
        // 定位失败，使用默认位置
        hideLoading()
        setLocationAccuracy(null)

        // 根据错误类型显示不同提示
        if (error.code === 1) {
          Toast.info(
            '位置权限被拒绝，已使用默认位置（杭州）\n请在浏览器设置中允许位置访问'
          )
        } else if (error.code === 2) {
          Toast.info(
            '位置服务不可用，已使用默认位置（杭州）\n请检查设备的位置服务是否开启'
          )
        } else if (error.code === 3) {
          Toast.info(
            '位置获取超时，已使用默认位置（杭州）\n请移至信号较好的区域重试'
          )
        } else {
          Toast.info('位置获取失败，已使用默认位置（杭州）')
        }

        // 使用默认位置（杭州）
        const defaultLat = 30.2741
        const defaultLng = 120.1551
        const currentTime = new Date()

        setCurrentLocation({
          lat: defaultLat,
          lng: defaultLng
        })
        setLastLocationTime(currentTime)

        setCenter([defaultLng, defaultLat])
        setZoom(16)

        // 清除现有标记并添加默认位置标记
        clearMarkers()

        // 添加默认位置标记（杭州）
        const defaultLocationPOI: POI = {
          id: 'default_location',
          name: '默认位置（杭州）',
          address: `浙江省杭州市 · ${currentTime.toLocaleTimeString()}`,
          location: { lat: defaultLat, lng: defaultLng },
          type: '位置',
          rating: 4.5
        }
        addMarker(defaultLocationPOI)

        fetchNearbyPOIs(defaultLat, defaultLng)
      }
    } catch (error) {
      hideLoading()
      console.error('位置获取过程出错:', error)
      Toast.fail('位置服务出错，请稍后重试')
      setLocationAccuracy(null)
    } finally {
      setIsLocating(false)
    }
  }

  // 显示路线
  const handleShowRoute = () => {
    if (!currentLocation || !selectedPOI) {
      Toast.info('请先获取当前位置')
      return
    }

    showRoute(
      [currentLocation.lng, currentLocation.lat],
      [selectedPOI.location.lng, selectedPOI.location.lat]
    )

    Toast.success('路线规划完成')
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      景点: '#ff6b6b',
      餐厅: '#4ecdc4',
      购物: '#45b7d1',
      酒店: '#96ceb4',
      交通: '#feca57'
    }
    return colors[type] || '#95a5a6'
  }

  // 拖拽事件处理
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    // 只在拖拽手柄区域或卡片顶部区域触发拖拽
    const target = e.target as HTMLElement
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const relativeY = clientY - rect.top

    // 只有在顶部40px区域内才允许拖拽
    if (relativeY > 40) return

    // 防止在输入框等交互元素上触发拖拽
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.closest('input, button')
    ) {
      return
    }

    setIsDragging(true)
    setDragStartY(clientY)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return

    e.preventDefault()
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - dragStartY

    // 动态限制拖拽范围
    const maxDrag = window.innerHeight * 0.6 // 最多向下拖拽60vh
    const minDrag = 0 // 向上拖拽时不允许超出底部边界

    const newTranslateY = Math.max(minDrag, Math.min(maxDrag, deltaY))
    setCardTranslateY(newTranslateY)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    // 根据拖拽距离决定最终位置
    if (cardTranslateY > window.innerHeight * 0.15) {
      // 向下拖拽超过15vh，收起卡片但保留可见部分
      const minVisibleHeight = 80 // 最少保留80px可见
      const collapseTranslate = window.innerHeight * 0.7 - minVisibleHeight
      setCardTranslateY(collapseTranslate)
      setCardHeight('30vh')
      setIsCardCollapsed(true)
    } else if (
      cardTranslateY < window.innerHeight * 0.05 &&
      dragStartY > window.innerHeight * 0.5
    ) {
      // 从下方向上拖拽，展开卡片但底部固定在屏幕底部，确保不覆盖顶部按钮
      setCardTranslateY(0)
      setCardHeight('calc(100vh - 100px)')
      setIsCardCollapsed(false)
    } else {
      // 回到默认位置
      setCardTranslateY(0)
      setCardHeight('50vh')
      setIsCardCollapsed(false)
    }
  }

  // 添加全局事件监听
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e as any)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e as any)
    const handleTouchEnd = () => handleDragEnd()

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false
      })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragStartY, cardTranslateY])

  // 搜索图标点击处理
  const handleSearchIconClick = () => {
    setCardTranslateY(0)
    setCardHeight('50vh')
    setIsCardCollapsed(false)
  }

  return (
    <div className={styles.container}>
      {/* 地图容器 */}
      <div className={styles.mapContainer}>
        <div ref={mapRef} className={styles.map}>
          {/* 地图加载状态 */}
          {mapLoading && (
            <div className={styles.mapLoading}>
              <div className={styles.loadingIcon}>🗺️</div>
              <div className={styles.loadingText}>地图加载中...</div>
            </div>
          )}
        </div>

        {/* 地图控制按钮 */}
        <div className={styles.mapControls}>
          <div
            className={`${styles.controlButton} ${isLocating ? styles.locating : ''}`}
            onClick={handleGetCurrentLocation}
            title={isLocating ? '定位中...' : '定位到当前位置'}
          >
            <div className={styles.controlIcon}>{isLocating ? '🎯' : '📍'}</div>
            {/* 定位精度和时间信息 */}
            {locationAccuracy && lastLocationTime && !isLocating && (
              <div className={styles.locationInfo}>
                <div className={styles.locationAccuracy}>
                  {locationAccuracy}m
                </div>
                <div className={styles.locationTime}>
                  {lastLocationTime.toLocaleTimeString().slice(0, 5)}
                </div>
              </div>
            )}
          </div>

          {/* 搜索图标 - 只在卡片收起时显示 */}
          {isCardCollapsed && (
            <div
              className={styles.searchButton}
              onClick={handleSearchIconClick}
              title="打开搜索"
            >
              <div className={styles.controlIcon}>🔍</div>
            </div>
          )}
        </div>

        {/* 位置错误提示 */}
        {locationError && (
          <div className={styles.errorText}>
            {locationError.code === 1
              ? '请在浏览器设置中允许位置访问，或手动搜索地点'
              : locationError.code === 2
                ? '位置服务不可用，已使用默认位置（杭州）'
                : locationError.code === 3
                  ? '位置获取超时，已使用默认位置（杭州）'
                  : '位置获取失败，已使用默认位置（杭州）'}
          </div>
        )}
      </div>

      {/* 底部POI列表 */}
      <div
        className={styles.poiList}
        style={{
          transform: `translateY(${cardTranslateY}px)`,
          maxHeight: cardHeight,
          transition: isDragging
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), max-height 0.3s ease'
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* 搜索栏 - 移到卡片内部 */}
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <Input
              value={searchText}
              onChange={setSearchText}
              placeholder="搜索地点、景点、餐厅..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <Button
              type="primary"
              size="small"
              loading={isSearching}
              onClick={handleSearch}
              className={styles.searchButton}
            >
              <Search />
            </Button>
          </div>
        </div>

        <div className={styles.poiHeader}>
          <h3>
            {searchResults.length > 0 ? '搜索结果' : '周边推荐'}
            <span className={styles.poiCount}>
              (
              {searchResults.length > 0
                ? searchResults.length
                : nearbyPOIs.length}
              )
            </span>
          </h3>

          {/* 定位历史记录 */}
          {locationHistory.length > 0 && searchResults.length === 0 && (
            <div className={styles.locationHistory}>
              <div className={styles.historyTitle}>📍 最近定位</div>
              <div className={styles.historyList}>
                {locationHistory.slice(0, 3).map((location, index) => (
                  <div
                    key={index}
                    className={styles.historyItem}
                    onClick={() => {
                      setCenter([location.lng, location.lat])
                      setZoom(17)
                      Toast.info(`已定位到 ${location.time.toLocaleString()}`)
                    }}
                  >
                    <div className={styles.historyTime}>
                      {location.time.toLocaleTimeString().slice(0, 5)}
                    </div>
                    <div className={styles.historyAccuracy}>
                      {location.accuracy ? `${location.accuracy}m` : '未知精度'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.poiItems}>
          {(searchResults.length > 0 ? searchResults : nearbyPOIs).map(
            (poi) => (
              <div
                key={poi.id}
                className={`${styles.poiItem} ${selectedPOI?.id === poi.id ? styles.poiItemSelected : ''}`}
                onClick={() => handleSelectPOI(poi)}
              >
                <div className={styles.poiInfo}>
                  <div className={styles.poiName}>{poi.name}</div>
                  <div className={styles.poiAddress}>{poi.address}</div>
                  <div className={styles.poiMeta}>
                    <span
                      className={styles.poiType}
                      style={{ backgroundColor: getTypeColor(poi.type) }}
                    >
                      {poi.type}
                    </span>
                    {poi.rating && (
                      <span className={styles.poiRating}>
                        ⭐ {poi.rating.toFixed(1)}
                      </span>
                    )}
                    {poi.distance && (
                      <span className={styles.poiDistance}>
                        {poi.distance}m
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.poiActions}>
                  <Arrow className={styles.poiArrow} />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* POI详情弹窗 */}
      <Popup
        visible={showPOIDetail}
        onClose={() => setShowPOIDetail(false)}
        position="bottom"
        round
        className={styles.poiDetailPopup}
      >
        {selectedPOI && (
          <div className={styles.poiDetail}>
            <div className={styles.poiDetailHeader}>
              <h2>{selectedPOI.name}</h2>
              <span
                className={styles.poiDetailType}
                style={{ backgroundColor: getTypeColor(selectedPOI.type) }}
              >
                {selectedPOI.type}
              </span>
            </div>

            <div className={styles.poiDetailInfo}>
              <Cell title="地址" value={selectedPOI.address} />
              {selectedPOI.rating && (
                <Cell
                  title="评分"
                  value={`⭐ ${selectedPOI.rating.toFixed(1)}`}
                />
              )}
              {selectedPOI.distance && (
                <Cell title="距离" value={`${selectedPOI.distance}m`} />
              )}
            </div>

            <div className={styles.poiDetailActions}>
              <Button
                type="default"
                size="large"
                onClick={handleShowRoute}
                className={styles.routeButton}
              >
                查看路线
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleAddToItinerary}
                className={styles.addButton}
              >
                <Plus /> 添加到行程
              </Button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )
}

export default Map
