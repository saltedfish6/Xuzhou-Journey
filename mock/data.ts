// Mock 数据统一入口文件
// 导入各个模块的 mock 数据
import searchMock, { hotCities } from './search'
import homeMock, { generateWaterfallData } from './home'
import detailMock from './detail'
import userMock from './user'
import commonUtils from './common'

// 合并所有 mock 接口
const allMockApis = {
  ...searchMock,
  ...homeMock,
  ...detailMock,
  ...userMock
}

// 导出所有模块和工具函数
export {
  searchMock,
  homeMock,
  detailMock,
  userMock,
  commonUtils,
  hotCities,
  generateWaterfallData
}

// 默认导出统一的 mock API 接口
export default allMockApis
