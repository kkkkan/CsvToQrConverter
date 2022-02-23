npm<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <div class="mb-10" v-bind:class="this.textColorClass">
      <p class="text-h6 font-weight-bold">
        アップロードした画像をAndroidアプリのアイコン用のサイズに自動でリサイズ&ダウンロードします。<br />
        「元のファイル名+設置すべきフォルダの解析度」.png
        となっているので、アプリソースに移動するときに適切にリネームしてください。
      </p>
      <p class="text-h6">
        ※アップロード画像はpng・jpegのみ対応しています。ダウンロード画像の拡張子はpngです。
        <br />なるべく大きく・高画質な画像をアップロードすることをお勧めします。
      </p>
      <p>正方形以外の画像をアップロードした場合、縦横比が崩れるので注意。</p>
    </div>

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <p class="mt-4 font-weight-bold" v-bind:class="this.textColorClass">
      変換後サイズ
      <ui class="font-weight-regular">
        <li>108px × 108px … mdpi</li>
        <li>162px × 162px … hdpi</li>
        <li>216px × 216px … xhpdi</li>
        <li>324px × 324px … xxhdpi</li>
        <li>432px × 432px … xxxhpdi</li>
      </ui>
    </p>

    <p class="mt-4 font-weight-bold black--text">
      1枚しかダウンロードされない場合は、ブラウザの設定で「複数ファイルのダウンロード」を許可してください。
    </p>

    <!--エラーメッセージがあったら表示-->
    <p
      v-if="this.error_message"
      class="mt-4 text-h6 font-weight-bold red--text"
    >
      {{ error_message }}
    </p>

    <!-- <canvas ref="canvas"></canvas> -->
  </div>
</template>

<script>
export default {
  name: 'IconImageMaker',

  data() {
    return {
      error_message: '', // エラーメッセージ
      file: null, // アップロードされたFile
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

      if (!_file.type.match('image/png') && !_file.type.match('image/jpeg')) {
        this.error_message =
          '!!! PNGファイルまたはJPEGファイルを選択してください !!!';
        return;
      }

      this.file = _file;

      this.makeResizeIamgeFiles();
    },

    // 必要なサイズの画像をすべて作成してダウンロードする
    makeResizeIamgeFiles: function () {
      this.resizeImgAndDownload(this.file, 108, 108, 'mdpi');
      this.resizeImgAndDownload(this.file, 162, 162, 'hdpi');
      this.resizeImgAndDownload(this.file, 216, 216, 'xhdpi');
      this.resizeImgAndDownload(this.file, 324, 324, 'xxhdpi');
      this.resizeImgAndDownload(this.file, 432, 432, 'xxxhdpi');
    },

    // 指定されたサイズに画像をリサイズしてダウンロードする
    resizeImgAndDownload: function (image_file, width, height, suffix) {
      this.resizeImgAndDownloadPng(image_file, width, height, suffix);
    },

    // 指定された大きさのpngファイルを作成しダウンロードする。
    resizeImgAndDownloadPng: function (image_file, width, height, suffix) {
      // 毎回別のCanvasを作成してやらないと、複数枚一度にダウンロードしたときにあとから設定したサイズの影響が残ってしまい
      // 生成画像の大きさがおかしくなる。
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      //ダウンロード時のファイル名を作成
      // 「元のファイル名+設置すべきフォルダの解析度」
      var reg = /(.*)(?:\.([^.]+$))/;
      const file_name = image_file.name.match(reg)[1] + '_' + suffix + '.png';
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

          //アンカータグを作成
          var a = document.createElement('a');
          //canvasをpng変換し、そのBase64文字列をhrefへセット
          //入力canvasのファイルサイズを計測

          const data_url = canvas.toDataURL('image/png');

          // console.error('filesizeorigiun ' + filesize_out);
          a.href = data_url;
          //ダウンロード時のファイル名を指定
          // 「元のファイル名+設置すべきフォルダの解析度」
          a.download = file_name;
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
