<template>
  <v-app>
    <v-app-bar app color="primary" dark　>
      <v-toolbar-title class="indigo--text font-weight-black text-h4 mt-2">
        CSV → QR 生成</v-toolbar-title
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
  </v-app>
</template>

<script>
import GitHash from '@/assets/hash.json';

export default {
  name: 'App',

  data() {
    return {
      GitHash: GitHash,
    };
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
