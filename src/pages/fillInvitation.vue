<template>
  <Transition name="fade">
    <div class="fillInvitation">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>填写邀请码</span>
      </div>
      <div class="content text-center">
        <div class="text">邀请码</div>
        <input
          v-model="inviter"
          type="text"
          class="input"
          placeholder="请输入邀请码"
        >
        <button class="ui-btn ui-btn-primary mg-20t" @click="doInviter">兑换</button>
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FillInvitation',
  data () {
    return {
      inviter: '',
      state: ''
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ])
  },
  methods: {
    doInviter () {
      if (this.inviter !== '') {
        console.log(this.appUser)
        this.$axios.post(`/api/user/fill-invitation-code`, {
          inviter: this.inviter,
          id: this.appUser.userInfo.id
        }).then(res => {
          if (res.res === 0) {
            this.$toast({
              message: '兑换成功',
              iconClass: 'icon icon-success'
            })
          } else {
            this.$toast({
              message: '兑换失败!' + res.msg,
              iconClass: 'icon icon-error'
            })
          }
        }).catch(() => {
          this.$toast({
            message: '兑换失败!',
            iconClass: 'icon icon-error'
          })
        })
      } else {
        this.state = 'error'
        this.$toast('请先填写邀请码')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .fade-enter-active, .fade-leave-active
    transition all .5s

  .fade-enter, .fade-leave-to
    transform translateX(100%)
</style>
<style lang="less" scoped>
  .fillInvitation {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    background: #eee;
    .head {
      width: 100%;
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
      padding: 15px 0;
      color: #222;
    }
    .icon-left {
      font-size: 25px;
      color: #222;
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .content {
      margin: 50px 8px 0;
      text-align: center;
      padding: 15px 20px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
    }
    .input,.ui-btn{
      width: 60%;
    }
    .input{
      border: none;
      border-bottom: 1px solid #ddd;
      margin-top: 20px;
      text-align: center;
      padding: 2px ;
    }
    .text{
      font-size: 1.2em;
      font-weight: bold;
    }
    .mint-cell-wrapper{
      background: none;
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
</style>
