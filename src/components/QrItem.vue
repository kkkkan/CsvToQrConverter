<template>
  <div>
    <div class="text-center font-weight-bold text-h4">{{ getTitle() }}</div>
    <!--中央揃えにする-->
    <v-container class="d-flex justify-content-center">
      <v-col>
        <v-row>
          <vue-qrcode :value="getQrTarget()" tag="img"></vue-qrcode>
        </v-row>
      </v-col>

      <v-col>
        <div v-for="(item, _index) in data" :key="item" class="mr-4 ml-4">
          <!--URLにしているものだったら赤字で太め、それ以外は黒字で表示-->
          <div v-if="_index != getQrTargetIndex()">{{ item }}</div>
          <div
            v-if="_index == getQrTargetIndex()"
            class="red--text font-weight-black"
          >
            {{ item }}
          </div>
        </div>
      </v-col>
      <v-col>
        <v-spacer></v-spacer>
      </v-col>
      <div class="space"></div>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';

Vue.use(VueQrcode);

export default {
  name: 'QrItem',

  components: {
    VueQrcode,
  },

  data() {
    return {
      array_size: 0,
      //   targeText: '',
      option: {
        errorCorrectionLevel: 'M',
        maskPattern: 0,
        margin: 10,
        scale: 2,
        width: 300,
        color: {
          dark: '#000000FF',
          light: '#FFFFFFFF',
        },
      },
    };
  },
  props: [
    'data', // 1行分のデータ(配列)
    'qr_index', // QRコードにするアイテムの入っているindex(0始まり)
    'index', // csv全体のなかでこの行が何行目か(0始まり)
  ],

  methods: {
    getTitle: function () {
      return this.index + 1;
    },
    // QRコードにする文字列の取得
    getQrTarget: function () {
      const targetIndex = this.getQrTargetIndex();
      return this.data[targetIndex];
    },
    // QRコードにするコンテンツのindexを計算
    getQrTargetIndex: function () {
      if (this.qr_index >= this.data.length) {
        // 指定されたqr_indexがdata長より長かったら
        // ないはずだが念のため
        return this.data.length - 1;
      } else {
        return this.qr_index;
      }
    },
  },
};
</script>

<style>
.space {
  height: 500px;
}
</style>