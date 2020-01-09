<template>
  <div id="app">
    <div class="content">
      <RouterView/>
    </div>
    <TheHeader/>
  </div>
</template>

<script>
import TheHeader from 'index/components/TheHeader'

export default {
  name: 'App',
  components: {
    TheHeader
  },
  data () {
    return {
      exclude: ['User']
    }
  }
}
</script>

<style lang="stylus" scoped>
    .content
        position absolute
        botton 56px
        top 0
        width 100%
</style>
