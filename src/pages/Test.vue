<template>
  <q-page class="mypage">
    <div class="white-block">
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
          video: null,
          file: null,
          authProgress: 0,
          uploadDisabled: true,
          resumeDisabled: true,
          pauseDisabled: true,
          uploader: null,
          statusText: ""
        }
      ]
    };
  },
  mounted() {
    // for(let i=0;i<10;i++){
this.testapi();
    // }
    
    // this.saveDraft();
  },
  beforeDestroy() {
    clearInterval(this.saveTxInterval);
  },
  methods: {
    deletechapters(index){
      this.chpters.splice(index,1)
    },
    addchapters(){
      this.chpters.push({
          title: "",
          summary: "",
          video: null,
          file: null,
          authProgress: 0,
          uploadDisabled: true,
          resumeDisabled: true,
          pauseDisabled: true,
          uploader: null,
          statusText: ""
        })
    },
    fileChange(e, index) {
      // debugger
      console.log(index, this.chpters[index]);
      this.chpters[index].file = e.target.files[0];
      if (!this.chpters[index].file) {
        alert("请先选择需要上传的文件!");
        return;
      }
      // var Title = this.chpters[index].file.name;
      var userData = '{"Vod":{}}';
      if (this.chpters[index].uploader) {
        this.chpters[index].uploader.stopUpload();
        this.chpters[index].authProgress = 0;
        this.chpters[index].statusText = "";
      }
      this.chpters[index].uploader = this.createUploader(index);
      //console.log(userData);
      this.chpters[index].uploader.addFile( this.chpters[index].file, null, null, null, userData);
      this.chpters[index].uploadDisabled = false;
      this.chpters[index].pauseDisabled = true;
      this.chpters[index].resumeDisabled = true;
    },
    authUpload(index) {
      // 然后调用 startUpload 方法, 开始上传
      if (this.chpters[index].uploader !== null) {
        //console.log(index,'null----------')
        this.chpters[index].uploader.startUpload();
        this.chpters[index].uploadDisabled = true;
        this.chpters[index].pauseDisabled = false;
      }
    },
    // 暂停上传
    pauseUpload() {
      if (this.chpters[index].uploader !== null) {
        this.chpters[index].uploader.stopUpload();
        this.chpters[index].resumeDisabled = false;
        this.chpters[index].pauseDisabled = true;
      }
    },
    // 恢复上传
    resumeUpload() {
      if (this.chpters[index].uploader !== null) {
        this.chpters[index].uploader.startUpload();
        this.chpters[index].resumeDisabled = true;
        this.chpters[index].pauseDisabled = false;
      }
    },
    createUploader(index) {
      
      let self = this;
      console.log(self.chpters[index])
      let uploader = new AliyunUpload.Vod({
        // timeout: self.timeout || 60000,
        partSize: 1048576, //分片大小默认1M，不能小于100K
        parallel: 5, //并行上传分片个数，默认5
        retryCount: 3, //网络原因失败时，重新上传次数，默认为3
        retryDuration: 2, //网络原因失败时，重新上传间隔时间，默认为2秒
        region: "cn-shanghai",
        userId: "1681475359105542",
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          // debugger
          self.chpters[index].uploadDisabled = false;
          self.chpters[index].resumeDisabled = false;
          self.chpters[index].statusText = "添加文件成功, 等待上传...";
          //console.log("addFileSuccess: " + uploadInfo.file.name);
        },
        // 开始上传
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          //doc:https://help.aliyun.com/document_detail/52204.html?spm=a2c4g.11186623.6.1049.6fa16bd1tkvnYT
          let params = {
            Title: self.classname+'第'+(index+1)+'节视频',
            FileName: uploadInfo.file.name
          };
          self.createUploadVideo(params, response => {

            let uploadAuth = response.data.data.UploadAuth;
            let uploadAddress = response.data.data.UploadAddress;
            let videoId = response.data.data.VideoId;
            uploader.setUploadAuthAndAddress(
              uploadInfo,
              uploadAuth,
              uploadAddress,
              videoId
            );
          });

          self.chpters[index].statusText = "文件开始上传...";
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          //console.log("onUploadSucceed: ");

          //记录videoId以便播放用
          self.chpters[index].statusText = "文件上传成功!";
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {

          self.chpters[index].statusText = "文件上传失败!";
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {

          self.chpters[index].statusText = "文件已暂停上传";
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {

          let progressPercent = Math.ceil(progress * 100);
          self.chpters[index].authProgress = progressPercent;
          self.chpters[index].statusText = "文件上传中...";
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          let params = {
            VideoId: uploadInfo.videoId
          };

          self.refreshUploadVideo(params, response => {
            uploader.resumeUploadWithAuth(response.data.data);
            //console.log("upload expired and resume upload with uploadauth ");
          });

          self.chpters[index].statusText = "文件超时...";
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          //console.log("onUploadEnd: uploaded all the files");
          self.chpters[index].statusText = "文件上传完毕";
        }
      });
      return uploader;
    },
    testapi() {
      let timestamp = new Date().getTime();
      let params={
        // Ciphertext:'NWNiOTNlMTAtMDQyZS00MjM5LWJlNDctZTkzODFiZDU4ZTNmcldZSzZkNnYrVGR0SmQ2NjAyVWJraXlRZGgwVnd2R0NBQUFBQUFBQUFBQTVybXRCWG0rZGkzbGRJVXYzaTZFbmVlbC9oeExVaDYyRmJJTWhXZmdEV3RXZTl6RXh2b2JYU0pTUlhUbGVRU3l2cG4rSVkrVCtvQzdnS3RJPQ==',
        TranscodeTaskId:"e319aaa8aadac83b453aa56eb13ae0fe"
        // MtsHlsUriToken:"U2FsdGVkX1+d970ZyjqF27tSJM3rHDleMtfr+zAGSF5eKO2jPxCmYwjq5xuKbrhCqsaWLeqYXufNetb3/5HdsMHZ/iBotG7zIliunndwIh9WTZcBcju9SGT7nBUMpxc/"
      }
      this.$axios
        .get(this.global.apiconfig.otcbackapi + "vod/getTranscodeTask", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          console.log(response);
          // successCallback(response);
        });
    },
    refreshUploadVideo(params, successCallback, failedCallBack) {
      let timestamp = new Date().getTime();
      this.$axios
        .get(this.global.apiconfig.otcbackapi + "vod/RefreshUploadVideo", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          successCallback(response);
          //console.log(response);
        })
        .catch(error => {
          failedCallBack();
          //console.log(error);
        });
    },
    showDraft() {
      localforage.getItem("draft").then(value => {
        //console.log("草稿：" + value);
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
          //console.log("saved，" + new Date().toLocaleString());
        }
      }, 60 * 5000);
    },
    pushClass() {},
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      // //console.log(file)
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
          // //console.log(response);
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
  margin-top: 10px;
  background-color: rgb(241, 216, 127);
  padding: 10px;
}
.upload{
  margin-top: 30px;
}
.upload-type{
  margin-top: 10px;
}
</style>
