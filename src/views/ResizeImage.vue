<template>
  <div class="overflow-x-auto">
    <!--overflow-x-autoを指定しないと縦スクロールバーがQrItemのコンテンツにかぶってしまった。-->

    <div class="text-h6 mb-10 font-weight-bold indigo--text">
      アップロードした画像をリサイズします。画像拡張子はpngのみ対応しています。
    </div>


    <p v-if="this.error_message" class="mt-4 font-weight-bold indigo--text">
      変換後サイズ : 
    </p>

    <label>
      <input type="file" @change="onUpload" />
    </label>

    <!--エラーメッセージがあったら表示-->
    <p v-if="this.error_message" class="mt-4 font-weight-bold red--text">
      {{ error_message }}
    </p>

    <canvas ref="canvas"></canvas>

    <!--エラーメッセージがなく、csvがアップロードされていたら表示-->
    <!--<p v-if="!this.error_message && this.workers.length > 0" class="mt-4">
      <span class="red--text font-weight-black"> 赤字 </span>
      <span class="font-weight-black">
        になっているのが、QRコードの内容です。
      </span>
    </p>
-->
    <!--文字コードの設定-->
     <!--<p class="mt-4 mb-4">
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
-->
    <!--QRにするのが各行の何列目か-->
    <!-- <p class="mt-4 mb-4">
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
-->
    <!--CSVファイルの全列数より大きな数字を指定した場合の挙動の説明。文字は小さくして、少し奥から始める。-->
   <!--  <p class="text-body2 ml-3">
      ※アップロードしたCSVの列数より大きい数を指定した場合、最後の列がQRコード画像になります。
    </p>
-->
    <!--最初の行もQR化するか-->
    <!-- <p class="mt-4 mb-4">
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
-->
    <!--QR一覧-->
  <!--  <ul>
      <div v-for="(item, index) in workers" :key="item" class="item">
        <qr-item
          class="mt-15 mb-15"
          :data="item"
          :qr_index="qr_index"
          :index="index"
        ></qr-item>
      </div>
    </ul>
    -->
  </div>
</template>

<script>
import QrItem from '../components/QrItem.vue';

const CHARACTER_CODE_SHIFT_JIS = 'Shift_JIS';
const CHARACTER_CODE_UTF_8 = 'utf-8';

export default {
  name: 'ResizeImage',

  components: {
    QrItem,
  },

  data() {
    return {
      error_message: '', // エラーメッセージ
      workers: [], // アップロードされたcsvの内容。解析結果。
      // character_code: CHARACTER_CODE_SHIFT_JIS, // csvファイルを解析するときの文字コード
      qr_index: 5, // QRにするデータが何列目か(0始まり)
      is_encode_first_row: false, // 最初の行もエンコーディングするか
      file: null, // アップロードされたFile　
      canvas : null,
      context:null,

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
        this.error_message = 'pngファイルを選択してください';
        return;
      }

      this.file = _file;

      makeResizeIamgeFiles();
    },

    // 必要なサイズの画像を作成してダウンロードする
    makeResizeIamgeFiles: function () {
      this.resizeImgAndDownload(this.file,160,160);
    },


    // 指定されたサイズに画像をリサイズしてダウンロードする
    resizeImgAndDownload:function(image_file,width,height) {
      const canvas =  this.canvas;//document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = this.context;
      const imageBitmapPromise =createImageBitmap(image_file)
      imageBitmapPromise// 結果を受け取る
		  .then(

			// ------------------------------------------------------------
			// 成功時に実行されるコールバック関数
			// ------------------------------------------------------------
			function success(image_bitmap){

				// ------------------------------------------------------------
				// ImageBitmap オブジェクトを描画する
				// ------------------------------------------------------------
				ctx.drawImage( image_bitmap , 0 , 0 );

      // var canvas = document.getElementById(canvas_id);
	    //アンカータグを作成
     	var a = document.createElement('a');
	    //canvasをJPEG変換し、そのBase64文字列をhrefへセット
	    a.href = canvas.toDataURL('image/png');
	    //ダウンロード時のファイル名を指定
	    a.download = image_file.name+'_'+width+'_×'+height+'_.jpg';
	    //クリックイベントを発生させる
	    a.click();

			},

			// ------------------------------------------------------------
			// 失敗時に実行されるコールバック関数
			// ------------------------------------------------------------
			function failure(e){
				// 出力テスト
				console.log(e);
			}
		);
      },


  },

  watch: {
    workers: function (newValue, oldValue) {
      this.makeResizeIamgeFiles();
    },
    is_encode_first_row: function () {
      // 先頭行もQRにするか否かを変えた時はデータごと変えてやる
      // 最初は、データは変えずv-ifでUIの方だけ出しわけようとしたが
      // それだとファイルは同じままON/OFFを入れ替えた時に、再描写が追い付かないのか表示がおかしくなった。
      // ので、データごと作り直してやる。
      this.makeResizeIamgeFiles();
    },
  },

  mounted: function (){
    this.canvas = this.$refs.canvas
    this.context = this.canvas.getContext("2d")
  },
};
</script>
