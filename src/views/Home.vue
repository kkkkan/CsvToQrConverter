<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <!--エラーメッセージがあったら表示-->
    <p v-if="this.errorMessage" class="mt-4">{{ errorMessage }}</p>

    <!--エラーメッセージがなく、csvがアップロードされていたら表示-->
    <p v-if="!this.errorMessage && this.workers.length > 0" class="mt-4">
      <span class="red--text font-weight-black"> 赤字 </span>
      <span class="font-weight-black"> になっているのが、QRの内容です。 </span>
    </p>

    <ul>
      <div v-for="(item, index) in workers" :key="item" class="item">
        <qr-item
          class="mt-15 mb-15"
          :data="item"
          :qr_index="5"
          :index="index"
        ></qr-item>
      </div>
    </ul>
  </div>
</template>

<script>
import QrItem from '../components/QrItem.vue';
export default {
  name: 'Home',

  components: {
    QrItem,
  },

  data() {
    return {
      errorMessage: '', // エラーメッセージ
      workers: [], // アップロードされたcsvの内容
    };
  },

  methods: {
    // 新しいファイルがアップロードされたとき
    onUpload: function (event) {
      // 状態を初期化

      this.errorMessage = '';
      this.workers = [];

      const files = event.target.files || event.dataTransfer.files;
      const file = files[0];

      if (!file.type.match('text/csv')) {
        this.errorMessage = 'CSVファイルを選択してください';
        return;
      }

      this.fileName = file.name;

      let reader = new FileReader();
      reader.readAsText(file, 'Shift_JIS');

      reader.onload = () => {
        let lines = reader.result.split('\n');
        // lines.shift();
        let linesArr = [];
        for (let i = 0; i < lines.length; i++) {
          linesArr[i] = lines[i].split(',');
        }
        this.workers = linesArr;
      };
    },
  },
};
</script>
