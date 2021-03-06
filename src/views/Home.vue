<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <div
      class="text-h6 mb-10 font-weight-bold"
      v-bind:class="this.textColorClass"
    >
      CSVファイルの指定された列のデータをQRコード画像にします。
    </div>

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <!--エラーメッセージがあったら表示-->
    <p v-if="this.error_message" class="mt-4 font-weight-bold red--text">
      {{ error_message }}
    </p>

    <!--エラーメッセージがなく、csvがアップロードされていたら表示-->
    <p v-if="!this.error_message && this.workers.length > 0" class="mt-4">
      <span class="red--text font-weight-black"> 赤字 </span>
      <span class="font-weight-black">
        になっているのが、QRコードの内容です。
      </span>
    </p>

    <!--文字コードの設定-->
    <p class="mt-4 mb-4">
      <span>文字コード:</span>

      <span>
        <label class="mr-2 ml-2">
          <input type="radio" v-model="character_code" value="Shift_JIS" /><span
            v-bind:class="{
              'font-weight-bold': character_code == 'Shift_JIS',
            }"
            >Shift_JIS</span
          ></label
        >
        <label
          ><input type="radio" v-model="character_code" value="utf-8" /><span
            v-bind:class="{
              'font-weight-bold': character_code == 'utf-8',
            }"
            >UTF-8</span
          ></label
        >
      </span>
    </p>

    <!--QRにするのが各行の何列目か-->
    <p class="mt-4 mb-4">
      <span
        >QRコード画像にするのは何列目ですか。最初の列を0として数えてください。:</span
      >

      <label class="mr-2 ml-2">
        <input
          type="number"
          min="0"
          v-model.number="qr_index"
          class="font-weight-bold"
        />
      </label>
    </p>

    <!--CSVファイルの全列数より大きな数字を指定した場合の挙動の説明。文字は小さくして、少し奥から始める。-->
    <p class="text-body2 ml-3">
      ※アップロードしたCSVの列数より大きい数を指定した場合、最後の列がQRコード画像になります。
    </p>

    <!--最初の行もQR化するか-->
    <p class="mt-4 mb-4">
      <label>
        <input type="checkbox" v-model="is_encode_first_row" />
        <span
          v-bind:class="{
            'font-weight-bold': is_encode_first_row,
          }"
        >
          先頭行もQRにする
        </span>
      </label>
    </p>

    <!--QR一覧-->
    <ul>
      <div v-for="(item, index) in workers" :key="item" class="item">
        <qr-item
          class="mt-15 mb-15"
          :data="item"
          :qr_index="qr_index"
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
      textColorClass: String, // このページのテキストの基本色
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
        if (!this.is_encode_first_row) {
          // 先頭列はQR対象外のときは1個スキップ
          lines.shift();
        }
        let linesArr = [];
        for (let i = 0; i < lines.length; i++) {
          if (i == lines.length - 1 && lines[i].length == 0) {
            // 最終行で中身がないときはスキップ
            // csvは最後行が改行で終わっていることが多いみたいだ
            break;
          }
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
    is_encode_first_row: function () {
      // 先頭行もQRにするか否かを変えた時はデータごと変えてやる
      // 最初は、データは変えずv-ifでUIの方だけ出しわけようとしたが
      // それだとファイルは同じままON/OFFを入れ替えた時に、再描写が追い付かないのか表示がおかしくなった。
      // ので、データごと作り直してやる。
      this.makeWorkers();
    },
  },

  mounted() {
    // ページのテーマを決める
    if (this.$route.meta.textColorClass) {
      var setClass = this.$route.meta.textColorClass;
      this.textColorClass = setClass;
    } else {
      this.textColorClass = 'indigo--text';
    }
  },
};
</script>
