<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <h2>客户端交互</h2>
    <div>
      <input v-model="msg" />
    </div>
    <div @click="onClick">test</div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      msg: 'SSR',
    }
  },
  methods: {
    onClick() {
      console.log('onClick')
    },
  },
}
</script>
<style>
</style>