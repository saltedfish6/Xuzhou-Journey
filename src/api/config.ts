import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5173/api'

axios.interceptors.request.use((config) => {
  // token
  return config
})

axios.interceptors.response.use((data) => {
  console.log('aaa', data)
  return data.data
})

export default axios
