import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const createStore = () => {
  return new Vuex.Store({
    state: {
      list: [], // 文章列表
    },
    mutations: {
      // 修改容器状态
      setList(state, data) {
        state.list = data
      },
    },
    actions: {
      async getList({ commit }) {
        console.log(111)
        const { data } = await axios({
          method: 'GET',
          url: 'https://cnodejs.org/api/v1/topics',
        })
        commit('setList', data.data)
      },
    },
  })
}
