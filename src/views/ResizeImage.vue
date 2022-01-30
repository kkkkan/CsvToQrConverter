<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <div class="text-h6 mb-10 font-weight-bold indigo--text">
      <p>
        アップロードした画像を複数のサイズに自動でリサイズ&ダウンロードします。
      </p>
      <p>
        アップロード画像はpng・jpegのみ対応しています。ダウンロード画像の拡張子はjpegです。
      </p>
    </div>

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <p class="mt-4 font-weight-bold indigo--text">
      変換後サイズ & ファイルサイズ上限
      <ui>
        <li>160px × 256px (100KB)</li>
        <li>512px × 512px (4,000KB)</li>
        <li>600px × 600px (400KB)</li>
        <li>800px × 800px (500KB)</li>
        <li>1024px × 1024px (4,000KB)</li>
        <li>1200px × 450px (500KB)</li>
        <li>1280px × 2048px (4,000KB)</li>
        <li>1600px × 600px (4,000KB)</li>
        <li>1600px × 1000px (4,000KB)</li>
        <li>1600px × 1200px (4,000KB)</li>
        <li>4000px × 4000px (4,000KB)</li>
      </ui>
    </p>

    <p class="mt-4 font-weight-bold black--text">
      もし1枚しかダウンロードされないときは、ブラウザの設定で「複数ファイルのダウンロード」を許可してください。
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
// ファイルにした時の大きさを計算する
// https://qiita.com/lt900ed/items/d230b89be5106d949cea
function base64ToFile(data) {
  try {
    let separetedDate = data.split(',');
    let mimeTypeData = separetedDate[0].match(/:(.*?);/);
    let mimeType = Array.isArray(mimeTypeData) ? mimeTypeData[0] : '';
    let decodedData = atob(separetedDate[1]);
    let dataLength = decodedData.length;
    let arrayBuffer = new ArrayBuffer(dataLength);
    let u8arr = new Uint8Array(arrayBuffer);
    for (let i = 0; i < dataLength; i += 1) {
      u8arr[i] = decodedData.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mimeType });
  } catch (errors) {
    console.log(errors);
    return new Blob([]);
  }
}

export default {
  name: 'ResizeImage',

  data() {
    return {
      error_message: '', // エラーメッセージ
      file: null, // アップロードされたFile
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
      this.resizeImgAndDownload(this.file, 160, 256, 100);
      this.resizeImgAndDownload(this.file, 512, 512, 4000);
      this.resizeImgAndDownload(this.file, 600, 600, 400);
      this.resizeImgAndDownload(this.file, 800, 800, 500);
      this.resizeImgAndDownload(this.file, 1024, 1024, 4000);
      this.resizeImgAndDownload(this.file, 1200, 450, 500);
      this.resizeImgAndDownload(this.file, 1280, 2048, 4000);
      this.resizeImgAndDownload(this.file, 1600, 600, 4000);
      this.resizeImgAndDownload(this.file, 1600, 1000, 4000);
      this.resizeImgAndDownload(this.file, 1600, 1200, 4000);
      this.resizeImgAndDownload(this.file, 4000, 4000, 4000);
    },

    // 指定されたサイズに画像をリサイズしてダウンロードする
    // 指定されたファイル容量になるように画質も落とす
    resizeImgAndDownload: function (image_file, width, height, max_kb) {
      // 毎回別のCanvasを作成してやらないと、複数枚一度にダウンロードしたときにあとから設定したサイズの影響が残ってしまい
      // 生成画像の大きさがおかしくなる。
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
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
          //canvasをjpeg変換し、そのBase64文字列をhrefへセット
          //入力canvasのファイルサイズを計測
          // 上限以下になるまで画質品質を0.05ずつ下げて調整
          var facter = 0;
          while (true) {
            const filesize_out = base64ToFile(
              canvas.toDataURL('image/jpeg', 1.0 - 0.05 * facter)
            )['size'];
            if (filesize_out < max_kb * 1000 || 1.0 - 0.05 * facter <= 0.05) {
              break;
            } else {
              facter += 1;
            }
          }
          a.href = canvas.toDataURL('image/jpeg', 1.0 - 0.05 * facter);
          //ダウンロード時のファイル名を指定
          // 「元のファイル名+大きさ」
          // 元のファイル名は拡張子はいらないので削除
          var reg = /(.*)(?:\.([^.]+$))/;
          a.download =
            width +
            '_×' +
            height +
            '_' +
            image_file.name.match(reg)[1] +
            '.jpeg';
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
};
</script>
