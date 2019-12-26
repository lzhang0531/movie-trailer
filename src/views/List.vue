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
          <SizerCategory
            v-show="activeTabIdx === 0"
            ref="sizerCategory"
            v-model="categories"
            @change="getMovieList"
          />
        </div>
        <div v-show="activeTabIdx !== -1" class="mask" @click="closeTab"/>
      </div>
      <div class="content-wrapper">
        <ScrollView :data="movieList" :pull-up-load="true" @pulling-up="loadMore">
          <Card
            v-for="movie in movieList"
            :key="movie._id"
            :movie="movie"
            @select="gotoDetail"
          />
          <div class="pull-up-wrap">
            <p v-show="pullUpLoading">正在加载...</p>
            <p v-show="noMore">没有更多了~</p>
          </div>
        </ScrollView>
        <div v-show="noResult" class="no-result">
          <img src="~common/images/noresult.png" class="img">
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
import SizerCategory from 'components/SizerCategory'

export default {
  name: 'List',
  components: {
    SizerCategory
  },
  data () {
    return {
      movieList: [],
      count: -1,
      page: 1,
      cats: ['分类'],
      activeTabIdx: -1,
      pullUpLoading: false,
      categories: [],
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
    next()
    this.getMovieList()
  },
  methods: {
    getMovieList () {
      this.activeTabIdx = -1
      console.log(this.$route.params)
      const params = {
        page: this.page,
        page_size: 10,
        type: 1,
        categories: this.categories
      }
      this.$axios.get('/api/movie/get_movies', { params }).then(res => {
        if (res.code === 1001) {
          this.movieList = this.movieList.concat(res.result.movies)
          this.count = res.result.count
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
    // 切换 type、tab[1] 名字
    changeType ({ type, name }) {
      this.params.type = type
      this.cats[1] = name
      this.getMovieList()
    },
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

      if (idx === 2) {
        this.$nextTick(() => {
          this.$refs.sizerRate.resetCache()
        })
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
  background #fff
  z-index 10
  .content-wrapper
    position absolute
    top 40px
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
