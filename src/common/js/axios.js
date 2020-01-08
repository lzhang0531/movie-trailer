import axios from 'axios'
import router from 'index/router'
import config from 'index/config'
const { baseUrl } = config

const instance = axios.create({
  timeout: 60000,
  baseURL: baseUrl
})

instance.interceptors.response.use(res => {
  const { data } = res
  return Promise.resolve(data)
}, () => {
  router.push('/error')
})

export default {
  install: (Vue, option) => {
    Object.defineProperty(Vue.prototype, '$axios', { value: instance })
  }
}
