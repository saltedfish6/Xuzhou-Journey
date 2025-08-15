/**
 * 地图SDK动态加载器
 * 支持高德地图的动态加载和初始化
 */

// 地图SDK加载状态
let isLoading = false
let isLoaded = false
let loadPromise: Promise<void> | null = null

// 声明全局AMap类型
declare global {
  interface Window {
    AMap?: any
    _AMapSecurityConfig?: {
      securityJsCode: string
    }
  }
}

/**
 * 动态加载高德地图SDK
 * @returns Promise<void>
 */
export const loadAMapSDK = (): Promise<void> => {
  // 如果已经加载完成，直接返回
  if (isLoaded && window.AMap) {
    return Promise.resolve()
  }

  // 如果正在加载，返回现有的Promise
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // 开始加载
  isLoading = true

  loadPromise = new Promise((resolve, reject) => {
    try {
      // 获取API密钥
      const apiKey = import.meta.env.VITE_AMAP_KEY

      if (!apiKey) {
        throw new Error(
          '高德地图API密钥未配置，请在.env.local中设置VITE_AMAP_KEY'
        )
      }

      // 设置安全密钥（如果有的话）
      const securityCode = import.meta.env.VITE_AMAP_SECURITY_CODE
      if (securityCode) {
        window._AMapSecurityConfig = {
          securityJsCode: securityCode
        }
      }

      // 创建script标签
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.defer = true

      // 构建SDK URL，包含常用插件
      const plugins = [
        'AMap.Geocoder', // 地理编码
        'AMap.PlaceSearch', // POI搜索
        'AMap.Driving', // 驾车路线规划
        'AMap.Walking', // 步行路线规划
        'AMap.Geolocation', // 定位
        'AMap.CitySearch', // 城市查询
        'AMap.AutoComplete' // 输入提示
      ].join(',')

      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=${plugins}`

      // 加载成功回调
      script.onload = () => {
        if (window.AMap) {
          isLoaded = true
          isLoading = false
          console.log('高德地图SDK加载成功')
          resolve()
        } else {
          const error = new Error('高德地图SDK加载失败：AMap对象未找到')
          console.error(error)
          isLoading = false
          reject(error)
        }
      }

      // 加载失败回调
      script.onerror = (event) => {
        const error = new Error(`高德地图SDK加载失败：网络错误 ${event}`)
        console.error(error)
        isLoading = false
        reject(error)
      }

      // 超时处理
      const timeout = setTimeout(() => {
        if (isLoading) {
          const error = new Error('高德地图SDK加载超时')
          console.error(error)
          isLoading = false
          reject(error)
        }
      }, 10000) // 10秒超时

      script.onload = () => {
        clearTimeout(timeout)
        if (window.AMap) {
          isLoaded = true
          isLoading = false
          console.log('高德地图SDK加载成功')
          resolve()
        } else {
          const error = new Error('高德地图SDK加载失败：AMap对象未找到')
          console.error(error)
          isLoading = false
          reject(error)
        }
      }

      // 添加到页面
      document.head.appendChild(script)
    } catch (error) {
      isLoading = false
      const err = error instanceof Error ? error : new Error('未知错误')
      console.error('加载高德地图SDK时发生错误:', err)
      reject(err)
    }
  })

  return loadPromise
}

/**
 * 检查地图SDK是否已加载
 * @returns boolean
 */
export const isAMapLoaded = (): boolean => {
  return isLoaded && !!window.AMap
}

/**
 * 获取地图SDK实例
 * @returns AMap实例或null
 */
export const getAMapInstance = () => {
  return window.AMap || null
}

/**
 * 重置加载状态（用于测试或重新加载）
 */
export const resetLoadState = () => {
  isLoading = false
  isLoaded = false
  loadPromise = null
}

/**
 * 预加载地图SDK（可选）
 * 在应用启动时调用，提前加载地图SDK
 */
export const preloadAMapSDK = () => {
  // 延迟加载，避免阻塞首屏渲染
  setTimeout(() => {
    loadAMapSDK().catch((error) => {
      console.warn('地图SDK预加载失败:', error)
    })
  }, 2000)
}
