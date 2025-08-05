import axios from './config'

// 定义类型
interface SuggestResponse {
  code: number
  data: {
    keyword: string
    list: string[]
  }
}

interface HotListResponse {
  code: number
  data: { id: string; city: string }[]
}

// 搜索建议列表
export const getSuggestList = async (
  keyword: string
): Promise<SuggestResponse['data']> => {
  const response = await axios.get<SuggestResponse['data']>(
    `/search?keyword=${keyword}`
  )
  return response.data
}

// 热门城市列表
export const getHotList = async (): Promise<HotListResponse['data']> => {
  const response = await axios.get<HotListResponse['data']>('/hotlist')
  return response.data
}
