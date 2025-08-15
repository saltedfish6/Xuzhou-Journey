// 用户相关的 mock 数据

// 用户信息模板
const userProfiles = [
  {
    id: 1,
    nickname: '旅行达人小王',
    avatar: '/placeholder.svg',
    bio: '热爱旅行，用镜头记录世界的美好',
    level: 5,
    followers: 1234,
    following: 567,
    posts: 89,
    location: '北京',
    joinDate: '2022-03-15'
  },
  {
    id: 2,
    nickname: '摄影师李明',
    avatar: '/placeholder.svg',
    bio: '专业摄影师，分享旅行中的精彩瞬间',
    level: 7,
    followers: 2345,
    following: 234,
    posts: 156,
    location: '上海',
    joinDate: '2021-08-20'
  }
]

// 用户动态模板
const userActivities = [
  {
    type: 'post',
    title: '发布了新的旅行攻略',
    content: '探索北京胡同的隐秘角落',
    time: '2小时前',
    likes: 23,
    comments: 5
  },
  {
    type: 'like',
    title: '点赞了文章',
    content: '上海外滩夜景摄影指南',
    time: '5小时前'
  },
  {
    type: 'follow',
    title: '关注了用户',
    content: '摄影师李明',
    time: '1天前'
  },
  {
    type: 'collect',
    title: '收藏了文章',
    content: '成都美食地图大揭秘',
    time: '2天前'
  }
]

// 用户收藏模板
const userCollections = [
  {
    id: 1,
    title: '探索北京的隐秘角落',
    author: '旅行达人小王',
    imageUrl: '/placeholder.svg',
    collectTime: '2024-01-15',
    tags: ['北京', '攻略', '文化']
  },
  {
    id: 2,
    title: '上海外滩夜景摄影指南',
    author: '摄影师李明',
    imageUrl: '/placeholder.svg',
    collectTime: '2024-01-14',
    tags: ['上海', '摄影', '夜景']
  },
  {
    id: 3,
    title: '成都美食地图大揭秘',
    author: '美食探索者',
    imageUrl: '/placeholder.svg',
    collectTime: '2024-01-13',
    tags: ['成都', '美食', '推荐']
  }
]

// 用户设置选项
const userSettings = {
  privacy: {
    profileVisible: true,
    activityVisible: true,
    followersVisible: true
  },
  notifications: {
    likes: true,
    comments: true,
    follows: true,
    system: true
  },
  preferences: {
    language: 'zh-CN',
    theme: 'auto',
    autoPlay: false
  }
}

// 用户相关接口 mock
export const userMock = {
  '/api/user/profile': (userId?: number) => {
    const profile = userProfiles[0] // 默认返回第一个用户

    return {
      code: 200,
      data: profile,
      message: 'success'
    }
  },

  '/api/user/profile/update': (data: any) => {
    return {
      code: 200,
      data: {
        ...userProfiles[0],
        ...data,
        updatedAt: new Date().toISOString()
      },
      message: '更新成功'
    }
  },

  '/api/user/activities': (page: number = 1, pageSize: number = 10) => {
    const activities = userActivities.map((activity, index) => ({
      ...activity,
      id: index + 1
    }))

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedActivities = activities.slice(startIndex, endIndex)

    return {
      code: 200,
      data: {
        list: paginatedActivities,
        total: activities.length,
        page,
        pageSize,
        hasMore: endIndex < activities.length
      },
      message: 'success'
    }
  },

  '/api/user/collections': (page: number = 1, pageSize: number = 10) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCollections = userCollections.slice(startIndex, endIndex)

    return {
      code: 200,
      data: {
        list: paginatedCollections,
        total: userCollections.length,
        page,
        pageSize,
        hasMore: endIndex < userCollections.length
      },
      message: 'success'
    }
  },

  '/api/user/posts': (page: number = 1, pageSize: number = 10) => {
    // 模拟用户发布的文章
    const posts = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      title: `我的旅行故事 ${index + 1}`,
      description: '这是一次难忘的旅行体验...',
      imageUrl: '/placeholder.svg',
      publishTime: new Date(
        Date.now() - index * 24 * 60 * 60 * 1000
      ).toISOString(),
      likes: Math.floor(Math.random() * 100) + 10,
      views: Math.floor(Math.random() * 1000) + 50,
      comments: Math.floor(Math.random() * 20) + 1
    }))

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedPosts = posts.slice(startIndex, endIndex)

    return {
      code: 200,
      data: {
        list: paginatedPosts,
        total: posts.length,
        page,
        pageSize,
        hasMore: endIndex < posts.length
      },
      message: 'success'
    }
  },

  '/api/user/settings': () => {
    return {
      code: 200,
      data: userSettings,
      message: 'success'
    }
  },

  '/api/user/settings/update': (data: any) => {
    return {
      code: 200,
      data: {
        ...userSettings,
        ...data,
        updatedAt: new Date().toISOString()
      },
      message: '设置更新成功'
    }
  },

  '/api/user/follow': (targetUserId: number) => {
    return {
      code: 200,
      data: {
        isFollowing: true,
        followers: Math.floor(Math.random() * 1000) + 100
      },
      message: '关注成功'
    }
  },

  '/api/user/unfollow': (targetUserId: number) => {
    return {
      code: 200,
      data: {
        isFollowing: false,
        followers: Math.floor(Math.random() * 1000) + 99
      },
      message: '取消关注成功'
    }
  },

  '/api/user/avatar/upload': (file: File) => {
    // 模拟头像上传
    return {
      code: 200,
      data: {
        avatarUrl: '/placeholder.svg'
      },
      message: '头像上传成功'
    }
  }
}

export default userMock
