<template>
  <Transition name="fade">
    <div class="movie">
      <div class="player-wrapper" @touchmove.prevent >
        <div v-show="!isShow" ref="player" class="player"/>
        <i class="iconfont icon-left" @click="$router.back()"/>
      </div>
      <StopPlay
        v-show="isShow"
        :free-times="freeTimes"
        :video-id="$route.params.id"
        :user-id="appUser.userInfo.id || ''"
        :invitation-code="appUser.userInfo.invitationCode || ''"
        :area-code="movie.areaCode || ''"
      />
      <div class="info-wrapper">
        <div class="layer-wrapper">
          <div class="title">
            <span class="text">{{ movie.name }}</span>
          </div>
          <div v-if="movie.name" class="desc">
            <div class="descript">
              <div class="category item">
                <span class="name">类型</span>
                <span class="text">{{ movie.categoryName }} </span>
              </div>
            </div>
            <div class="descript">
              <div class="category item">
                <span class="name">简介</span>
                <span class="text">{{ movie.introduction }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script>
import StopPlay from 'index/components/StopPlay'
import { mapState } from 'vuex'
import config from 'index/config'
const { baseUrl } = config
const { playTime } = config

export default {
  name: 'Movie',
  components: {
    StopPlay
  },
  data () {
    return {
      movie: {},
      isShow: false,
      canplayFlag: false,
      freeTimes: 0
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ])
  },
  beforeRouteUpdate  (to, from, next) {
    next()
    this.getDetail()
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.judgePlay()
    })
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      const { id } = this.$route.params
      this.$axios.get(`/api/video/${id}`).then(res => {
        if (res.res === 0) {
          this.movie = res.data
          this.initPlayer()
        }
      })
    },
    judgePlay () {
      if (!this.appUser.deviceId || !this.appUser.userInfo.id) {
        this.canplayFlag = false
      } else {
        this.$axios.put(`/api/user/judge-play`, {
          videoId: this.$route.params.id,
          id: this.appUser.userInfo.id
        }).then(res => {
          if (res.res === 0) {
            this.canplayFlag = res.data.memberFlag || res.data.userTimeFlag
            this.freeTimes = res.data.freeTimes
          } else {
            this.canplayFlag = false
            this.freeTimes = 0
          }
        })
      }
    },
    initPlayer () {
      const { DPlayer } = window
      this.player = new DPlayer({
        container: this.$refs.player,
        video: {
          url: baseUrl + '/file/' + this.movie.videoPath,
          pic: baseUrl + '/file/' + this.movie.thumbnailPath
        }
      })
      if (!this.canplayFlag) {
        this.player.on('timeupdate', (a) => {
          if (this.player.video.currentTime > playTime && !this.canplayFlag) {
            this.player.pause()
            this.player.fullScreen.cancel()
            this.isShow = true
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.movie
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index: 20
  overflow hidden
  background #fff
  .player-wrapper
    height 210px
    .player
      height 210px
    .icon-left
      position absolute
      top 15px
      left 15px
      font-size 25px
      color #fff
      font-weight bold
      z-index 1000
  .info-wrapper
    position relative
    height calc(100% - 210px)
    section
      position relative
      padding 15px
      min-height 70px
      background #fff
    .info
      .title
        font-size 20px
        font-weight bold
        padding-right 100px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .descript
        margin-top 20px
        color #777
        font-size 15px
      .switch-wrapper
        position absolute
        top 15px
        right 15px
        color #777
        .text
          font-size 15px
          font-weight normal
        .icon
          font-weight bold
          vertical-align text-bottom
          line-height 20px
    .relative-movies
      .text
        font-weight bold
        font-size 15px
      .list
        margin-top 15px
        .item
          display flex
          flex-direction row
          // margin-bottom 5px
          padding 10px 0
          line-height 23px
          border-bottom: 1px solid #eee
          .desc
            flex 1
            display flex
            flex-direction column
            justify-content space-between
            margin-left 15px
            overflow hidden
            .title
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            .rate
              .text
                color #faaf00
    .loading-wrap
      margin-top 150px
    .layer-wrapper
      position absolute
      top: 0
      bottom 0
      width 100%
      background #fff
      .title
        padding 5px 10px
        border-bottom 1px solid #eee
        height 20px
        line-height 20px
        font-size 15px
        font-weight bold
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        .icon-down
          float right
      .desc
        position absolute
        top 30px
        bottom 0
        left 0
        right 0
        padding 0 10px
        overflow scroll
        .descript
          margin 10px 0
          font-size 13px
          /*border-bottom 1px solid #eee*/
          .item
            display flex
            margin-bottom 10px
            line-height 20px
            .name
              margin-right 8px
              white-space nowrap
              font-weight bold
        .casts
          font-size 0
          white-space nowrap
          overflow-x scroll
          border-bottom 1px solid #eee
          .cast
            width 70px
            margin-bottom 10px
            overflow hidden
            display inline-block
            font-size 13px
            text-align center
            .img
              width 60px
            .name
              overflow hidden
              margin-top 10px
              text-overflow ellipsis
        .summary
          .title
            border-bottom none
            font-size 14px
            font-weight bold
            margin 15px 0
            padding 0
          .text
            font-size 12px
            line-height 20px
.layer-enter-active, .layer-leave-active
    transition all .3s
.layer-enter, .layer-leave-to
  transform translateY(100%)
.fade-leave-active
  transition all .5s
.fade-leave-to
  transform translateX(100%)
</style>
