/**
 * 图片优化工具
 */

// 图片缓存
export const imageCache = new Set<string>()

/**
 * 生成优化后的图片URL
 * 根据设备屏幕宽度和设备像素比生成合适尺寸的图片
 */
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  // 如果URL已经包含优化参数或者是base64，则直接返回
  if (!url || url.startsWith('data:') || url.includes('?x-oss-process=')) {
    return url
  }

  // 获取设备像素比
  const pixelRatio = window.devicePixelRatio || 1

  // 计算合适的图片宽度
  const screenWidth = window.innerWidth
  const columnCount = screenWidth > 768 ? 3 : 2
  const imageWidth =
    width || Math.floor((screenWidth / columnCount) * pixelRatio)

  // 对于阿里云OSS，添加图片处理参数
  if (url.includes('aliyuncs.com')) {
    return `${url}?x-oss-process=image/resize,w_${imageWidth}/format,webp/quality,q_75`
  }

  // 对于腾讯云COS，添加图片处理参数
  if (url.includes('myqcloud.com')) {
    return `${url}?imageView2/2/w/${imageWidth}/format/webp/q/75`
  }

  // 对于七牛云，添加图片处理参数
  if (url.includes('qiniucdn.com')) {
    return `${url}?imageView2/2/w/${imageWidth}/format/webp/q/75`
  }

  // 默认返回原始URL
  return url
}

/**
 * 预加载图片
 * @param urls 图片URL数组
 * @param priority 是否高优先级加载
 */
export const preloadImages = (
  urls: string[],
  priority: boolean = false
): void => {
  if (!urls || urls.length === 0) return

  urls.forEach((url) => {
    // 如果已经缓存，则跳过
    if (imageCache.has(url)) return

    const img = new Image()
    if (priority) {
      img.fetchPriority = 'high'
    }
    img.src = getOptimizedImageUrl(url)

    img.onload = () => {
      imageCache.add(url)
    }
  })
}

/**
 * 获取图片的预估高度
 * 根据图片URL中的尺寸信息或默认比例计算
 */
export const estimateImageHeight = (url: string, width: number): number => {
  // 默认宽高比 4:3
  const defaultRatio = 0.75

  // 尝试从URL中提取尺寸信息
  try {
    // 一些图片服务会在URL中包含尺寸信息
    const match = url.match(/(\d+)[xX](\d+)/)
    if (match && match.length >= 3) {
      const originalWidth = parseInt(match[1])
      const originalHeight = parseInt(match[2])
      if (
        !isNaN(originalWidth) &&
        !isNaN(originalHeight) &&
        originalWidth > 0
      ) {
        return Math.floor(width * (originalHeight / originalWidth))
      }
    }
  } catch (e) {
    console.error('解析图片尺寸失败', e)
  }

  // 返回默认高度
  return Math.floor(width * defaultRatio)
}
