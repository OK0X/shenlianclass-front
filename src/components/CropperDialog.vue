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
        size:1
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
      
      this.$refs.cropper.getCropBlob(data=>{
        this.uploadImg(data)
      })
    },
    uploadImg(imgfile){
      this.util.loadingShow(this)

      var expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + 600);

      var policyText = {
        expiration: expireTime.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        conditions: [
          ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
        ]
      };

      var policyBase64 = Base64.encode(JSON.stringify(policyText));
      var encrypted = CryptoJS.HmacSHA1(
        policyBase64,
        this.global.api.aliyunossaccesskey
      );
      var signature = CryptoJS.enc.Base64.stringify(encrypted);

      let filename = this.user.uuid+ ".jpg";
      let formData = new FormData();
      formData.append("key", filename);
      formData.append("policy", policyBase64);
      formData.append("OSSAccessKeyId", this.global.api.aliyunossaccessid);
      formData.append("success_action_status", "200");
      formData.append("signature", signature);
      formData.append("file", imgfile, filename);

      this.$axios
        .post(this.global.api.aliyunosshostpubread, formData, {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;boundary=----WebKitFormBoundarytkUbKWcxgeMi1fIr"
          }
        })
        .then(response => {
          //console.log(response);
          if (response.status === 200) {
            toast("上传成功");
            // this.converimg = filename;
            // this.imgbmobUrl = filename
            // this.submit2bmob();
            // this.getFile();
            this.data.show=false
            this.$emit('uploadImgOK')
            // bus.$emit('uploadImgOK')
            
          }
          this.util.loadingHide(this)
        })
        .catch(error => {
          console.error(error);
          // toast(_this.$t("smscodeerror"));
          this.util.loadingHide(this)
        });
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
