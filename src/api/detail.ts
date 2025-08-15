import axios from './config'

export const getDetail = async (id: string | number) => {
  // console.log('id', id)
  return axios.get(`/detail/${id}`)
}
