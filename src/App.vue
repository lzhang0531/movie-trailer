<template>
  <div id="app">
    <div class="content">
      <KeepAlive :exclude="exclude">
        <RouterView/>
      </KeepAlive>
    </div>
    <TheHeader/>
  </div>
</template>

<script>
import TheHeader from 'components/TheHeader'
export default {
  name: 'App',
  components: {
    TheHeader
  },
  data () {
    return {
      exclude: ['User']
    }
  },
  beforeCreate: function () {
    function plusReady () {
      alert('uuid: ' + plus.device.uuid)
    };
    if (window.plus) {
      plusReady()
    } else {
      document.addEventListener('plusready', plusReady, false)
    }
    this.$store.commit('setUserInfo', {
      id: 123
    })
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
