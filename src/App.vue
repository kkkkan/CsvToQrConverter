<template>
  <v-app>
  <header>
    <v-app-bar app  light v-bind:color="this.appBarColor">
        <v-app-bar-nav-icon v-on:click="drawer = true" >
         <v-icon v-bind:color="this.appNavIconColor">mdi-menu</v-icon> <!--メニューアイコン-->
        </v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-black text-h4 mt-2" v-bind:class="this.textColorClass">
        {{ appTitle }}</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-container>
        <v-row justify="end">
          <div class="mt-3  font-weight-black" v-bind:class="this.textColorClass">
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
                        <v-list-item
             v-on:click="$router.push({path:'/icon_image_maker'})"
            >
              <v-list-item-title>Androidアプリアイコン用にリサイザー</v-list-item-title>
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
          <div class=" font-weight-black" v-bind:class="this.textColorClass">
            &copy; 2021 - {{ new Date().getFullYear() }} kkkkan
          </div>
        </v-row>
        <v-row justify="end" class=" font-weight-black" v-bind:class="this.textColorClass">
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
      appBarColor: String,
      appNavIconColor: String,
      textColorClass: String,
    };
  },

  methods: {
    // タイトルを設定する
    // 表示しているページによって変える
    createTitleDesc: function (routeInstance) {
      if (routeInstance.meta.appTitle) {
        var setTitle = routeInstance.meta.appTitle;
        this.appTitle = setTitle;
      } else {
        this.appTitle = 'title is not set';
      }

      if (routeInstance.meta.appBarColor) {
        var setBarColor = routeInstance.meta.appBarColor;
        this.appBarColor = setBarColor;
      } else {
        this.appBarColor = 'primary';
      }

      if (routeInstance.meta.appNavIconColor) {
        var setNavColor = routeInstance.meta.appNavIconColor;
        this.appNavIconColor = setNavColor;
      } else {
        this.appNavIconColor = 'indigo';
      }

      if (routeInstance.meta.textColorClass) {
        var setClass = routeInstance.meta.textColorClass;
        this.textColorClass = setClass;
      } else {
        this.textColorClass = 'indigo--text';
      }
    },
  },
  mounted: function () {
    var routeInstance = this.$route;
    this.createTitleDesc(routeInstance);
  },
  watch: {
    $route(routeInstance, from) {
      this.createTitleDesc(routeInstance);
    },
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
