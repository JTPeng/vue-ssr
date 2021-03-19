<template>
  <div>
    <h1>About Page</h1>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'About',
  metaInfo: {
    title: '关于',
  },
  serverPrefetch() {
    return this.getList()
  },
  serverCacheKey: (props) => props.item.id + '::' + props.item.last_updated,
  methods: {
    ...mapActions(['getList']),
  },
  computed: {
    ...mapState({
      list: (state) => state.list,
    }),
  },
  mounted() {
    if (!this.list.length) {
      this.$store.dispatch('getList')
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setList', [])
    next()
  },
}
</script>

<style scoped>
</style>