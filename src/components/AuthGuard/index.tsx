import { useEffect } from 'react'
import { useUserStore } from '@/store/useUserStore'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * 认证守卫组件
 * 在应用启动时检查token有效性，自动刷新过期token
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { token, isLoggedIn, checkTokenValidity, logout } = useUserStore()

  useEffect(() => {
    const initAuth = async () => {
      // 如果有token但未登录状态，说明是从持久化存储恢复的
      if (token && !isLoggedIn) {
        try {
          const isValid = await checkTokenValidity()
          if (!isValid) {
            logout()
          }
        } catch (error) {
          console.error('Token验证失败:', error)
          logout()
        }
      }
    }

    initAuth()
  }, [token, isLoggedIn, checkTokenValidity, logout])

  // 定期检查token有效性
  useEffect(() => {
    if (!isLoggedIn || !token) return

    const interval = setInterval(
      async () => {
        try {
          await checkTokenValidity()
        } catch (error) {
          console.error('定期token检查失败:', error)
        }
      },
      5 * 60 * 1000
    ) // 每5分钟检查一次

    return () => clearInterval(interval)
  }, [isLoggedIn, token, checkTokenValidity])

  return <>{children}</>
}

export default AuthGuard
