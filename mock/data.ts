import Mock from 'mockjs'

// 定义接口类型（可选，提升可维护性）
interface WaterfallItem {
  id: string
  imageUrl: string
  title: string
  description: string
  author: string
  likes: number
  height: number
  tab: string
}

export default [
  // 搜索接口
  {
    url: '/api/search',
    method: 'get',
    timeout: 1000,
    response: (req: { query?: { keyword?: string } }) => {
      const keyword = req.query?.keyword || ''

      // 预定义的城市和景点数据
      const allSuggestions = [
        // 江西相关
        '江西南昌',
        '江西九江',
        '江西赣州',
        '江西上饶',
        '江西抚州',
        '江西宜春',
        '江西吉安',
        '江西景德镇',
        '江西萍乡',
        '江西新余',
        '江西鹰潭',
        '江西庐山',
        '江西井冈山',
        '江西三清山',
        '江西龙虎山',
        '江西明月山',
        '江西滕王阁',
        '江西婺源',
        '江西瑞金',
        '江西安源',

        // 其他热门城市和景点
        '北京故宫',
        '北京天安门',
        '北京长城',
        '北京颐和园',
        '上海外滩',
        '上海迪士尼',
        '上海东方明珠',
        '上海豫园',
        '广州塔',
        '广州长隆',
        '广州陈家祠',
        '广州沙面',
        '深圳世界之窗',
        '深圳欢乐谷',
        '深圳大梅沙',
        '深圳莲花山',
        '杭州西湖',
        '杭州灵隐寺',
        '杭州千岛湖',
        '杭州宋城',
        '成都宽窄巷子',
        '成都锦里',
        '成都大熊猫基地',
        '成都都江堰',
        '西安兵马俑',
        '西安大雁塔',
        '西安华清池',
        '西安城墙',
        '桂林山水',
        '桂林阳朔',
        '桂林漓江',
        '桂林象鼻山',
        '厦门鼓浪屿',
        '厦门南普陀寺',
        '厦门环岛路',
        '厦门曾厝垵',
        '青岛海滨',
        '青岛栈桥',
        '青岛八大关',
        '青岛崂山',
        '丽江古城',
        '丽江玉龙雪山',
        '丽江泸沽湖',
        '丽江束河',
        '三亚海滩',
        '三亚天涯海角',
        '三亚亚龙湾',
        '三亚蜈支洲岛',
        '张家界',
        '张家界天门山',
        '张家界黄龙洞',
        '张家界金鞭溪',
        '九寨沟',
        '九寨沟五花海',
        '九寨沟长海',
        '九寨沟珍珠滩',
        '黄山',
        '黄山迎客松',
        '黄山天都峰',
        '黄山莲花峰',
        '泰山',
        '泰山日出',
        '泰山红门',
        '泰山天街',
        '华山',
        '华山长空栈道',
        '华山西峰',
        '华山北峰',
        '峨眉山',
        '峨眉山金顶',
        '峨眉山万佛顶',
        '峨眉山清音阁'
      ]

      // 根据关键词过滤建议
      let filteredSuggestions: string[] = []
      if (keyword.trim()) {
        filteredSuggestions = allSuggestions.filter(
          (item) =>
            item.toLowerCase().includes(keyword.toLowerCase()) ||
            item.includes(keyword)
        )

        // 如果没有匹配的，返回一些相关的建议
        if (filteredSuggestions.length === 0) {
          // 根据关键词类型返回相关建议
          if (
            keyword.includes('江西') ||
            keyword.includes('南昌') ||
            keyword.includes('九江')
          ) {
            filteredSuggestions = allSuggestions.filter((item) =>
              item.includes('江西')
            )
          } else if (keyword.includes('北京')) {
            filteredSuggestions = allSuggestions.filter((item) =>
              item.includes('北京')
            )
          } else if (keyword.includes('上海')) {
            filteredSuggestions = allSuggestions.filter((item) =>
              item.includes('上海')
            )
          } else {
            // 返回一些热门建议
            filteredSuggestions = allSuggestions.slice(0, 8)
          }
        }

        // 限制返回数量
        filteredSuggestions = filteredSuggestions.slice(0, 10)
      }

      return {
        code: 0,
        data: {
          keyword,
          list: filteredSuggestions
        }
      }
    }
  },

  // 热门城市列表
  {
    url: '/api/hotlist',
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        code: 0,
        data: [
          { id: '101', city: '北京' },
          { id: '102', city: '上海' },
          { id: '103', city: '广州' },
          { id: '104', city: '深圳' },
          { id: '105', city: '杭州' }
        ]
      }
    }
  },

  // 首页瀑布流数据
  {
    url: '/api/home/waterfall',
    method: 'get',
    timeout: 800,
    response: (req: {
      query?: { page?: string; pageSize?: string; tab?: string }
    }) => {
      const page = parseInt(req.query?.page || '1')
      const pageSize = parseInt(req.query?.pageSize || '20')
      const tab = String(req.query?.tab || '推荐')

      const destinations = [
        '杭州西湖',
        '北京故宫',
        '上海外滩',
        '成都宽窄巷子',
        '西安兵马俑',
        '桂林山水',
        '厦门鼓浪屿',
        '青岛海滨',
        '丽江古城',
        '三亚海滩',
        '张家界',
        '九寨沟',
        '黄山',
        '泰山',
        '华山',
        '峨眉山'
      ]

      const authors = [
        '旅行达人',
        '摄影师小王',
        '背包客',
        '美食探索者',
        '文艺青年',
        '户外爱好者',
        '旅游博主',
        '风景摄影师'
      ]

      const imageUrls = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&fit=crop',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=280&fit=crop',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=320&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=290&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=310&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=340&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=270&fit=crop',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=330&fit=crop',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=260&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
      ]

      const items: WaterfallItem[] = []
      for (let i = 0; i < pageSize; i++) {
        const index = (page - 1) * pageSize + i
        const destination = destinations[index % destinations.length]
        const author = authors[index % authors.length]
        const imageUrl = imageUrls[index % imageUrls.length]

        items.push({
          id: `item_${index}`,
          imageUrl,
          title: `${destination}旅行攻略`,
          description: `探索${destination}的美丽风光，发现隐藏的宝藏景点，体验当地独特的文化魅力。这里有详细的旅行指南和实用建议。`,
          author,
          likes: Math.floor(Math.random() * 1000) + 10,
          height: 200 + Math.floor(Math.random() * 200),
          tab
        })
      }

      return {
        code: 0,
        data: {
          items,
          hasMore: page < 5,
          page,
          pageSize,
          total: pageSize * 5
        }
      }
    }
  },

  // 详情页接口
  {
    url: '/api/detail/:id',
    method: 'get',
    timeout: 1000,
    response: (req: { params: { id: string } }) => {
      const id = req.params.id
      const randomData = Mock.mock({
        id,
        title: '@ctitle(5, 10)',
        price: '@integer(60, 100)',
        desc: '@cparagraph(10-30)',
        author: '@cname',
        likes: '@integer(100, 9999)',
        views: '@integer(1000, 99999)',
        publishTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        images: [
          {
            url: '@image(400x300,@color,#fff,风景)',
            alt: '@ctitle(5, 10)'
          },
          {
            url: '@image(400x300,@color,#fff,美食)',
            alt: '@ctitle(5, 10)'
          },
          {
            url: '@image(400x300,@color,#fff,建筑)',
            alt: '@ctitle(5, 10)'
          }
        ],
        'tags|3': ['@ctitle(2,3)']
      })

      return {
        code: 0,
        data: randomData
      }
    }
  }
]
