<template>
  <Transition name="fade">
    <div class="feedback">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>意见反馈</span>
      </div>
      <div class="content">
        <div class="title">
          &nbsp;&nbsp;&nbsp;&nbsp;我们希望倾听您对我们的所有意见和建议。我们会认真阅读您的意见，并持续改进。
        </div>
        <div>
          <div class="label"><span class="red">*</span>手机号</div>
          <MtField
            v-model="phone"
            label=""
            placeholder=""
            :state="phoneState"
          />
        </div>
        <div>
          <div class="label"><span class="red">*</span>意见反馈</div>
          <MtField
            v-model="content"
            label=""
            placeholder=""
            type="textarea"
            rows="4"
            :state="contentState"
          />
        </div>
        <div class="text-center">
          <MtButton
            type="primary"
            size="small"
            class="mg-20t"
            style="width: 80%"
            @click="add"
          >
            提交
          </MtButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Feedback',
  data () {
    return {
      inviter: '',
      phone: '',
      content: ''
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ]),
    phoneState () {
      return this.phone === '' ? '' : 'success'
    },
    contentState () {
      console.log(this.content)
      return this.content === '' ? '' : 'success'
    }
  },
  methods: {
    add () {
      if (this.phone != '' && this.content != '') {
        console.log(this.appUser)
        this.$axios.post(`/api/feedback/add`, {
          phone: this.phone,
          content: this.content,
          userId: this.appUser.userInfo.id
        }).then(res => {
          if (res.res === 0) {
            this.$toast({
              message: '提交成功',
              iconClass: 'icon icon-success'
            })
          } else {
            this.$toast({
              message: '提交失败!' + res.msg,
              iconClass: 'icon icon-error'
            })
          }
        }).catch(() => {
          this.$toast({
            message: '提交失败!',
            iconClass: 'icon icon-error'
          })
        })
      } else {
        this.$toast('请先填写必填项')
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
  .feedback {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    background: #eee;
    .title{
      font-size: .9em;
      line-height: 1.2em;
      color: #5F5F5F;
      margin-bottom: 20px;
    }
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
      position: absolute;
      top:50px;
      bottom: 0;
      background: #fff;
      padding:25px 10px;
    }
    .text{
      font-size: 20px;
    }
    .red{
      color: red;
      margin-right: 5px;
    }
    .label{
      margin-bottom: 5px;
      margin-top: 10px;
      color: #3b3b3b;
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
</style>
