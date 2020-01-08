import Cookie from 'js-cookie'
import createLogger from 'vuex/dist/logger'
import axios from 'axios'
import config from 'index/config'

const { baseUrl } = config

const COOKIE_NAME = 'movie_deviceId'
const getCookieUser = () => {
  return Cookie.get(COOKIE_NAME)
    ? JSON.parse(Cookie.get(COOKIE_NAME))
    : null
}
const setCookieUser = (info) => {
  Cookie.set(COOKIE_NAME, info, { expires: 30 })
}

const debug = process.env.NODE_ENV !== 'production'

// 链接jsbridge
function connectWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      console.log('WebViewJavascriptBridgeReady')
      callback(WebViewJavascriptBridge)
    },
    false
    )
  }
}
// 注册回调函数，第一次连接时调用 初始化函数
connectWebViewJavascriptBridge(function (bridge) {
  bridge.init(function (message, responseCallback) {
    console.log('bridegeInit')
    var data = { 'Javascript Responds': 'Wee!' }
    responseCallback(data)
  })
})

const appUser = {
  strict: debug,
  state: {
    deviceId: getCookieUser(),
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
        // 注册事件监听
        let deviceId = ''
        connectWebViewJavascriptBridge(function (bridge) {
          console.log('bridge--getDeviceId')
          bridge.registerHandler('getDeviceId', function (data, responseCallback) {
            console.log('data=====' + data)
            data && (deviceId = data)
            var responseData = 'Javascript Says Right back aka!'
            responseCallback(responseData)
            console.log('bridge==deviceId====' + deviceId)
            if (deviceId) {
              commit('setDeviceId', deviceId)
              dispatch('getUserInfo', deviceId)
            }
            resolve(deviceId)
          })
        })
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
