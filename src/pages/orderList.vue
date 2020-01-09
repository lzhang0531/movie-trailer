<template>
  <Transition name="fade">
    <div class="order">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>购买记录</span>
      </div>
      <div class="content-wrapper">
        <ScrollView :data="orderList" :pull-up-load="true" @pulling-up="loadMore">
          <div v-for="order in orderList" :key="order.id" class="card" >
            <ul class="ui-row" @click="order.orderStatus != 2 ? toPay(order.payUrl) : ''">
              <li class="ui-col ui-col-100"><div class="con" :class="{'success':order.orderStatus == 2}" />{{ order.payTime ? order.payTime.substring(0,16):order.createTime.substring(0,16) }}</li>
              <li class="ui-col ui-col-75"> ￥{{ Number(order.orderPrice).toFixed(2) }}</li>
              <li class="ui-col ui-col-25">{{ order.orderStatus == 2 ? '已支付' : '未支付' }}</li>
            </ul>
          </div>

          <div class="pull-up-wrap">
            <p v-show="pullUpLoading">正在加载...</p>
            <p v-show="noMore">没有更多了~</p>
          </div>
        </ScrollView>
        <div v-show="noResult" class="no-result">
          <img src="~index/common/images/noresult.png" class="img">
          <p class="text">没有相关订单</p>
        </div>
      </div>
      <div v-show="!orderList.length&&!noResult" class="loading-wrap">
        <Loading/>
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrderList',
  components: {
  },
  data () {
    return {
      orderList: [],
      count: -1,
      page: 1,
      pullUpLoading: false,
      categories: [],
      userId: ''
    }
  },
  computed: {
    noMore () {
      return this.count === this.orderList.length && this.count !== 0
    },
    noResult () {
      return this.count === 0
    },
    ...mapState([
      'appUser'
    ])
  },
  created () {
    this.getOrderList()
  },
  beforeRouteUpdate  (to, from, next) {
    this.page = 1
    this.orderList = []
    this.count = 0
    next()
    this.getOrderList()
  },
  methods: {
    toPay (payUrl) {
      window.location.href = payUrl
    },
    getOrderList () {
      if (!this.appUser.userInfo.id) {
        this.count = 0
        return
      }
      const params = {
        pageNum: this.page,
        pageSize: 10,
        userId: this.appUser.userInfo.id
      }
      this.$axios.get('/api/order/page', { params }).then(res => {
        if (res.res === 0) {
          this.orderList = this.orderList.concat(res.data.list)
          this.count = res.data.total
        }
        this.$nextTick(() => {
          this.pullUpLoading = false
        })
      })
    },
    loadMore () {
      const { orderList, count } = this
      if (orderList.length === count) return
      this.page += 1
      this.pullUpLoading = true
      this.getOrderList()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .order-wrapper
    padding 10px 20px
    box-sizing: border-box
    border-bottom: 1px solid #e6e6e6
    text-align:center
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
  .order
    z-index 10
    .content-wrapper
      position fixed
      top 50px
      right 0
      bottom 0
      left 0
      background #f2f2f2
      z-index 10
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
<style lang="less" scoped>
  .order{
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
    .card{
      -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
      background: #fff;
      margin: 0 5px 10px;
      padding: 10px;
      color: #3b3b3b;
      li{
        font-size: .9em;
      }
      li+li{
        margin-top: 10px;
        color: #888;
      }
    }
    .con{
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #e8931b;
      display: inline-block;
      margin-right: 6px;
      position: relative;
      top: -3px;
      &.success{
        background-color: limegreen;
      }
    }
  }
</style>
