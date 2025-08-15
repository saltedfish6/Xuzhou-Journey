import { useState, useEffect, useCallback } from 'react'

interface GeolocationState {
  loading: boolean
  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  latitude: number | null
  longitude: number | null
  speed: number | null
  timestamp: number | null
  error: GeolocationPositionError | null
  isDefaultLocation: boolean // 新增：标记是否使用默认位置
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  when?: boolean
}

/**
 * 地理位置 Hook
 * @param options 地理位置选项
 * @returns 地理位置状态和方法
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    enableHighAccuracy = false,
    timeout = 5000,
    maximumAge = 0,
    when = true
  } = options

  const [state, setState] = useState<GeolocationState>({
    loading: false,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
    isDefaultLocation: false // 初始化为false
  })

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        isDefaultLocation: true,
        error: {
          code: 2,
          message: '浏览器不支持地理位置服务'
        } as GeolocationPositionError
      }))
      return Promise.reject(new Error('浏览器不支持地理位置服务'))
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      isDefaultLocation: false // 重置默认位置标志
    }))

    return new Promise<GeolocationPosition>((resolve, reject) => {
      console.log('开始获取地理位置...')

      const onSuccess = (position: GeolocationPosition) => {
        console.log('地理位置获取成功:', position.coords)
        setState({
          loading: false,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          error: null,
          isDefaultLocation: false // 使用真实位置
        })
        resolve(position)
      }

      const onError = (error: GeolocationPositionError) => {
        console.warn('地理位置获取失败:', error.message, error.code)

        // 提供默认位置（杭州）作为fallback
        setState({
          loading: false,
          accuracy: null,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: 30.2741, // 杭州纬度
          longitude: 120.1551, // 杭州经度
          speed: null,
          timestamp: Date.now(),
          error,
          isDefaultLocation: true // 标记为使用默认位置
        })
        reject(error)
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true, // 尝试获取高精度位置
        timeout: 20000, // 增加超时时间到20秒
        maximumAge: 0 // 不使用缓存，每次都获取最新位置
      })
    })
  }, [enableHighAccuracy, timeout, maximumAge])

  useEffect(() => {
    if (when) {
      getCurrentPosition()
    }
  }, [when, getCurrentPosition])

  return {
    ...state,
    getCurrentPosition,
    isDefaultLocation: state.isDefaultLocation
  }
}

export default useGeolocation
