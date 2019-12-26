<template>
  <div class="header">
    <div class="tabs">
      <div class="item">
        <RouterLink to="/list/1">大陆</RouterLink>
      </div>
      <div class="item">
        <RouterLink to="/list/2">欧美</RouterLink>
      </div>
      <div class="item">
        <RouterLink to="/list/3">日本</RouterLink>
      </div>
      <div class="item">
        <RouterLink to="/list/4">韩国</RouterLink>
      </div>
    </div>
    <div class="user" @click="$router.push('/user')">
      <i class="iconfont icon-user"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheHeader'
}
</script>

<style lang="stylus" scoped>
  .header
    position fixed
    display flex
    width 100%
    height 56px
    bottom:0;
    line-height 56px
    color: $gray
    background $theme-color
    .logo
      width 25%
      padding 15px
      box-sizing border-box
      .back
        display block
        height 100%
        background url('~common/images/logo.png') no-repeat center
        background-size contain
    .tabs
      display flex
      flex 1
      font-size 17px
      .item
        flex 1
        text-align center
        a
          height 56px
          color: $gray
          display inline-block
          box-sizing border-box
    .user
      width 15%
      text-align center
      .icon-user
        font-size 25px
    .router-link-active
      font-weight: 700
      color #fff!important
</style>
