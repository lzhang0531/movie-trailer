<template>
  <div class="category-wrapper">
    <div class="list">
      <span
        v-for="item in list"
        :key="item.id"
        :class="{'active': categoryCode == item.categoryCode}"
        class="item"
        @click="selectItem(item.categoryCode)"
      >
        {{ item.categoryName }}
      </span>
    </div>
    <!--<button class="confirm-btn" @click="confirm">完成</button>-->
  </div>
</template>

<script>
export default {
  model: {
    prop: 'categoryCode',
    event: 'change'
  },
  props: {
    categoryCode: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      list: [],
      checkedCategoryCode: ''
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    getCategories () {
      this.$axios.get('/api/category/list').then(res => {
        if (res.res === 0) {
          this.list = res.data
        }
      })
    },
    resetCache () {
      this.cacheList = [this.categoryCode].slice()
    },
    selectItem (code) {
      if (this.checkedCategoryCode === code) {
        this.checkedCategoryCode = ''
      } else {
        this.checkedCategoryCode = code
      }
      this.confirm()
    },
    confirm () {
      this.$emit('change', this.checkedCategoryCode)
    }
  }
}
</script>

<style lang="stylus" scoped>
.category-wrapper
  padding 10px 25px
  border-radius 0 2px 2px 0
  .list
    display flex
    flex-wrap wrap
    .item
      padding 6px 12px
      margin: 0 10px 10px 0
      border-radius 5px
      font-size 13px
      color #777
      border 1px solid #ccc
      &.active
        border-color: #e8931b;
        color: #e8931b;
        background-color: #f3bc4a38;
  .confirm-btn
    width 60px
    height 30px
    background #409eff
    color #fff
    border none
    outline none
    border-radius 3px
</style>
