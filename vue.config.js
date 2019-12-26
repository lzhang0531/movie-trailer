const path = require('path')

const resolve = dir => path.join(__dirname, dir)

const cdn = {
  css: [
    // dplayer
    '//cdn.bootcss.com/dplayer/1.25.0/DPlayer.min.css'
  ],
  js: [
    // vue
    '//cdn.staticfile.org/vue/2.5.22/vue.min.js',
    // vue-router
    '//cdn.staticfile.org/vue-router/3.0.2/vue-router.min.js',
    // vuex
    '//cdn.staticfile.org/vuex/3.1.0/vuex.min.js',
    // axios
    '//cdn.staticfile.org/axios/0.19.0-beta.1/axios.min.js',
    // dplayer
    '//cdn.bootcss.com/dplayer/1.25.0/DPlayer.min.js'
  ]
}

const externals = {
  vue: 'Vue',
  axios: 'axios',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  dplayer: 'DPlayer'
}

module.exports = {
  publicPath: './', // 部署应用包时的基本 UR
  pages: {
    app: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: 'src/modules/app/main.js',

      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/index.html',

      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'index.html',

      // 包含的模块，可选项
      chunks: ['app']
    },
    // 只有entry属性时，直接用字符串表示模块入口
    manage: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: 'src/modules/manage/manage.js',

      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/manage.html',

      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'manage.html'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('app', resolve('src/modules/app'))
      .set('common', resolve('src/modules/app/common'))
      .set('components', resolve('src/modules/app/components'))
      .set('views', resolve('src/modules/app/views'))
    config.devServer.proxy({
      '/api': {
        target: 'http://movie.ihaoze.cn/'
      }
    })
    config.externals(externals)
  },
  css: {
    loaderOptions: {
      stylus: {
        import: ['~common/styles/mixin.styl']
      }
    }
  }
}
