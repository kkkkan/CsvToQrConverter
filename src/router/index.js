import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import ResizeImage from '@/views/ResizeImage'

Vue.use(Router)

export default new Router({
  mode: 'history', // URLに#がつかなくなる
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // アプリバーのタイトルにセットする用のデータ
      meta: { appTitle: 'CSV→QR 生成' }
    },
    {
      path: '/resize-image',
      name: 'ResizeImage',
      component: ResizeImage,
      // アプリバーのタイトルにセットする用のデータ
      meta: { appTitle: '画像リサイズ' }
    }
  ]
})
