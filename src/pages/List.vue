<template>
  <Transition name="fade">
    <div class="category">
      <div class="nav-wrapper">
        <div class="tabs">
          <div
            v-for="(item, index) in cats"
            :key="item"
            class="item"
            :class="getCls(index)"
            @click="switchTab(index)"
          >
            <span class="text">{{ item }}</span>
            <i class="iconfont icon-drop-down" :class="{'icon-drop-up': index === activeTabIdx}"/>
          </div>
        </div>
        <div v-show="activeTabIdx !== -1" class="tab-content">
          <SizerCategorySingle
            v-show="activeTabIdx === 0"
            ref="sizerCategory"
            v-model="categoryCode"
            @change="getMovieList(true)"
          />
        </div>
        <div v-show="activeTabIdx !== -1" class="mask" @click="closeTab"/>
      </div>
      <div class="content-wrapper">
        <ScrollView :data="movieList" :pull-up-load="true" @pulling-up="loadMore">
          <div
            v-for="movie in movieList"
            :key="movie.id"
            class="movie-wrapper"
            :movie="movie"
            @click="gotoDetail(movie.id)"
          >
            <img
              :src="`${baseUrl}/file/${movie.thumbnailPath}`"
              height="210px"
              width="100%"
              style="border-radius: 2%"
            >
            <div class="title">{{ movie.name }}</div>
          </div>
          <div class="pull-up-wrap">
            <p v-show="pullUpLoading">正在加载...</p>
            <p v-show="noMore">没有更多了~</p>
          </div>
        </ScrollView>
        <div v-show="noResult" class="no-result">
          <img src="~index/common/images/noresult.png" class="img">
          <p class="text">没有找到相关内容</p>
        </div>
      </div>
      <div v-show="!movieList.length&&!noResult" class="loading-wrap">
        <Loading/>
      </div>
    </div>
  </Transition>
</template>

<script>
import SizerCategorySingle from '../components/SizerCategorySingle'
import config from 'index/config'
const { baseUrl } = config

export default {
  name: 'List',
  components: {
    SizerCategorySingle
  },
  data () {
    return {
      baseUrl: baseUrl,
      movieList: [],
      count: -1,
      page: 1,
      cats: ['影片类型'],
      activeTabIdx: -1,
      pullUpLoading: false,
      categories: [],
      categoryCode: '',
      type: +this.$route.params.type
    }
  },
  computed: {
    noMore () {
      return this.count === this.movieList.length && this.count !== 0
    },
    noResult () {
      return this.count === 0
    }
  },
  created () {
    this.getMovieList()
  },
  beforeRouteUpdate  (to, from, next) {
    this.page = 1
    this.movieList = []
    this.count = 0
    this.categoryCode = ''
    next()
    this.getMovieList()
  },
  methods: {
    getMovieList (clearFlag) {
      this.activeTabIdx = -1
      const params = {
        pageNum: this.page,
        pageSize: 10,
        areaCode: this.$route.params.type,
        categoryCode: this.categoryCode
      }
      if (clearFlag) {
        this.movieList = []
        this.pageNum = 1
      }
      this.$axios.get('/api/video/page', { params }).then(res => {
        if (res.res === 0) {
          this.movieList = this.movieList.concat(res.data.list)
          this.count = res.data.total
        }
        this.$nextTick(() => {
          this.pullUpLoading = false
        })
      })
    },
    loadMore () {
      const { movieList, count } = this
      if (movieList.length === count) return
      this.page += 1
      this.pullUpLoading = true
      this.getMovieList()
    },
    gotoDetail (id) {
      this.$router.push(`/movie/${id}`)
    },
    /*    // 切换 type、tab[1] 名字
    changeType ({ type, name }) {
      this.params.type = type
      this.cats[1] = name
      this.getMovieList()
    }, */
    switchTab (idx) {
      // 点击相同
      if (idx === this.activeTabIdx) {
        this.activeTabIdx = -1
        return
      }
      this.activeTabIdx = idx

      // 当从其他tab点击第一个时，重置组件cacheList
      if (idx === 0) {
        this.$refs.sizerCategory.resetCache()
      }
    },
    selectItem (id) {
      this.$router.push(`/movie/${id}`)
    },
    closeTab () {
      this.activeTabIdx = -1
    },
    getCls (index) {
      return {
        'active': index === this.activeTabIdx
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  $theme-color = #1c2635
  $gray = #bbb
  .movie-wrapper
    padding 10px 10px
    box-sizing: border-box
    border-bottom: 1px solid #e6e6e6
    text-align:center
    background-color #fff
    border-radius 5px
    margin: 0 5px 10px;
    .title
      text-align:left
      color: #333
      font-size: 17px
      font-weight: 700
      line-height:20px
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
  .nav-wrapper
    position fixed
    width 100%
    z-index 10
    background #fff
    .tabs
      display flex
      height 40px
      line-height 40px
      border-bottom 1px solid #eee
      .item
        position relative
        flex 1
        text-align center
        font-size 13px
        color #777
        &.active
          color $theme-color
        &.disable
          color #eee
        &+.item:before
          position absolute
          content ""
          display block
          height 20px
          top 10px
          left 0
          border-left 1px solid #e8e8e8
        .icon
          font-size 12px
    .tab-content
      position absolute
      width 100%
      /*min-height 50px*/
      background #fff
      z-index 10
      border-radius: 2px

    .mask
      position fixed
      top 40px
      bottom 56px
      width 100%
      background rgba(0, 0, 0, .3)
.category
  position fixed
  top 0
  right 0
  bottom 56px
  left 0
  /*background #fff*/
  z-index 10
  .content-wrapper
    position absolute
    top 50px
    bottom 0
    width 100%
    .pull-up-wrap
      height 30px
      line-height 30px
      text-align center
      color $gray
  .loading-wrap
    display flex
    align-items center
    height 100%
.fade-leave-active
  transition all .5s
.fade-leave-to
  transform translateX(100%)
.no-result
  position absolute
  top 40%
  left 50%
  transform translate(-50%,-50%)
  color #999
  text-align center
  .img
    width 100px
    height 100px
    filter grayscale(1)
    margin-bottom 15px
</style>
