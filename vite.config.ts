import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: 'mock', // mock 文件存放目录
        enable: command === 'serve', // 开发环境启用，构建时禁用
        // enable: true, // 强制始终启用（仅测试用）
        // 配置忽略外部API请求
        ignore: (fileName: string) => {
          // 忽略包含外部域名的请求
          return (
            fileName.includes('api.moonshot.cn') ||
            fileName.includes('api.deepseek.com') ||
            fileName.includes('https://')
          )
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5174
      // 移除代理配置，让mock插件直接处理API请求
    }
  }
})
