<template>
  <Transition name="fade">
    <div class="stopPlay">
      <!--<i class="iconfont icon-left" @click="hide"/>-->
      <div v-if="userId" class="content">
        <div class="text">开通会员或使用免费次数观看完整版</div>
        <div class="text-center">
          <button class="ui-btn ui-btn-primary mg-20t" style="background-color: #faaf00" @click="buyMember"><i class="ui-subscript ui-subscript-red" style="overflow: hidden">推荐</i>开通会员</button>
          <button
            v-if="freeTimes > 0"
            class="ui-btn ui-btn-primary mg-20t"
            @click="useFree"
          >
            扣除免费次数(剩余{{ freeTimes }}次)
          </button>
          <button
            v-else
            class="ui-btn ui-btn-primary mg-20t"
            @click="$router.push({name:'share',params:{invitationCode:invitationCode}})"
          >
            邀请新用户
          </button>
          <div v-if="freeTimes === 0" class="tip">您的免费次数为0次，</div>
          <div v-if="freeTimes === 0" class="tip">可通过邀请新用户填写邀请码获得</div>
        </div>
        <p/>
      </div>
      <div v-else class="content">
        <div class="text">下载app观看完整版</div>
        <div class="text-center">
          <img src="~common/images/qrcode.png" class="img" height="100px">
          <div class="tip">扫描上方二维码，下载app</div>
        </div>
        <p/>
      </div>
    </div>
  </Transition>
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'StopPlay',
  props: {
    freeTimes: {
      type: Number,
      default: 0
    },
    videoId: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    invitationCode: {
      type: String,
      default: ''
    },
    areaCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  methods: {
    hide () {
      this.$parent.isShow = false
    },
    buyMember () {
      this.$router.push({ name: 'buyMember',
        params: {
          areaCode: this.areaCode
        } })
    },
    useFree () {
      if (this.userId && this.freeTimes > 0 && this.videoId) {
        MessageBox.confirm('请确认是否扣除?').then(action => {
          if (action === 'confirm') {
            this.$axios.put(`/api/user/use-free-time`, {
              videoId: this.videoId,
              id: this.userId
            }).then(res => {
              if (res.res === 0) {
                this.$toast({
                  message: '扣除成功',
                  iconClass: 'icon icon-success'
                })
                this.$parent.isShow = false
                this.$parent.canplayFlag = true
              } else {
                this.$toast({
                  message: '扣除失败!' + res.msg,
                  iconClass: 'icon icon-error'
                })
              }
            }).catch(() => {
              this.$toast({
                message: '查询用户信息失败!',
                iconClass: 'icon icon-error'
              })
            })
          }
        }).catch(() => {})
      } else {
        this.state = 'error'
        this.$toast('查询用户信息失败')
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
  .stopPlay {
    position: fixed;
    top: 0;
    height: 210px;
    /*bottom: 0;*/
    width: 100%;
    z-index: 100;
    /*background: #333333d4;*/
    background: #333333cc;
    color: #fff;
    .icon-left {
      font-size: 25px;
      color: #fff;
      position: absolute;
      left: 15px;
      top: 15px;
    }
    .content{
      position: absolute;
      top:50%;
      left:50%;
      width:100%;
      text-align: center;
      transform:translate(-50%,-50%);
      .text{
        margin-bottom: 10px;
        padding: 0 10%;
        font-weight: bold;
        color: #e8931b;
      }
      .tip{
        padding: 0 12%;
        line-height: 1em;
        font-size: .8em;
        color: #eeeeee;
        margin-top: 5px;
        text-align: center;
      }
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
    .ui-btn{
      width: 80%;
      display: inline;
    }
  }

</style>
