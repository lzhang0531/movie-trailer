<template>
  <Transition name="fade">
    <div class="share">
      <i class="iconfont icon-left" @click="$router.back()"/>
      <div class="download">
        <div v-if="invitationCode" class="invitation">邀请码<span class="invitationCode">{{ invitationCode }}</span></div>
        <img src="~common/images/qrcode.png" width="100%">
        <div class="text">扫描上方二维码，下载应用</div>
        <div class="text" >邀请好友，可免费获得观影次数</div>
      </div>
    </div>
  </Transition>
</template>

<script>

export default {
  name: 'Share',
  data () {
    return {
      invitationCode: this.$route.params.invitationCode
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
    .share {
        background: url('~common/images/background.jpg') no-repeat;
        background-size: cover;
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 100;
        color: #fff;
        .download {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60%;
            text-align: center;
            transform: translate(-50%, -50%);
            .invitation{
                margin-bottom: 20%;
            }
            .invitationCode{
                color: #e8931b;
                font-size: 1.5em;
                font-weight: bold;
                margin-left: 20px;
            }
            .text {
                font-size: .8em;
                margin-top: 10px;
            }
        }
        .icon-left {
            position: absolute;
            top: 15px;
            left: 15px;
            font-size: 25px;
            color: #fff;
            font-weight: bold;
            z-index: 1000;
        }
    }
</style>
