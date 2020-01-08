<template>
  <div class="card">
    <!--    <div class="time">
      {{order.payTime ? order.payTime.substring(0,16):order.createTime.substring(0,16)}}
    </div>
    <div class="descript">
      <h1 class="title">{{ order.orderStatus == 2 ?  '￥'+Number(order.orderPrice).toFixed(2) : '未支付'}}</h1>
    </div>-->
    {{ order.id }}
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
  .card
    display flex
    padding 10px 20px
    /*height 140px*/
    align-items center
    box-sizing border-box
    border-bottom 1px solid #e6e6e6
    .time
      width 150px
      color #666
    .descript
      flex 1
      margin-left 10px
      display flex
      text-align right
      flex-direction column
      box-sizing border-box
      line-height: 30px
      font-size 13px
      overflow hidden
      /*white-space nowrap*/
      .title
        flex 1
        color #333
        font-size 17px
        overflow hidden
        text-overflow ellipsis
</style>
