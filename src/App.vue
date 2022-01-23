<template>
  <v-app>
  <header>
    <v-app-bar app color="primary" light>
        <v-app-bar-nav-icon v-on:click="drawer = true" >
         <v-icon>mdi-menu</v-icon> <!--メニューアイコン-->
        </v-app-bar-nav-icon>
      <v-toolbar-title class="indigo--text font-weight-black text-h4 mt-2">
        {{ appTitle }}</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-container>
        <v-row justify="end">
          <div class="mt-3 indigo--text font-weight-black">
            version : {{ this.GitHash }}
          </div>
        </v-row>
        <!-- <v-row justify="end">
          <div class="indigo--text font-weight-black">
            &copy; 2021 - {{ new Date().getFullYear() }} kkkkan
          </div>
        </v-row>
        <v-row justify="end" class="indigo--text font-weight-black">
          <div>kan4649kan@gmail.com</div>
        </v-row> -->
      </v-container>
    </v-app-bar>
       <!-- ここから -->
      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group>
            <v-list-item
            v-on:click="$router.push({path:'/'})"
            >
              <v-list-item-title>CSV To QR</v-list-item-title>
            </v-list-item>
            <v-list-item
             v-on:click="$router.push({path:'/resize-image'})"
            >
              <v-list-item-title>画像リサイズ</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

    <v-main class="mt-10 mb-10">
      <v-container　class="main">
        <v-row class="main">
          <router-view />
        </v-row>

        <!--署名は画面下部-->
        <v-row justify="end">
          <div class="indigo--text font-weight-black">
            &copy; 2021 - {{ new Date().getFullYear() }} kkkkan
          </div>
        </v-row>
        <v-row justify="end" class="indigo--text font-weight-black">
          <div>kan4649kan@gmail.com</div>
        </v-row>
      </v-container>
    </v-main>
    </header>
  </v-app>
</template>

<script>
import GitHash from '@/assets/hash.json';

export default {
  name: 'App',

  data() {
    return {
      GitHash: GitHash,
      drawer: false,
      appTitle: String,
    };
  },

  methods: {
    // タイトルを設定する
    // 表示しているページによって変える
    createTitleDesc: function (routeInstance) {
      if (routeInstance.meta.appTitle) {
        var setTitle = routeInstance.meta.appTitle
        this.appTitle = setTitle
      } else {
        this.appTitle = 'title is not set'
      }
    },
  },
  mounted: function () {
    var routeInstance = this.$route
    this.createTitleDesc(routeInstance)
  },
  watch: {
  $route(routeInstance, from) {
    this.createTitleDesc(routeInstance)
  }
  },

};
</script>

<style>
<!--ファイルがない時にも、署名を画面最下部に持っていくために最低の高さを画面サイズにする。--
  > html {
  height: 100%;
}
.main {
  height: 100%;
}
.main {
  min-height: 100%;
}
</style>
