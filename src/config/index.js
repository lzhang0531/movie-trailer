const ua = navigator.userAgent
const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
const isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
const isAndroid = ua.match(/(Android)\s+([\d.]+)/)
const isMobile = !!(isIphone || isAndroid)

export default {
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://47.111.232.212/' : 'http://47.111.232.212/',
  playTime: 30,
  isMobile: isMobile
}
