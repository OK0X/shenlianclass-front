<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import { VueCropper } from "vue-cropper";

export default {
  components: {
    MyFooter,
    GoBack,
    VueCropper
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onFileChange(e) {
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let file = files[0]; //File对象
      this.imgfile = file;
      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(file); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。

      reader.onload = function(e) {
        _this.imgsrc = e.target.result; //图片内容的base64编码
        _this.imgShow = true;
      };
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
