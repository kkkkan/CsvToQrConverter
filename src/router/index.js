import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import ResizeImage from '@/views/ResizeImage'
import IconImageMaker from '@/views/IconImageMaker'

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
    },
    {
      path: '/icon_image_maker',
      name: 'IconImageMaker',
      component: IconImageMaker,
      // アプリバーのタイトルにセットする用のデータ
      meta: { appTitle: 'Androidアプリアイコン用にリサイザー' }
    }
  ]
})
