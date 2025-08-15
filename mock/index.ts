import { MockMethod } from 'vite-plugin-mock'
import allMockApis from './data'

// 将 mock 数据转换为 vite-plugin-mock 需要的格式
const mockMethods: MockMethod[] = []

// 遍历所有 mock API 并转换格式
Object.entries(allMockApis).forEach(([url, handler]) => {
  // 处理不同的 HTTP 方法
  const methods = ['GET', 'POST', 'PUT', 'DELETE']

  methods.forEach((method) => {
    mockMethods.push({
      url,
      method: method as any,
      response: (req: any) => {
        try {
          // 解析查询参数
          const query = req.query || {}
          const body = req.body || {}

          // 调用对应的处理函数
          if (typeof handler === 'function') {
            const result = handler(query.page, query.pageSize, query.tab, query)
            return {
              code: 0,
              data: result,
              message: 'success'
            }
          } else {
            return {
              code: 0,
              data: handler,
              message: 'success'
            }
          }
        } catch (error) {
          console.error('Mock API error:', error)
          return {
            code: -1,
            data: null,
            message: 'Internal server error'
          }
        }
      }
    })
  })
})

export default mockMethods
