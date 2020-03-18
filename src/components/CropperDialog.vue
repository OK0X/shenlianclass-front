<template>
  <q-dialog v-model="data.show">
    <div class="cropper-dialog">
      <h2 style="margin-left:10px;">{{data.title}}</h2>
      <div style="width:560px;height:560px;">
        <vueCropper
          ref="cropper"
          :img="data.img"
          :outputSize="option.size"
          :autoCrop="true"
          autoCropWidth="150px"
          autoCropHeight="150px"
          :fixedBox="true"
          :centerBox="true"
        ></vueCropper>
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="确定" @click="onOk" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import { VueCropper } from "vue-cropper";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
// import { bus } from "../bus.js";

export default {
  props: ["data"],
  components: {
    VueCropper
  },
  data() {
    return {
      option: {
        size: 1
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
  methods: {
    onOk() {
      this.$refs.cropper.getCropBlob(data => {
        this.uploadImg(data);
      });
    },
    uploadImg(imgfile) {

      this.util.uploadFile2OSS(
        this,
        this.user.uuid + ".jpg",
        imgfile,
        true,
        null,
        () => {
          this.data.show = false;
          this.$emit("uploadImgOK");
        }
      );
    }
  }
};
</script>
<style scoped>
.cropper-dialog {
  /* width: 660px; */
  /* height: 660px; */
  background: white;
}
</style>
