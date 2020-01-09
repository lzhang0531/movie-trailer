<template>
  <Transition name="fade">
    <div class="buyMember">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>购买会员</span>
      </div>
      <div class="content">
        <div class="mg-10b">
          <div class="label">选择开通频道</div>
          <div>
            <div class="tabs">
              <div
                v-for="(key,item) in areaList"
                class="item"
                :class="{'active' : areaCode == item}"
                @click="areaCode=item, areaName=key"
              >
                <!--<i class="iconfont icon-dui" v-show="areaCode === item"/>-->
                {{ key }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="label">选择开通时长</div>
          <div class="time">
            <div class="item" :class="{'active' : amountType === 'oneMonth'}" @click="amountType='oneMonth',amount=1">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'oneMonth'"/>-->
              1个月 <span class="price">￥{{ amountObj.oneMonth }}</span>
            </div>
            <div class="item" :class="{'active' : amountType === 'threeMonth'}" @click="amountType='threeMonth',amount=3">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'threeMonth'"/>-->
              3个月 <span class="price">￥{{ amountObj.threeMonth }}</span>
            </div>
            <div class="item" :class="{'active' : amountType === 'twelveMonth'}" @click="amountType='twelveMonth',amount=12">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'twelveMonth'"/>-->
              12个月 <span class="price">￥{{ amountObj.twelveMonth }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="label">选择支付方式</div>
          <div class="tabs">
            <div class="item" :class="{'active' : orderType === 'alipay'}" @click="orderType='alipay'">
              <!--<i class="iconfont icon-dui" v-show="orderType === 'alipay'"/>-->
              支付宝支付
            </div>
            <div class="item" :class="{'active' : orderType === 'wechat'}" @click="orderType='wechat'">
              <!--<i class="iconfont icon-dui" v-show="orderType === 'wechat'"/>-->
              微信支付
            </div>
          </div>
        </div>
      </div>
      <div class="ui-row-flex ui-whitespace pay-bottom">
        <div class="ui-col ui-col-2 text-left">
          <div>总计: ￥<span class="price">{{ orderPrice }}</span></div>
          <div class="tip">您已选择开通{{ amount }}个月{{ areaName }}地区会员</div>
        </div>
        <div class="ui-col button text-center" @click="pay"><span>确认支付</span></div>
      </div>
      <div v-show="wetChatPay" class="wetChatPay">
        <div class="pay-block">
          <div id="qrcode" class="qrcode"/>
          <span class="mg-20t">扫描二维码进行支付</span>
          <button class="ui-btn ui-btn-primary mg-20t" @click="$router.back()">支付完成</button>
          <div class="mg-20t"><a @click="close">关闭</a></div>
        </div>
      </div>
      <!--<div v-show="payFlag" class="pay-result" @click="$router.back()">支付已完成?点此处返回>></div>-->
    </div>
  </Transition>
</template>

<script>
import { mapState } from 'vuex'
import { areaList } from 'index/common/js/areaList'
import { MessageBox } from 'mint-ui'
import QRCode from 'qrcodejs2'
export default {
  name: 'BuyMember',
  data () {
    return {
      amountObj: {},
      amountType: 'oneMonth',
      amount: '1',
      areaCode: this.$route.params.areaCode || '1',
      orderType: 'alipay',
      areaList: areaList,
      wetChatPay: false
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ]),
    orderPrice () {
      return Number(this.amountObj[this.amountType]).toFixed(2)
    },
    areaName () {
      return areaList[this.areaCode]
    }
  },
  beforeCreate () {
    this.$axios.get(`/api/order/get-payment-amount`).then(res => {
      this.amountObj = res.data
    })
  },
  methods: {
    close () {
      this.wetChatPay = false
      document.getElementById('qrcode').innerHTML = ''
    },
    pay () {
      if (this.appUser.userInfo.id !== '' && this.orderPrice != '') {
        this.$axios.post(`/api/order/create`, {
          orderType: this.orderType,
          orderPrice: this.orderPrice,
          areaCode: this.areaCode,
          amount: this.amount,
          userId: this.appUser.userInfo.id
        }).then(res => {
          if (res.res === 0) {
            this.payFlag = true
            if (this.orderType === 'alipay') {
              window.location.href = res.data.payUrl
              MessageBox({
                title: '提示',
                message: '确定支付完成?',
                confirmButtonText: '已完成',
                cancelButtonText: '未完成',
                showCancelButton: true
              }).then(action => {
                if (action === 'confirm') {
                  this.$router.back()
                }
              }).catch(() => {})
            } else {
              this.wetChatPay = true
              this.qrcode(res.data.payUrl)
            }
          } else {
            this.$toast({
              message: '创建订单失败!' + res.msg,
              iconClass: 'icon icon-error'
            })
          }
        }).catch(() => {
          this.$toast({
            message: '创建订单失败!',
            iconClass: 'icon icon-error'
          })
        })
      } else {
        this.$toast('创建订单失败')
      }
    },
    qrcode (url) {
      let qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .fade-enter-active, .fade-leave-active
    transition all .5s

  .fade-enter, .fade-leave-to
    transform translateX(100%)
  .tabs
    display flex
    flex 1
    font-size 15px
    .item
      flex 1
  .item
    text-align center
    padding: 10px 2px;
    border: 1px solid #e2e2e2;
    color #999
    box-sizing: border-box;
    margin-right: 10px;
    border-radius: 8px;
  .time
    .item
      margin-bottom 10px
</style>
<style lang="less" scoped>
  .buyMember {
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
      margin-top: 50px;
      padding:15px 0;
      background-color: #fff;
      > div{
        padding: 0 10px;
        margin-bottom: 10px;
      }
    }
    .text{
      font-size: 20px;
    }
    .label{
      padding: 10px 0;
      color:#3b3b3b
    }
    .active{
      border-color: #e8931b;
      color:  #e8931b;
      background-color: #f3bc4a38;
      .iconfont{
        font-weight: bold;
      }
    }
    .price{
      font-weight: bold;
      color:  #e8931b;
      font-size: 1.3em;
    }
    .item .price{
      font-size: 1em;
    }
    .ui-whitespace{
      padding-right: 0;
    }
    .pay-bottom{
      margin-top: 10px;
      background-color: #fff;
      .text-left{
        padding: 5px;
        color: #999;
        .tip{
          font-size: .6em;
          margin-top: 5px;
        }
      }
      .button{
        position: relative;
        span{
          position: absolute;
          top:50%;
          left:50%;
          width:100%;
          text-align: center;
          transform:translate(-50%,-50%);
        }
      }
      /*line-height: 40px;*/
    }
    .mint-msgbox{
      border-radius: 8px;
    }
    .mint-msgbox-confirm{
      font-weight: normal;
    }
    .wetChatPay{
      position: fixed;
      top:0;
      bottom: 0;
      background: rgba(0,0,0,.7);
      color: #fff;
      width: 100%;
      .pay-block{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60%;
        text-align: center;
        transform: translate(-50%, -50%);
        .qrcode{
          margin: 0 auto 20px;
          background-color: #fff;
          padding: 10px;
          width: 132px;
        }
      }
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
  .pay-result{
    width: 100%;
    text-align: center;
    margin-top:10px;
    color: #999;
    font-size: .6em;
  }
</style>
