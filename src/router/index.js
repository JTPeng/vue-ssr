import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue'),
  },
  {
    path: '*',
    name: 'error404',
    component: () => import('@/pages/404.vue'),
  },
]

export const createRouter = () => {
  const router = new VueRouter({
    mode: 'history', // 同构应用中不能使用hash
    routes,
  })
  return router
}
