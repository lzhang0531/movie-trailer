<template>
  <Transition name="fade">
    <div class="user">
      <div class="userinfo-wrapper">
        <div class="avatar">
          <img src="~index/common/images/user.png" width="32">
        </div>
        <div class="info">
          <div class="mg-5b">
            <span v-if="appUser.userInfo.userName" class="text" :class="{vip : appUser.userInfo.memberDtos}">{{ appUser.userInfo.userName }}</span>
            <span class="buy" @click="$router.push('/buyMember')">购买会员</span>
          </div>
          <span>
            <div v-for="item in appUser.userInfo.memberDtos" class="mg-2b">{{ areaList[item.areaCode] }}会员: {{ item.memberEndTime.substring(0,10) }}</div>
          </span>

          <!--<span class="text" v-if="appUser.userInfo.memberFlag"></span>-->
        </div>
        <i class="iconfont icon-left" @click="$router.back()"/>
      </div>
      <div class="menu-wrapper">
        <ul class="menus">
          <li class="menu-item" @click="$router.push('/orderList')">
            <i class="iconfont icon-history"/>
            <span class="text">购买记录</span>
            <i class="iconfont icon-right"/>
          </li>
          <li class="menu-item" @click="$router.push('/feedback')">
            <i class="iconfont icon-email" />
            <span class="text">意见反馈</span>
            <i class="iconfont icon-right" />
          </li>
          <li class="menu-item" @click="showInvitationModal">
            <i class="iconfont icon-share"/>
            <span class="text">推荐有奖</span>
            <i class="iconfont icon-right"/>
          </li>
          <li class="menu-item" @click="$router.push('/fillInvitation')">
            <i class="iconfont icon-user"/>
            <span class="text">填写邀请码</span>
            <i class="iconfont icon-right"/>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script>
import { areaList } from 'index/common/js/areaList'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'User',
  data () {
    return {
      areaList: areaList
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ])
  },
  created () {
    if (!this.appUser.userInfo.userName) {
      this.getUserInfo(this.appUser.deviceId)
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.getUserInfo(vm.appUser.deviceId)
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    showInvitationModal () {
      this.$router.push({ name: 'share', params: { invitationCode: this.appUser.userInfo.invitationCode } })
    }
  }
}
</script>

<style lang="stylus" scoped>
.user
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 10
  background #fff
  .userinfo-wrapper
    display flex
    justify-content center
    align-items center
    height 175px
    background url('~index/common/images/background.jpg') no-repeat
    background-size cover
    .avatar
      display flex
      align-items center
      justify-content center
      width 67px
      height 67px
      background #eee
      border-radius 50%
    .info
      display flex
      flex-direction column
      padding-left 10px
      font-size 13px
      color #fff
      .text
        flex 1
        line-height 33px
        font-size 25px
    .icon-left
      position absolute
      top 10px
      left 10px
      font-size 25px
      color #fff
  .menu-wrapper
    .menus
      padding-left 10px
      .menu-item
        padding 10px
        font-size 18px
        line-height 25px
        list-style none
        border-bottom 1px solid #d8d8d8
        color #3b3b3b
        .iconfont
          vertical-align bottom
          font-size 25px
          margin-right 8px
        .icon-email
          font-weight bold
        .icon-right
          font-size 20px
          float right
.fade-enter-active, .fade-leave-active
  transition all .5s
.fade-enter, .fade-leave-to
  transform translateX(100%)
.mg-2b
    margin-bottom 4px
.vip
  color: #e8931b
  font-weight bold
.buy
  margin-left 5px
  color #f2d142
.mg-5b
  margin-bottom 5px
</style>
