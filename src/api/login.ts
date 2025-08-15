// import request from './config'

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    email: string
    nickname?: string
    avatar?: string
    phone?: string
    gender?: 'male' | 'female' | 'other'
    birthday?: string
    location?: string
    bio?: string
    preferences?: {
      theme: 'light' | 'dark' | 'auto'
      language: 'zh-CN' | 'en-US'
      notifications: boolean
      location: boolean
    }
    stats?: {
      itinerariesCount: number
      favoritesCount: number
      followersCount: number
      followingCount: number
    }
    createdAt: string
    updatedAt: string
  }
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  nickname?: string
  avatar?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  location?: string
  bio?: string
}

// 模拟API - 实际项目中应该替换为真实的API调用
const mockDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const loginApi = {
  // 登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    await mockDelay()

    // 模拟登录验证
    if (data.username === 'demo' && data.password === '123456') {
      return {
        user: {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          nickname: '演示用户',
          avatar: '',
          location: '杭州市',
          bio: '热爱旅行的演示用户',
          preferences: {
            theme: 'light',
            language: 'zh-CN',
            notifications: true,
            location: true
          },
          stats: {
            itinerariesCount: 5,
            favoritesCount: 12,
            followersCount: 23,
            followingCount: 18
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ImRlbW8iLCJpYXQiOjE2MzE2MjM2MDB9.mock_signature',
        refreshToken: 'refresh_token_' + Date.now(),
        expiresIn: 7200 // 2小时
      }
    } else if (data.username === 'admin' && data.password === 'admin123') {
      return {
        user: {
          id: '2',
          username: 'admin',
          email: 'admin@example.com',
          nickname: '管理员',
          avatar: '',
          location: '北京市',
          bio: '系统管理员',
          preferences: {
            theme: 'dark',
            language: 'zh-CN',
            notifications: true,
            location: true
          },
          stats: {
            itinerariesCount: 15,
            favoritesCount: 30,
            followersCount: 100,
            followingCount: 50
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6ImFkbWluIiwiaWF0IjoxNjMxNjIzNjAwfQ.mock_signature',
        refreshToken: 'refresh_token_' + Date.now(),
        expiresIn: 7200
      }
    } else {
      throw new Error('用户名或密码错误')
    }
  },

  // 注册
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    await mockDelay()

    if (data.password !== data.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }

    if (data.username === 'demo' || data.username === 'admin') {
      throw new Error('用户名已存在')
    }

    return {
      user: {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        phone: data.phone,
        nickname: data.username,
        preferences: {
          theme: 'light',
          language: 'zh-CN',
          notifications: true,
          location: true
        },
        stats: {
          itinerariesCount: 0,
          favoritesCount: 0,
          followersCount: 0,
          followingCount: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6Im5ld3VzZXIiLCJpYXQiOjE2MzE2MjM2MDB9.mock_signature',
      refreshToken: 'refresh_token_' + Date.now(),
      expiresIn: 7200
    }
  },

  // 刷新token
  refreshToken: async (
    _data: RefreshTokenRequest
  ): Promise<{ token: string; refreshToken: string; expiresIn: number }> => {
    await mockDelay(500)

    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6ImRlbW8iLCJpYXQiOjE2MzE2MjM2MDB9.new_mock_signature',
      refreshToken: 'new_refresh_token_' + Date.now(),
      expiresIn: 7200
    }
  },

  // 获取用户信息
  getUserInfo: async (): Promise<LoginResponse['user']> => {
    await mockDelay(500)

    return {
      id: '1',
      username: 'demo',
      email: 'demo@example.com',
      nickname: '演示用户',
      avatar: '',
      location: '杭州市',
      bio: '热爱旅行的演示用户',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        location: true
      },
      stats: {
        itinerariesCount: 5,
        favoritesCount: 12,
        followersCount: 23,
        followingCount: 18
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  },

  // 更新用户信息
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<LoginResponse['user']> => {
    await mockDelay()

    return {
      id: '1',
      username: 'demo',
      email: 'demo@example.com',
      nickname: data.nickname || '演示用户',
      avatar: data.avatar || '',
      phone: data.phone,
      gender: data.gender,
      birthday: data.birthday,
      location: data.location || '杭州市',
      bio: data.bio || '热爱旅行的演示用户',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true,
        location: true
      },
      stats: {
        itinerariesCount: 5,
        favoritesCount: 12,
        followersCount: 23,
        followingCount: 18
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  },

  // 修改密码
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await mockDelay()

    if (data.oldPassword !== '123456') {
      throw new Error('原密码错误')
    }

    // 模拟修改成功
  },

  // 验证token
  verifyToken: async (token: string): Promise<boolean> => {
    await mockDelay(300)

    // 简单的token格式验证
    return token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
  },

  // 登出
  logout: async (): Promise<void> => {
    await mockDelay(300)
    // 模拟登出成功
  }
}
