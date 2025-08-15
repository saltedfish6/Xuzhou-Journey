// 详情页相关的 mock 数据

// 详情页内容模板
const contentTemplates = [
  {
    type: 'paragraph',
    content:
      '这是一次令人难忘的旅行体验。当我踏上这片土地的那一刻，就被眼前的美景深深震撼了。蓝天白云下，古老的建筑与现代的城市完美融合，展现出独特的魅力。'
  },
  {
    type: 'image',
    url: '/placeholder.svg',
    caption: '美丽的风景让人流连忘返'
  },
  {
    type: 'paragraph',
    content:
      '在这里，我遇到了许多有趣的人和事。当地人的热情好客让我感受到了家的温暖，他们向我介绍了许多不为人知的景点和美食，让这次旅行变得更加丰富多彩。'
  },
  {
    type: 'list',
    title: '推荐景点',
    items: [
      '历史文化街区 - 感受古老文明的魅力',
      '当地特色市场 - 体验地道的民俗风情',
      '观景台 - 俯瞰整个城市的壮丽景色',
      '传统手工艺坊 - 了解当地的传统技艺'
    ]
  },
  {
    type: 'paragraph',
    content:
      '美食是这次旅行的另一大亮点。从街边小摊到高档餐厅，每一道菜都有着独特的风味。特别是当地的特色小吃，虽然看起来简单，但味道却让人回味无穷。'
  },
  {
    type: 'image',
    url: '/placeholder.svg',
    caption: '当地特色美食'
  }
]

// 评论模板
const commentTemplates = [
  {
    author: '旅行爱好者',
    avatar: '/placeholder.svg',
    content: '写得太好了！我也想去这个地方看看，感谢分享这么详细的攻略。',
    time: '2小时前',
    likes: 15
  },
  {
    author: '摄影师小李',
    avatar: '/placeholder.svg',
    content: '照片拍得真美，构图和光线都很棒，学到了很多摄影技巧。',
    time: '5小时前',
    likes: 23
  },
  {
    author: '美食达人',
    avatar: '/placeholder.svg',
    content: '那些美食看起来就很香，下次一定要去尝尝！',
    time: '1天前',
    likes: 8
  },
  {
    author: '背包客张三',
    avatar: '/placeholder.svg',
    content: '很实用的攻略，已经收藏了，准备按照这个路线去旅行。',
    time: '2天前',
    likes: 12
  },
  {
    author: '文艺青年',
    avatar: '/placeholder.svg',
    content: '文字很有感染力，仿佛跟着作者一起体验了这次旅行。',
    time: '3天前',
    likes: 19
  }
]

// 相关推荐模板
const relatedTemplates = [
  {
    title: '同城其他精彩体验',
    description: '探索更多当地的隐藏宝藏',
    imageUrl: '/placeholder.svg'
  },
  {
    title: '类似风格的旅行攻略',
    description: '发现更多精彩的旅行故事',
    imageUrl: 'https://picsum.photos/200/150?random='
  },
  {
    title: '同作者的其他作品',
    description: '跟随作者的脚步继续探索',
    imageUrl: 'https://picsum.photos/200/150?random='
  }
]

// 详情页接口 mock
export const detailMock = {
  '/api/detail/:id': (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id

    // 生成详情内容
    const content = contentTemplates.map((template, index) => {
      if (template.type === 'image') {
        return {
          ...template,
          url: template.url + (numId * 10 + index)
        }
      }
      return template
    })

    // 生成评论
    const comments = commentTemplates.map((comment, index) => ({
      ...comment,
      id: index + 1,
      avatar: comment.avatar.replace('random=1', `random=${numId + index}`)
    }))

    // 生成相关推荐
    const related = relatedTemplates.map((item, index) => ({
      ...item,
      id: numId + index + 100,
      imageUrl: item.imageUrl + (numId + index + 10)
    }))

    return {
      code: 200,
      data: {
        id: numId,
        title: `探索未知的美丽世界 - 详情页 ${numId}`,
        author: '旅行达人小王',
        authorAvatar: '/placeholder.svg',
        publishTime: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        readTime: Math.floor(Math.random() * 10) + 3,
        likes: Math.floor(Math.random() * 1000) + 50,
        views: Math.floor(Math.random() * 5000) + 200,
        collections: Math.floor(Math.random() * 500) + 20,
        shares: Math.floor(Math.random() * 100) + 5,
        tags: ['旅行', '攻略', '摄影', '美食'],
        content,
        comments,
        related,
        isLiked: false,
        isCollected: false
      },
      message: 'success'
    }
  },

  '/api/detail/:id/like': (id: string | number) => {
    return {
      code: 200,
      data: {
        isLiked: true,
        likes: Math.floor(Math.random() * 1000) + 51
      },
      message: '点赞成功'
    }
  },

  '/api/detail/:id/collect': (id: string | number) => {
    return {
      code: 200,
      data: {
        isCollected: true,
        collections: Math.floor(Math.random() * 500) + 21
      },
      message: '收藏成功'
    }
  },

  '/api/detail/:id/comments': (
    id: string | number,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const comments = commentTemplates.map((comment, index) => ({
      ...comment,
      id: index + 1,
      avatar: comment.avatar.replace('random=1', `random=${index + 1}`)
    }))

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedComments = comments.slice(startIndex, endIndex)

    return {
      code: 200,
      data: {
        list: paginatedComments,
        total: comments.length,
        page,
        pageSize,
        hasMore: endIndex < comments.length
      },
      message: 'success'
    }
  }
}

export default detailMock
