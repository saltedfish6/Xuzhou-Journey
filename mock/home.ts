// 首页相关的 mock 数据

// 目的地列表
const destinations = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '西安',
  '南京',
  '武汉',
  '重庆',
  '苏州',
  '天津',
  '青岛',
  '大连',
  '厦门',
  '三亚',
  '丽江',
  '桂林',
  '张家界',
  '九寨沟',
  '黄山',
  '泰山',
  '华山',
  '峨眉山',
  '普陀山',
  '五台山',
  '武当山',
  '庐山',
  '雁荡山',
  '天山'
]

// 作者列表
const authors = [
  '旅行达人小王',
  '摄影师李明',
  '背包客张三',
  '美食探索者',
  '文艺青年小李',
  '户外运动爱好者',
  '历史文化学者',
  '自然风光摄影师',
  '城市探索者',
  '民俗文化研究者',
  '建筑艺术爱好者',
  '美食评论家',
  '旅游博主',
  '风景摄影师',
  '文化传播者'
]

// 图片URL列表 - 使用mockjs生成真实图片数据
const imageUrls = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=650&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1418065460487-3d7063cd9e06?w=400&h=480&fit=crop',
  'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=620&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=580&fit=crop',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=640&fit=crop',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=520&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=680&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1418065460487-3d7063cd9e06?w=400&h=620&fit=crop'
]

// 为瀑布流提供不同的高度，创造更好的视觉效果
const imageHeights = [
  600, 500, 650, 550, 700, 480, 620, 580, 640, 520, 600, 560, 680, 500, 620
]

// 标题模板
const titleTemplates = [
  '探索{destination}的隐秘角落',
  '{destination}三日游完美攻略',
  '在{destination}遇见最美的风景',
  '{destination}美食地图大揭秘',
  '漫步{destination}，感受历史文化',
  '{destination}摄影指南：捕捉最美瞬间',
  '{destination}深度游：当地人推荐路线',
  '初次到{destination}必去的10个地方',
  '{destination}夜生活体验指南',
  '在{destination}寻找诗和远方'
]

// 描述模板
const descriptionTemplates = [
  '这里有着令人惊叹的自然风光和深厚的文化底蕴，每一处风景都值得细细品味。',
  '跟随我的脚步，一起探索这座城市的独特魅力，发现那些不为人知的美丽角落。',
  '用镜头记录下最美的瞬间，用心感受这里的人文风情和自然之美。',
  '品尝地道美食，体验当地文化，这趟旅程将给你留下难忘的回忆。',
  '从历史古迹到现代建筑，从传统文化到时尚潮流，这里应有尽有。',
  '在这片土地上，每一步都是风景，每一眼都是惊喜。',
  '让我们一起走进这个充满魅力的地方，感受它独特的韵味。',
  '这里不仅有美丽的风景，更有温暖的人情和丰富的文化内涵。'
]

// 生成瀑布流数据的函数
function generateWaterfallData(count: number = 20) {
  const data: Array<{
    id: number
    title: string
    description: string
    imageUrl: string
    height: number
    author: string
    destination: string
    likes: number
    views: number
    publishTime: string
    tags: string[]
  }> = []

  for (let i = 1; i <= count; i++) {
    const destination =
      destinations[Math.floor(Math.random() * destinations.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]
    const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]
    const titleTemplate =
      titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
    const description =
      descriptionTemplates[
        Math.floor(Math.random() * descriptionTemplates.length)
      ]
    const height = imageHeights[Math.floor(Math.random() * imageHeights.length)]

    // 为图片URL添加随机参数避免缓存
    const randomParam = Math.floor(Math.random() * 10000)
    const timestampParam = Date.now()
    const finalImageUrl = `${imageUrl}&random=${randomParam}&t=${timestampParam}`

    data.push({
      id: i,
      title: titleTemplate.replace('{destination}', destination),
      description,
      imageUrl: finalImageUrl,
      height: height,
      author,
      destination,
      likes: Math.floor(Math.random() * 1000) + 10,
      views: Math.floor(Math.random() * 5000) + 100,
      publishTime: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tags: [
        destination,
        ['旅行', '摄影', '美食', '文化', '自然'][Math.floor(Math.random() * 5)],
        ['攻略', '体验', '分享', '推荐'][Math.floor(Math.random() * 4)]
      ]
    })
  }

  return data
}

// 首页瀑布流接口 mock
export const homeMock = {
  '/api/home/waterfall': (page: number = 1, pageSize: number = 20) => {
    const data = generateWaterfallData(pageSize)

    // 模拟分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = data.slice(startIndex, endIndex)

    return {
      items: paginatedData,
      total: 1000, // 模拟总数
      page,
      pageSize,
      hasMore: page < 50 // 模拟还有更多数据
    }
  },

  '/api/home/recommendations': () => {
    const recommendations = generateWaterfallData(10)

    return recommendations
  },

  '/api/home/trending': () => {
    const trending = generateWaterfallData(8).map((item) => ({
      ...item,
      trendingScore: Math.floor(Math.random() * 100) + 50
    }))

    return trending.sort((a, b) => b.trendingScore - a.trendingScore)
  }
}

export { generateWaterfallData }
export default homeMock
