<template>
  <v-app>
    <v-app-bar app color="primary" dark　height="80px">
      <v-toolbar-title
      class="indigo--text font-weight-black text-h4 mt-2"
      > CSV → QR 生成</v-toolbar-title>

      <!-- <v-spacer></v-spacer> -->

      <v-container >
          <v-row justify="end">
            <div class="mt-3 indigo--text font-weight-black ">version : {{this.GitHash}}</div>
          </v-row>
          <v-row justify="end">
            <div class="indigo--text font-weight-black ">&copy; 2021 - {{ new Date().getFullYear() }} kkkkan</div>
          </v-row>
          <v-row justify="end" class="indigo--text font-weight-black ">
            <div>kan4649kan@gmail.com</div>
          </v-row>
        </v-container>
    </v-app-bar>

    <v-main class="mt-10 ml-10 mr-10 mb-10">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import GitHash from "@/assets/hash.json";


export default {
  name: "App",

  data() {
    return {
      GitHash: GitHash
    };
  }
};
</script>
