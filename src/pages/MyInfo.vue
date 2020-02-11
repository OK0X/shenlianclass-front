<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <div style="display:flex;">
        <img
          :src="user.avatar"
          style="width:80px;height:80px;border-radius: 50%;"
          onerror="src = 'statics/default.png'"
        />
        <div class="flex-col" style="margin-left: 16px;justify-content: space-around;">
          <span>
            <span class="tx-bold">昵称：</span>
            {{user.nick}}
          </span>
          <span>
            <span class="tx-bold">电话：</span>
            {{user.mobile}}
          </span>
          <div style="display:flex;">
            <img src="statics/coin.png" style="width: 13px;height: 12px;align-self:center;" />
            <span style="margin-left:10px;">{{user.coin}} SC</span>
          </div>
        </div>
      </div>
      <input
        accept="image/gif, image/jpeg, image/jpg, image/png"
        type="file"
        @change="onFileChange($event)"
        class="photo-pickup"
        ref="imgpicker"
      />
    </div>
    <CropperDialog :data="cropperDialog" @uploadImgOK="uploadImgOK" />
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import CropperDialog from "../components/CropperDialog";
// import { bus } from "../bus.js";

export default {
  components: {
    MyFooter,
    GoBack,
    CropperDialog
  },
  data() {
    return {
      cropperDialog: {
        title: "剪裁头像",
        show: false
      }
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user.user;
      },
      set(val) {
        this.$store.commit("user/updateUser", val);
      }
    }
  },
  mounted() {},
  methods: {
    uploadImgOK() {
      let data = JSON.parse(JSON.stringify(this.user));
      data.avatar =
        this.global.api.aliyunosshostpubread +
        "/" +
        data.uuid +
        ".jpg?" +
        Math.random();
      this.user = data;

      // console.log(9991, this.user);
    },
    onFileChange(e) {
      // debugger
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let file = files[0]; //File对象

      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(file); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      reader.onload = e => {
        // _this.imgsrc = e.target.result; //图片内容的base64编码
        // _this.imgShow = true;
        // debugger
        // console.log(555)
        this.cropperDialog.img = e.target.result;
        this.cropperDialog.show = true;
        this.$refs.imgpicker.value = null; //重置后可以再次选择同一张图片
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.tx-bold {
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.photo-pickup {
  margin-top: 10px;
  width: 72px;
}
</style>
