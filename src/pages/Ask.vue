<template>
  <q-page class="mypage">
    <div class="page-content" style="padding:0px;">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="white"
        active-bg-color="white"
        align="left"
        style="background-color:#ebecec;color:black;"
      >
        <q-tab name="all" label="全部问答" />
        <q-tab name="highcoin" label="高悬赏" />
        <q-tab name="creatask" label="我要提问" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="all">
          <div class="flex-col">
            <div class="flex-col">
              <div style="display:flex;">
                <img src="statics/coin.png" style="width:13px;height:12px;margin:5px;" />
                <span style="color: #e7412b;margin-right:20px;line-height: 25px;">200</span>
                <span class="ask-tx">把你当徒弟的已婚男人和把你当暧昧对象的师傅关系有什么区别？</span>
              </div>
              <div style="display:flex;">
                <img src="statics/label.png" style="width:16px;height:16px;" />
                <span style="color:#bbb;margin-left:10px;font-size: 12px;">以太坊 比特币 cosmos</span>
              </div>
              <span style="color: #999;margin-right:20px;line-height: 25px;">大唐荣耀的全部歌曲mp3，哪位给发一个百度云？</span>
              <span style="color:#bbb;">2020-02-02 12:12:12 | 0 回答</span>
            </div>
            <q-separator style="margin:5px 0 5px 0;" />
            <div class="flex-col">
              <div style="display:flex;">
                <img src="statics/coin.png" style="width:13px;height:12px;margin:5px;" />
                <span style="color: #e7412b;margin-right:20px;line-height: 25px;">200</span>
                <span class="ask-tx">把你当徒弟的已婚男人和把你当暧昧对象的师傅关系有什么区别？</span>
              </div>
              <div style="display:flex;">
                <img src="statics/label.png" style="width:16px;height:16px;" />
                <span style="color:#bbb;margin-left:10px;font-size: 12px;">以太坊 比特币 cosmos</span>
              </div>
              <span style="color: #999;margin-right:20px;line-height: 25px;">大唐荣耀的全部歌曲mp3，哪位给发一个百度云？</span>
              <span style="color:#bbb;">2020-02-02 12:12:12 | 0 回答</span>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="highcoin">
          <div>222</div>
        </q-tab-panel>
        <q-tab-panel name="creatask" class="flex-col">
          <q-input
            v-model="classname"
            :dense="true"
            counter
            maxlength="50"
            placeholder="一句话完整描述你的问题"
          />
          <VueEditor
            placeholder="详细说明你的问题，以便获得更好的回答（选填）"
            v-model="askDetail"
            useCustomImageHandler
            @image-added="handleImageAdded"
            style="height: 300px;width:100%;margin:10px 0 50px 0;"
          />
          <span style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);">{{detailLength()}} / 500</span>
          <q-btn outline color="primary" label="提交" style="width:100px;" />
        </q-tab-panel>
      </q-tab-panels>
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
import LoginDialog from "../components/LoginDialog";

export default {
  components: {
    MyFooter,
    VueEditor,
    LoginDialog
  },
  data() {
    return {
      tab: "all",
      askDetail: ""
    };
  },
  methods: {
    detailLength() {
      let text = this.askDetail.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
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

      let filename = new Date().getTime() + ".jpg";
      let formData = new FormData();
      formData.append("key", filename);
      formData.append("policy", policyBase64);
      formData.append("OSSAccessKeyId", this.global.api.aliyunossaccessid);
      formData.append("success_action_status", "200");
      formData.append("signature", signature);
      formData.append("file", file, filename);

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
            Editor.insertEmbed(
              cursorLocation,
              "image",
              this.global.api.aliyunosshostpubread + "/" + filename
            );
            resetUploader();
          }
          // this.$q.loading.hide();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
<style scoped>
.ask-tx {
  color: #3066b3;
  line-height: 25px;
}
.ask-tx:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
  text-decoration: underline;
}
</style>
