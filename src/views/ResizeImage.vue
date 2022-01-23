<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <div class="text-h6 mb-10 font-weight-bold indigo--text">
      アップロードした画像をリサイズします。画像拡張子はpngのみ対応しています。
    </div>

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <p class="mt-4 font-weight-bold indigo--text">
      変換後サイズ : 160px × 256px / 512px × 512px / 600px × 600px / 800px ×
      800px / 1024px × 1024px / 1200px × 450px / 1280px × 2048px / 1280px ×
      2048px / 1600px × 600px / 1600px × 1200px / 1600px × 1200px / 4000px ×
      4000px
    </p>

    <p class="mt-4 font-weight-bold black--text">
      もし1枚しかダウンロードされないときは、ブラウザの設定で「複数画像のダウンロード」を許可してください。
    </p>

    <!--エラーメッセージがあったら表示-->
    <p
      v-if="this.error_message"
      class="mt-4 text-h6 font-weight-bold red--text"
    >
      {{ error_message }}
    </p>

    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'ResizeImage',

  data() {
    return {
      error_message: '', // エラーメッセージ
      file: null, // アップロードされたFile
      canvas: null,
      context: null,
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

      if (!_file.type.match('image/png')) {
        this.error_message = '!!! PNGファイルを選択してください !!!';
        return;
      }

      this.file = _file;

      this.makeResizeIamgeFiles();
    },

    // 必要なサイズの画像をすべて作成してダウンロードする
    makeResizeIamgeFiles: function () {
      this.resizeImgAndDownload(this.file, 160, 256);
      this.resizeImgAndDownload(this.file, 512, 512);
      this.resizeImgAndDownload(this.file, 600, 600);
      this.resizeImgAndDownload(this.file, 800, 800);
      this.resizeImgAndDownload(this.file, 1024, 1024);
      this.resizeImgAndDownload(this.file, 1200, 450);
      this.resizeImgAndDownload(this.file, 1280, 2048);
      this.resizeImgAndDownload(this.file, 1600, 600);
      this.resizeImgAndDownload(this.file, 1600, 1000);
      this.resizeImgAndDownload(this.file, 1600, 1200);
      this.resizeImgAndDownload(this.file, 4000, 4000);
    },

    // 指定されたサイズに画像をリサイズしてダウンロードする
    resizeImgAndDownload: function (image_file, width, height) {
      const canvas = this.canvas;
      canvas.width = width;
      canvas.height = height;
      const ctx = this.context;
      const imageBitmapPromise = createImageBitmap(image_file);

      imageBitmapPromise.then(
        // ------------------------------------------------------------
        // 成功時に実行されるコールバック関数
        // ------------------------------------------------------------
        function success(image_bitmap) {
          // ------------------------------------------------------------
          // ImageBitmap オブジェクトを描画する
          // ------------------------------------------------------------
          ctx.drawImage(image_bitmap, 0, 0, width, height);

          // var canvas = document.getElementById(canvas_id);
          //アンカータグを作成
          var a = document.createElement('a');
          //canvasをJPEG変換し、そのBase64文字列をhrefへセット
          a.href = canvas.toDataURL('image/png');
          //ダウンロード時のファイル名を指定
          // 「元のファイル名+大きさ」
          // 元のファイル名は拡張子はいらないので削除
          var reg = /(.*)(?:\.([^.]+$))/;
          a.download =
            image_file.name.match(reg)[1] +
            '_' +
            width +
            '_×' +
            height +
            '.png';
          //クリックイベントを発生させる
          a.click();
        },

        // ------------------------------------------------------------
        // 失敗時に実行されるコールバック関数
        // ------------------------------------------------------------
        function failure(e) {
          // 出力テスト
          console.log(e);
        }
      ); // 結果を受け取る
    },
  },

  watch: {
    workers: function (newValue, oldValue) {
      this.makeResizeIamgeFiles();
    },
  },

  mounted: function () {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext('2d');
  },
};
</script>
