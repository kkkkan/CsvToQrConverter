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
      // 画面の細部を決めるためのデータ
      meta: {
        appTitle: 'CSV→QR 生成', // アプリバーのタイトル
        appBarColor: 'teal lighten-5', // アプリバーの背景色
        appNavIconColor: 'teal', // アプリバーのナビゲーションアイコンの色
        textColorClass: 'teal--text', // アプリバーを含めた画面全体のテキストの基本色
      }
    },
    {
      path: '/resize-image',
      name: 'ResizeImage',
      component: ResizeImage,
      // 画面の細部を決めるためのデータ
      meta: {
        appTitle: '画像リサイズ',
        appBarColor: 'pink lighten-5',
        appNavIconColor: 'pink',
        textColorClass: 'pink--text',
      }
    },
    {
      path: '/icon_image_maker',
      name: 'IconImageMaker',
      component: IconImageMaker,
      // 画面の細部を決めるためのデータ
      meta: {
        appTitle: 'Androidアプリアイコン用にリサイザー',
        appBarColor: 'orange lighten-5',
        appNavIconColor: 'orange darken-3',
        textColorClass: 'orange--text text--darken-3' // テキストカラーは明暗を調整には、色の指定と明暗の指定で二つ必要。
      }
    }
  ]
})
