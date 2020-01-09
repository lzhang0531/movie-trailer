import Cookie from 'js-cookie'
import createLogger from 'vuex/dist/logger'
import axios from 'axios'
import config from 'index/config'
const { baseUrl } = config

const COOKIE_NAME = 'movie_deviceId'
const getCookieUser = () => {
  console.log('getCo----' + Cookie.get(COOKIE_NAME))
  return Cookie.get(COOKIE_NAME)
    ? JSON.parse(Cookie.get(COOKIE_NAME))
    : null
}
const setCookieUser = (info) => {
  Cookie.set(COOKIE_NAME, info, { expires: 30 })
}

const debug = process.env.NODE_ENV !== 'production'

let deviceId = getCookieUser()
// 链接jsbridge
function connectWebViewJavascriptBridge (callback) {
  console.log('connectWebViewJavascriptBridge')
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge)
    },
    false
    )
  }
}
// 注册回调函数，第一次连接时调用 初始化函数
connectWebViewJavascriptBridge(function (bridge) {
  console.log('bridegeInit1111')
  bridge.init(function (message, responseCallback) {
    console.log('bridegeInit')
    const data = { 'Javascript Responds': 'Wee!' }
    responseCallback(data)
  })
})
connectWebViewJavascriptBridge(function (bridge) {
  bridge.registerHandler('getDeviceId', function (data, responseCallback) {
    console.log('getDeviceId=====data=====' + data)
    if (data) {
      deviceId = data
      setCookieUser(deviceId)
    }
    const responseData = 'Javascript Says Right back aka!'
    responseCallback(responseData)
    console.log('bridge==deviceId====' + deviceId)
  })
})
function get () {
  connectWebViewJavascriptBridge(function (bridge) {
    bridge.callHandler('getId', '', function (data, responseCallback) {
      console.log('getDeviceId=====get=====' + data)
      if (data) {
        deviceId = data
        setCookieUser(deviceId)
      }
      const responseData = 'Javascript Says Right back aka!'
      responseCallback(responseData)
      console.log('bridge==deviceId====' + deviceId)
    })
  })
  connectWebViewJavascriptBridge(function (bridge) {
    bridge.registerHandler('getDeviceId', function (data, responseCallback) {
      console.log('getDeviceId=====data=====' + data)
      if (data) {
        deviceId = data
        setCookieUser(deviceId)
      }
      const responseData = 'Javascript Says Right back aka!'
      responseCallback(responseData)
      console.log('bridge==deviceId====' + deviceId)
    })
  })
}
get()

const appUser = {
  strict: debug,
  state: {
    deviceId: deviceId || getCookieUser(),
    userInfo: {}
  },
  mutations: {
    setDeviceId (state, deviceId) {
      state.deviceId = deviceId
      setCookieUser(deviceId)
    },
    setUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    getDeviceId ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        get()
        const user = getCookieUser() || '123456'
        console.log('user===========')
        commit('setDeviceId', user)
        resolve(user)
      })
    },
    getUserInfo ({ commit }, deviceId) {
      console.log('getUserInfo====' + deviceId)
      return !deviceId ? '' : new Promise((resolve, reject) => {
        axios.get(baseUrl + '/api/user/get-by-device-id', { params: { 'deviceId': deviceId } }).then(res => {
          res = res.data
          if (res.res === 0) {
            const info = res.data
            commit('setUserInfo', info)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  plugins: debug ? [createLogger()] : []
}

export default appUser
