<template>
  <q-page class="mypage">
    <div class="white-block">
      <span>课程名称：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" counter maxlength="20" />
      <span>课程封面：</span>
      <input type="file" accept="image/*" style="margin-top:10px;" @change="converFileChange" />
      <img :src="imgsrc" style="margin-top:10px;width:530px;height:320px;" v-show="imgShow" />
      <span style="color:red;">请上传尺寸为530×320像素的jpg图片</span>
      <button
        type="button"
        style="width:72px;margin-top:10px;"
        v-show="imgShow"
        @click="uploadConverImg"
      >开始上传</button>
      <span style="margin-top:30px;">课程简介：</span>
      <q-input
        :dense="true"
        v-model.trim="classsummary"
        type="textarea"
        style="width:100%;height:100px;"
        counter
        maxlength="300"
      />
      <span style="margin-top:30px;">详细介绍：</span>
      <VueEditor
        v-model="classdetail"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 580px;width:100%;margin-bottom:50px;"
      />
      <span style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);">{{detailLength()}} / 2000</span>
      <div class="chapters" v-for="(item,index) in chpters" v-bind:key="index">
        <span>第{{index+1}}节</span>
        <q-input
          v-model.trim="item.title"
          :dense="true"
          style="width:300px;"
          placeholder="章节标题"
          counter
          maxlength="20"
        />
        <q-input
          :dense="true"
          v-model.trim="item.summary"
          type="textarea"
          style="width:100%;height:100px;"
          placeholder="章节简介"
          counter
          maxlength="300"
        />
        <div class="upload">
          <div>
            <input type="file" @change="fileChange($event,index)" />
            <label class="status">
              上传状态:
              <span>{{item.statusText}}</span>
            </label>
          </div>
          <div class="upload-type">
            <button @click="authUpload(index)" :disabled="item.uploadDisabled">开始上传</button>
            <span class="progress">
              上传进度:
              <i id="auth-progress">{{item.authProgress}}</i> %
            </span>
          </div>
        </div>
        <q-btn
          unelevated
          color="red"
          label="删除章节"
          style="width:100px;margin-top:10px;"
          @click="deletechapters(index)"
          v-if="index!==0"
        />
      </div>
      <q-btn
        unelevated
        color="primary"
        label="添加章节"
        style="width:100px;margin-top:10px;"
        @click="addchapters"
      />
      <span style="margin-top:30px;">课程价格：</span>
      <q-input v-model="classprice" :dense="true" style="width:300px;" counter maxlength="10" />
    </div>
    <q-btn
      unelevated
      color="primary"
      label="提交"
      style="width:150px;margin-bottom:30px;"
      @click="submit"
    />
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
      saveTxInterval: "",
      classname: "",
      imgsrc: "",
      imgShow: false,
      converimg: "",
      classsummary: "",
      classdetail: "",
      classprice: "",
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
  mounted() {
    this.showDraft();
    this.saveDraft();
  },
  beforeDestroy() {
    clearInterval(this.saveTxInterval);
  },
  methods: {
    converFileChange(e) {
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
    },
    uploadConverImg() {
      //aliyun oss
      this.$q.loading.show({
        message: this.$t("submiting"),
        spinnerSize: 50
      });

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

      let filename = this.user.uuid + new Date().getTime() + ".jpg";
      let formData = new FormData();
      formData.append("key", filename);
      formData.append("policy", policyBase64);
      formData.append("OSSAccessKeyId", this.global.api.aliyunossaccessid);
      formData.append("success_action_status", "200");
      formData.append("signature", signature);
      formData.append("file", this.imgfile, filename);

      this.$axios
        .post(this.global.api.aliyunosshost, formData, {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;boundary=----WebKitFormBoundarytkUbKWcxgeMi1fIr"
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            toast("上传成功");
            this.converimg = filename;
            // this.imgbmobUrl = filename
            // this.submit2bmob();
            // this.getFile();
          }
          this.$q.loading.hide();
        })
        .catch(error => {
          console.error(error);
          // toast(_this.$t("smscodeerror"));
          this.$q.loading.hide();
        });
    },
    detailLength() {
      let text = this.classdetail.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
    },
    deletechapters(index) {
      this.chpters.splice(index, 1);
    },
    addchapters() {
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
      });
    },
    fileChange(e, index) {
      // debugger
      //console.log(index, this.chpters[index]);
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
      console.log(this.chpters[index].file);
      this.chpters[index].uploader.addFile(
        this.chpters[index].file,
        null,
        null,
        null,
        userData
      );
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
      //console.log(self.chpters[index])
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
            Title: self.classname + "第" + (index + 1) + "节视频",
            FileName: uploadInfo.file.name
          };
          self.createUploadVideo(params, response => {
            let uploadAuth = response.data.data.UploadAuth;
            let uploadAddress = response.data.data.UploadAddress;
            let videoId = response.data.data.VideoId;
            self.chpters[index].video = videoId;
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
          self.chpters[index].statusText = "文件上传成功";
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
    createUploadVideo(params, successCallback) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .get(this.global.api.backurl + "vod/CreateUploadVideo", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(response);
          successCallback(response);
        });
    },
    refreshUploadVideo(params, successCallback, failedCallBack) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .get(this.global.api.backurl + "vod/RefreshUploadVideo", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
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
      var _this = this;
      localforage.getItem("draft").then(value => {
        //console.log("草稿：" + value);
        if (!_this.util.isEmpty(value)) {
          // debugger
          _this.draft = JSON.parse(value);
          //console.log(value)
          _this.$q
            .dialog({
              // title: __this.$t("havenew"),
              message: "你上一次有未发布的课程，编辑时间：" + _this.draft.time,
              ok: "使用草稿",
              cancel: "丢弃"
            })
            .onOk(() => {
              //console.log(_this.draft)
              _this.classname = _this.draft.classname;
              _this.classsummary = _this.draft.classsummary;
              _this.classdetail = _this.draft.classdetail;
              _this.classprice = _this.draft.classprice;
              _this.chpters = _this.draft.chpters;
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

        let chpters2 = [];
        for (let i = 0; i < this.chpters.length; i++) {
          chpters2.push({
            title: this.chpters[i].title,
            summary: this.chpters[i].summary,
            video: null,
            file: null,
            authProgress: 0,
            uploadDisabled: true,
            resumeDisabled: true,
            pauseDisabled: true,
            uploader: null,
            statusText: ""
          });
        }

        this.draft = {
          classname: this.classname,
          classsummary: this.classsummary,
          classdetail: this.classdetail,
          classprice: this.classprice,
          chpters: chpters2,
          time: new Date().toLocaleString()
        };

        if (
          this.classdetail !== "" ||
          this.classname !== "" ||
          this.classsummary !== ""
        ) {
          localforage.setItem("draft", JSON.stringify(this.draft));
          //console.log("saved，" + new Date().toLocaleString(),this.draft);
        }
      }, 1 * 60 * 1000);
    },
    checkInfoOk() {
      // debugger
      if (this.classname === "") {
        toast("请填写课程名称");
        return false;
      }

      if (this.converimg === "") {
        toast("课程封面未上传");
        return false;
      }

      if (this.classsummary === "") {
        toast("请填写课程简介");
        return false;
      }

      if (this.classdetail === "") {
        toast("请填写课程详情");
        return false;
      }

      if (this.classdetail.replace(/<\/?[^>]+(>|$)/g, "").length > 2000) {
        toast("课程详情需小于2000字");
        return false;
      }

      if (this.classprice === "") {
        toast("请填写课程售价");
        return false;
      }

      for (let i = 0; i < this.chpters.length; i++) {
        if (this.chpters[i].title === "") {
          toast("请填写第" + (i + 1) + "节标题");
          return false;
        }

        if (this.chpters[i].summary === "") {
          toast("请填写第" + (i + 1) + "节简介");
          return false;
        }

        if (this.chpters[i].statusText !== "文件上传完毕") {
          toast("第" + (i + 1) + "文件上传完毕");
          return false;
        }
      }

      return true;
    },
    submit() {
      // debugger
      if (this.checkInfoOk()) {
        let params = {
          author: this.user.uuid,
          classname: this.classname,
          converimg: this.converimg,
          classsummary: this.classsummary,
          classdetail: this.classdetail,
          classprice: this.classprice,
          videos: this.chpters
        };
        let timestamp = new Date().getTime() + 1 * 60 * 1000;
        this.$axios
          .post(this.global.api.backurl + "course/createCourse", params, {
            headers: {
              "access-token": this.util.generateToken(
                JSON.stringify(params),
                timestamp
              ),
              timestamp2: timestamp
            }
          })
          .then(response => {
            // console.log(response);
            if (response.status === 200 && response.data.code === 0) {
              this.$q
                .dialog({
                  title: "提交成功",
                  message: "请等待审核，稍后您可以在我发布的课程中查看结果",
                  ok: '确定',
                  persistent: true
                })
                .onOk(()=>{
                  this.$router.push('/MyPub')
                });
            }
          });
      }
    },
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
  margin: 50px 0 30px 0;
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
.upload {
  margin-top: 30px;
}
.upload-type {
  margin-top: 10px;
}
</style>
