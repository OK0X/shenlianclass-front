<template>
  <q-page class="mypage">
    <div class="white-block">
      <span>课程名称：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" />
      <span style="margin-top:30px;">课程简介：</span>
      <q-input
        :dense="true"
        v-model.trim="classsummary"
        type="textarea"
        style="width:100%;height:100px;"
      />
      <span style="margin-top:30px;">详细介绍：</span>
      <VueEditor
        v-model="classdetail"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 580px;width:100%;"
      />
      <div class="chapters">
        <q-input v-model="classname" :dense="true" style="width:300px;" placeholder="章节标题" />
        <q-input
          :dense="true"
          v-model.trim="classsummary"
          type="textarea"
          style="width:100%;height:100px;"
          placeholder="章节简介"
        />
        <q-uploader
          color="primary"
          flat
          bordered
          label="上传课程视频"
          :factory="factoryFn"
          style="margin-top:30px;"
          :max-file-size="1024*1000*500"
        />
      </div>
      <span style="margin-top:30px;">课程价格：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" />
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import { VueEditor } from "vue2-editor";
import localforage from "localforage";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

export default {
  components: {
    MyFooter,
    VueEditor
  },
  data() {
    return {
      classname: "",
      classsummary: "",
      classdetail: "",
      saveTxInterval: "",
      chpters: [
        {
          title: "",
          summary: "",
          video: null
        }
      ]
    };
  },
  mounted() {
    this.showDraft();
    this.saveDraft();
  },
  beforeDestroy() {
    clearInterval(this.saveTxInterval);
  },
  methods: {
    factoryFn(file) {

      console.log(file)
      //aliyun oss
      var expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + 600);

      var policyText = {
        expiration: expireTime.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        conditions: [
          ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
        ]
      };

      var policyBase64 = Base64.encode(JSON.stringify(policyText));
      var encrypted = CryptoJS.HmacSHA1(policyBase64, this.global.apiconfig.aliyunossaccesskey);
      var signature = CryptoJS.enc.Base64.stringify(encrypted);
      let formData = new FormData();

      return new Promise((resolve, reject) => {
        // Retrieve JWT token from your store.
        // const token = "myToken";
        resolve({
          url: this.global.apiconfig.aliyunosshost,
          method: 'POST',
          // headers: [
          //   { name: 'X-Bmob-Application-Id', value: 'ac7f17d258941e666eb88514048c351a'},
          //   { name: 'X-Bmob-REST-API-Key', value: `f31e47e1bcf4d276e1bc19226abee442` },
          //   { name: 'Content-Type', value: `video/mpeg4` }
          // ],
          formFields:[
            {name:'key',value:'testvideo111'},
            {name:'policy',value:policyBase64},
            {name:'OSSAccessKeyId',value:this.global.apiconfig.aliyunossaccessid},
            {name:'success_action_status',value:"200"},
            {name:'signature',value:signature},
            {name:'file',value:file}
          ]
        })
      })
    },
    showDraft() {
      localforage.getItem("draft").then(value => {
        console.log("草稿：" + value);
        if (!this.util.isEmpty(value)) {
          this.draft = JSON.parse(value);
          this.$q
            .dialog({
              // title: _this.$t("havenew"),
              message: "你上一次有未发布的课程，编辑时间：" + this.draft.time,
              ok: "使用草稿",
              cancel: "丢弃"
            })
            .onOk(() => {
              this.classname = this.draft.classname;
              this.classsummary = this.draft.classsummary;
              this.classdetail = this.draft.classdetail;
            })
            .onCancel(() => {
              localforage.removeItem("draft");
            });
        }
      });
    },
    saveDraft() {
      this.saveTxInterval = setInterval(() => {
        //每分钟保存一次
        // debugger
        this.draft = {
          classname: this.classname,
          classsummary: this.classsummary,
          classdetail: this.classdetail,
          time: new Date().toLocaleString()
        };

        if (
          this.classdetail !== "" ||
          this.classname !== "" ||
          this.classsummary !== ""
        ) {
          localforage.setItem("draft", JSON.stringify(this.draft));
          console.log("saved，" + new Date().toLocaleString());
        }
      }, 60 * 5000);
    },
    pushClass() {},
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      // console.log(file)
      // return

      this.$axios
        .request({
          url:
            "https://api2.bmob.cn/2/files/" +
            // this.global.wallet.ethAddress +
            "test.jpg",
          method: "post",
          headers: {
            "X-Bmob-Application-Id": "ac7f17d258941e666eb88514048c351a",
            "X-Bmob-REST-API-Key": "f31e47e1bcf4d276e1bc19226abee442",
            "Content-Type": "image/jpeg"
          },
          data: file
        })
        .then(response => {
          // console.log(response);
          if (response.status === 200) {
            let url = response.data.url;
            Editor.insertEmbed(cursorLocation, "image", url);
            resetUploader();
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
<style scoped>
.white-block {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 50px 0 50px 0;
  justify-content: flex-start;
  padding: 20px;
}
.chapters {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
}
</style>
