<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <!--エラーメッセージがあったら表示-->
    <p v-if="this.error_message" class="mt-4">{{ error_message }}</p>

    <!--エラーメッセージがなく、csvがアップロードされていたら表示-->
    <p v-if="!this.error_message && this.workers.length > 0" class="mt-4">
      <span class="red--text font-weight-black"> 赤字 </span>
      <span class="font-weight-black"> になっているのが、QRの内容です。 </span>
    </p>

    <p class="mt-4 mb-4">
      <span>文字コード:</span>

      <span>
        <label class="mr-2 ml-2">
          <input
            type="radio"
            v-model="character_code"
            value="Shift_JIS"
          />Shift_JIS</label
        >
        <label
          ><input
            type="radio"
            v-model="character_code"
            value="utf-8"
          />UTF-8</label
        >
      </span>
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

const CHARACTER_CODE_SHIFT_JIS = 'Shift_JIS';
const CHARACTER_CODE_UTF_8 = 'utf-8';

export default {
  name: 'Home',

  components: {
    QrItem,
  },

  data() {
    return {
      error_message: '', // エラーメッセージ
      workers: [], // アップロードされたcsvの内容。解析結果。
      character_code: CHARACTER_CODE_SHIFT_JIS, // csvファイルを解析するときの文字コード
      qr_index: 5, // QRにするデータが何列目か(0始まり)
      is_encode_first_row: false, // 最初の行もエンコーディングするか
      file: null, // アップロードされたFile　文字コードが変わったときに再分析するためにFileそのものをとっておく必要がある
    };
  },

  methods: {
    // 新しいファイルがアップロードされたとき
    onUpload: function (event) {
      // 状態を初期化

      this.error_message = '';
      this.workers = [];
      this.file = null;

      const files = event.target.files || event.dataTransfer.files;
      const _file = files[0];

      if (!_file.type.match('text/csv')) {
        this.error_message = 'CSVファイルを選択してください';
        return;
      }

      this.file = _file;

      makeWorkers();
    },

    // csvの解析をして配列にする
    makeWorkers: function () {
      let reader = new FileReader();
      reader.readAsText(this.file, this.character_code);

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

  watch: {
    workers: function (newValue, oldValue) {
      this.makeWorkers();
    },
  },
};
</script>
