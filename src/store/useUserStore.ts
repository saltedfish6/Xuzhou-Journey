import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginApi, type LoginRequest, type RegisterRequest } from '@/api/login'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  nickname?: string
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

interface LoginCredentials extends LoginRequest {}
interface RegisterData extends RegisterRequest {}

interface UserState {
  // 用户信息
  user: User | null

  // 认证token
  token: string | null

  // 刷新token
  refreshToken: string | null

  // token过期时间
  tokenExpiresAt: number | null

  // 登录状态
  isLoggedIn: boolean

  // 加载状态
  loading: boolean

  // 错误信息
  error: string | null

  // 是否记住登录状态
  rememberMe: boolean
}

interface UserActions {
  // 登录
  login: (credentials: LoginCredentials) => Promise<void>

  // 注册
  register: (data: RegisterData) => Promise<void>

  // 登出
  logout: () => void

  // 获取用户信息
  getUserInfo: () => Promise<void>

  // 更新用户信息
  updateUserInfo: (updates: Partial<User>) => Promise<void>

  // 更新头像
  updateAvatar: (avatar: string) => Promise<void>

  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>

  // 绑定手机号
  bindPhone: (phone: string, code: string) => Promise<void>

  // 绑定邮箱
  bindEmail: (email: string, code: string) => Promise<void>

  // 设置偏好
  setPreferences: (preferences: Partial<User['preferences']>) => Promise<void>

  // 检查token有效性
  checkTokenValidity: () => Promise<boolean>

  // 刷新token
  refreshAccessToken: () => Promise<void>

  // 清除错误
  clearError: () => void

  // 设置加载状态
  setLoading: (loading: boolean) => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      isLoggedIn: false,
      loading: false,
      error: null,
      rememberMe: false,

      // 登录
      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const response = await loginApi.login(credentials)
          const expiresAt = Date.now() + response.expiresIn * 1000

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            tokenExpiresAt: expiresAt,
            isLoggedIn: true,
            rememberMe: credentials.remember || false,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            loading: false
          })
          throw error
        }
      },

      // 注册
      register: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await loginApi.register(data)
          const expiresAt = Date.now() + response.expiresIn * 1000

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            tokenExpiresAt: expiresAt,
            isLoggedIn: true,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '注册失败',
            loading: false
          })
          throw error
        }
      },

      // 登出
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isLoggedIn: false,
          rememberMe: false,
          error: null
        })
      },

      // 获取用户信息
      getUserInfo: async () => {
        const { token } = get()
        if (!token) return

        set({ loading: true, error: null })
        try {
          const user = await loginApi.getUserInfo()
          set({ user, loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '获取用户信息失败',
            loading: false
          })
        }
      },

      // 更新用户信息
      updateUserInfo: async (updates) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user) throw new Error('用户未登录')

          const updatedUser = await loginApi.updateProfile(updates)
          set({ user: updatedUser, loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '更新用户信息失败',
            loading: false
          })
          throw error
        }
      },

      // 更新头像
      updateAvatar: async (avatar) => {
        await get().updateUserInfo({ avatar })
      },

      // 修改密码
      changePassword: async (oldPassword, newPassword) => {
        set({ loading: true, error: null })
        try {
          await loginApi.changePassword({ oldPassword, newPassword })
          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '修改密码失败',
            loading: false
          })
          throw error
        }
      },

      // 绑定手机号
      bindPhone: async (_phone, _code) => {
        set({ loading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          await get().updateUserInfo({ phone: _phone })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '绑定手机号失败',
            loading: false
          })
        }
      },

      // 绑定邮箱
      bindEmail: async (_email, _code) => {
        set({ loading: true, error: null })
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          await get().updateUserInfo({ email: _email })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '绑定邮箱失败',
            loading: false
          })
        }
      },

      // 设置偏好
      setPreferences: async (preferences) => {
        const { user } = get()
        if (!user) return

        const updatedPreferences = {
          theme: 'light' as const,
          language: 'zh-CN' as const,
          notifications: true,
          location: true,
          ...user.preferences,
          ...preferences
        }

        await get().updateUserInfo({ preferences: updatedPreferences })
      },

      // 检查token有效性
      checkTokenValidity: async () => {
        const { token, tokenExpiresAt } = get()
        if (!token) return false

        // 检查token是否过期
        if (tokenExpiresAt && Date.now() >= tokenExpiresAt) {
          // 尝试刷新token
          try {
            await get().refreshAccessToken()
            return true
          } catch (error) {
            get().logout()
            return false
          }
        }

        try {
          const isValid = await loginApi.verifyToken(token)
          if (!isValid) {
            get().logout()
          }
          return isValid
        } catch (error) {
          get().logout()
          return false
        }
      },

      // 刷新token
      refreshAccessToken: async () => {
        const { refreshToken: currentRefreshToken } = get()
        if (!currentRefreshToken) {
          throw new Error('没有刷新token')
        }

        set({ loading: true, error: null })
        try {
          const response = await loginApi.refreshToken({
            refreshToken: currentRefreshToken
          })
          const expiresAt = Date.now() + response.expiresIn * 1000

          set({
            token: response.token,
            refreshToken: response.refreshToken,
            tokenExpiresAt: expiresAt,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '刷新token失败',
            loading: false
          })
          get().logout()
          throw error
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ loading })
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        isLoggedIn: state.isLoggedIn,
        rememberMe: state.rememberMe
      })
    }
  )
)
