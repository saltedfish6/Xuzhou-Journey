/**
 * 地图配置管理
 * 统一管理地图相关的配置信息
 */

export interface MapConfig {
  // API密钥配置
  amapKey: string
  amapWebServiceKey: string
  baiduMapKey: string

  // 默认地图设置
  defaultCenter: [number, number]
  defaultZoom: number
  mapStyle: string

  // 搜索配置
  searchRadius: number
  maxSearchResults: number

  // 路线规划配置
  routeTypes: ('driving' | 'walking' | 'transit')[]

  // POI类型配置
  poiTypes: {
    [key: string]: {
      name: string
      color: string
      icon: string
    }
  }
}

/**
 * 获取地图配置
 */
export const getMapConfig = (): MapConfig => {
  return {
    // API密钥
    amapKey: import.meta.env.VITE_AMAP_KEY || '',
    amapWebServiceKey: import.meta.env.VITE_AMAP_WEB_SERVICE_KEY || '',
    baiduMapKey: import.meta.env.VITE_BAIDU_MAP_KEY || '',

    // 默认设置（杭州）
    defaultCenter: [120.1551, 30.2741],
    defaultZoom: 12,
    mapStyle: 'amap://styles/normal',

    // 搜索配置
    searchRadius: 5000, // 5km
    maxSearchResults: 20,

    // 路线类型
    routeTypes: ['driving', 'walking', 'transit'],

    // POI类型配置
    poiTypes: {
      景点: {
        name: '景点',
        color: '#ff6b6b',
        icon: '🏛️'
      },
      餐厅: {
        name: '餐厅',
        color: '#4ecdc4',
        icon: '🍽️'
      },
      购物: {
        name: '购物',
        color: '#45b7d1',
        icon: '🛍️'
      },
      酒店: {
        name: '酒店',
        color: '#96ceb4',
        icon: '🏨'
      },
      交通: {
        name: '交通',
        color: '#feca57',
        icon: '🚇'
      },
      医疗: {
        name: '医疗',
        color: '#ff9ff3',
        icon: '🏥'
      },
      教育: {
        name: '教育',
        color: '#54a0ff',
        icon: '🎓'
      },
      娱乐: {
        name: '娱乐',
        color: '#5f27cd',
        icon: '🎮'
      },
      其他: {
        name: '其他',
        color: '#95a5a6',
        icon: '📍'
      }
    }
  }
}

/**
 * 验证地图配置
 */
export const validateMapConfig = (config: MapConfig): boolean => {
  // 检查必要的API密钥
  if (!config.amapKey && !config.baiduMapKey) {
    console.error('地图配置错误: 缺少API密钥')
    return false
  }

  // 检查默认中心点
  if (!config.defaultCenter || config.defaultCenter.length !== 2) {
    console.error('地图配置错误: 默认中心点格式不正确')
    return false
  }

  // 检查默认缩放级别
  if (config.defaultZoom < 1 || config.defaultZoom > 20) {
    console.error('地图配置错误: 默认缩放级别超出范围')
    return false
  }

  return true
}

/**
 * 获取POI类型配置
 */
export const getPOITypeConfig = (type: string) => {
  const config = getMapConfig()
  return config.poiTypes[type] || config.poiTypes['其他']
}

/**
 * 获取所有支持的POI类型
 */
export const getAllPOITypes = () => {
  const config = getMapConfig()
  return Object.keys(config.poiTypes)
}

/**
 * 根据环境获取地图服务商
 */
export const getMapProvider = (): 'amap' | 'baidu' | 'fallback' => {
  const config = getMapConfig()

  if (config.amapKey) {
    return 'amap'
  } else if (config.baiduMapKey) {
    return 'baidu'
  } else {
    return 'fallback'
  }
}

/**
 * 地图错误处理配置
 */
export const mapErrorMessages = {
  INIT_FAILED: '地图初始化失败',
  API_KEY_INVALID: 'API密钥无效或已过期',
  NETWORK_ERROR: '网络连接错误',
  LOCATION_DENIED: '位置访问被拒绝',
  LOCATION_UNAVAILABLE: '位置服务不可用',
  LOCATION_TIMEOUT: '位置获取超时',
  SEARCH_FAILED: '搜索服务失败',
  ROUTE_FAILED: '路线规划失败',
  GEOCODE_FAILED: '地理编码失败'
}

/**
 * 获取错误信息
 */
export const getErrorMessage = (
  errorCode: keyof typeof mapErrorMessages
): string => {
  return mapErrorMessages[errorCode] || '未知错误'
}
