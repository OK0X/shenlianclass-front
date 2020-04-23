<template>
  <q-page class="mypage">
    <div class="page-content" v-if="typeof user.uuid === 'undefined'"></div>
    <div class="page-content" v-if="typeof user.uuid !== 'undefined'&&user.role===0">
      <h2>讲师招募</h2>
      <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
      <span style="font-size:15px;">我们希望你：</span>
      <ol style="color:#60686B;">
        <li>&nbsp;热衷分享；</li>
        <li>&nbsp;有3年以上的实际项目开发经验；</li>
        <li>&nbsp;精通任何一种编程语言或互联网相关开发技术；</li>
      </ol>
      <span style="font-size:15px;">你的收获：</span>
      <ol style="color:#60686B;">
        <li>&nbsp;完全属于你的收入；</li>
        <li>&nbsp;技术的沉淀与分享；</li>
      </ol>
      <span v-show="teacherApply!==null">{{teacherApplyStatus}}</span>
      <div class="flex-col" v-show="teacherApply===null">
        <q-input
          v-model="youselfsay"
          filled
          type="textarea"
          placeholder="填写我的简介"
          style="width:50%;"
          counter
          maxlength="500"
        />
        <q-input v-model="yourname" placeholder="我的真实姓名" style="width:25%;" counter maxlength="20" />
        <q-input v-model="yourphone" placeholder="我的电话" style="width:25%;" counter maxlength="11" />
        <q-input v-model="yourwechat" placeholder="我的微信" style="width:25%;" counter maxlength="20" />
        <q-input
          v-model="yourvideo"
          placeholder="我的作品地址"
          style="width:25%;"
          counter
          maxlength="100"
        />
        <q-btn
          unelevated
          color="primary"
          label="立即加入"
          style="width:150px;margin:30px 0 30px 0;"
          @click="teacherRequire"
        />
        <span>若有任何疑问，欢迎添加企业微信联系我们！</span>
        <img src="statics/qiyeweixin.jpg" style="width:90px;height:90px;" />
      </div>
    </div>
    <div class="page-content" v-if="typeof user.uuid !== 'undefined'&&user.role!==0">
      <span class="tx-bold">课程名称：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" counter maxlength="25" />
      <span class="tx-bold" style="margin-top:10px;">课程封面：(请上传尺寸为530×320像素的jpg图片)</span>
      <input type="file" accept="image/*" style="margin-top:10px;" @change="converFileChange" />
      <img :src="imgsrc" style="margin-top:10px;width:530px;height:320px;" v-show="imgShow" />
      <div>
        <button
          type="button"
          style="width:72px;margin-top:10px;"
          @click="uploadConverImg"
          :disabled="coverUploadDisable"
        >开始上传</button>
        <span style="margin-left:10px;">上传进度：{{coverUProgress}}</span>
        <span style="color:green;" v-show="coverUProgress === '100%'">(已保存上传记录,相同图片无需再次上传)</span>
      </div>
      <span style="margin-top:30px;" class="tx-bold">课程简介：</span>
      <q-input
        :dense="true"
        v-model.trim="classsummary"
        type="textarea"
        style="width:100%;height:100px;"
        counter
        maxlength="150"
      />
      <span style="margin-top:30px;" class="tx-bold">课程详情：</span>
      <VueEditor
        v-model="classdetail"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 580px;width:100%;margin-bottom:50px;"
      />
      <span
        style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);"
      >{{textLength(classdetail)}} / 1500</span>
      <span style="margin-top:30px;" class="tx-bold">章节信息：</span>
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
        <span style="color:red; margin-top: 30px;">请上传1920 x 1080分辨率的视频</span>
        <div class="upload">
          <div>
            <input type="file" @change="fileChange($event,index)" />
            <label class="status">
              上传状态:
              <span>{{item.statusText}}</span>
              <span
                style="color:green;"
                v-show="item.statusText === '文件上传完毕'"
              >(已保存该节上传记录,相同视频无需再次上传)</span>
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
        <q-checkbox v-model="item.freesee" label="将该节设置为试看" />
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
      <span style="margin-top:30px;" class="tx-bold">课程资源（描述并上传你的课程资源，如果有的话）：</span>
      <VueEditor
        v-model="corResDiscribe"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 300px;width:100%;margin-bottom:50px;"
      />
      <span
        style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);"
      >{{textLength(corResDiscribe)}} / 500</span>
      <span style="color:red; margin-top: 10px;">文件需小于50M</span>
      <input type="file" accept="*/*" style="margin-top:10px;" @change="courseFileChange" />
      <div>
        <button
          type="button"
          style="width:72px;margin-top:10px;"
          @click="uploadCourseRes"
          :disabled="coResUploadDisable"
        >开始上传</button>
        <span style="margin-left:10px;">上传进度：{{courseResUProgress}}</span>
        <span style="color:green;" v-show="courseResUProgress === '100%'">(已保存该节上传记录,相同资源无需再次上传)</span>
      </div>
      <span style="margin-top:30px;" class="tx-bold">课后作业：</span>
      <VueEditor
        v-model="courseWork"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 300px;width:100%;margin-bottom:50px;"
      />
      <span
        style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);"
      >{{textLength(courseWork)}} / 500</span>
      <span style="margin-top:30px;" class="tx-bold">课程售价：(至少选择一种方式)</span>
      <div style="display:flex;">
        <q-checkbox v-model="usemoney" label="现金" />
        <q-input v-model="classprice" :dense="true" style="width:50px;margin-left:5px;" />
        <span style="align-self: center;">元</span>
        <q-checkbox v-model="usecoin" label="积分" style="margin-left:20px;" />
        <q-input v-model="scoin" :dense="true" style="width:50px;margin-left:5px;" />
        <span style="align-self: center;">个</span>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="提交"
        style="width:150px;margin:30px 0 30px 0;align-self:center;"
        @click="submit"
      />
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
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
      teacherApplyStatus: "",
      teacherApply: null,
      youselfsay: "",
      yourname: "",
      yourphone: "",
      yourwechat: "",
      yourvideo: "",
      courseWork: "",
      coverUProgress: "0%",
      coverUploadDisable: true,
      coResUploadDisable: true,
      courseFile: null,
      courseFileName: "",
      courseResPicked: false,
      courseResUProgress: "0%",
      corResDiscribe: "",
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
          freesee: false,
          file: null,
          authProgress: 0,
          uploadDisabled: true,
          resumeDisabled: true,
          pauseDisabled: true,
          uploader: null,
          statusText: ""
        }
      ],
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      usemoney: true,
      usecoin: false,
      scoin: ""
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
    if (typeof this.user.uuid === "undefined") {
      this.loginDialog.show = true;
    }
    this.showDraft();
    this.saveDraft();
    this.getTeacherApply();
  },
  beforeDestroy() {
    clearInterval(this.saveTxInterval);
  },
  methods: {
    getTeacherApply() {
      if (typeof this.user.uuid !== "undefined" || this.user.role === 0) {
        let timestamp = new Date().getTime() + this.global.requestExpireT;
        let params = {
          user_id: this.user.uuid
        };
        this.$axios
          .get(this.global.api.backurl + "user/getTeacherApply", {
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
            // console.log(333, response);
            if (response.status === 200 && response.data.code === 0) {
              if (response.data.data.length > 0) {
                this.teacherApply = response.data.data[0];
                switch (this.teacherApply.status) {
                  case 0:
                    this.teacherApplyStatus =
                      "你已提交申请，当前正在审核中，请耐心等待！";
                    break;
                  case -1:
                    this.teacherApplyStatus =
                      "非常抱歉，审核未通过！原因：" +
                      this.teacherApply.refuse_reason;
                    break;
                  case -2:
                    this.teacherApplyStatus =
                      "你的账号已违规，暂不可申请为讲师";
                    break;
                  default:
                    break;
                }
              }
            }
          });
      }
    },
    teacherRequire() {
      if (this.youselfsay === "") {
        toast("请输入你的简介");
        return;
      }
      if (this.yourname === "") {
        toast("请输入你的姓名");
        return;
      }
      if (this.yourphone === "") {
        toast("请输入你的电话");
        return;
      }
      if (this.yourwechat === "") {
        toast("请输入你的电话");
        return;
      }
      if (this.yourvideo === "") {
        toast("请输入你的电话");
        return;
      }

      let params = {
        user_id: this.user.uuid,
        selfsay: this.youselfsay,
        realy_name: this.yourname,
        phone: this.yourphone,
        wechat: this.yourwechat,
        videourl: this.yourvideo
      };
      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "user/teacherApply", params, {
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
          this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            toast("提交成功，我们将尽快与你联系");
            params.status = 0;
            this.teacherApply = params;
            this.teacherApplyStatus='你已提交申请，当前正在审核中，请耐心等待！'
          }
        })
        .catch(error => {
          this.util.loadingHide(this);
          console.log(error);
        });
    },
    converFileChange(e) {
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.imgfile = files[0]; //File对象

      this.converimg =
        new Date().getTime() +
        this.imgfile.name.substring(this.imgfile.name.length - 4);
      this.coverUploadDisable = false;
      this.coverUProgress = "0%";

      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(this.imgfile); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      reader.onload = function(e) {
        _this.imgsrc = e.target.result; //图片内容的base64编码
        _this.imgShow = true;
      };
    },
    uploadConverImg() {
      //
      this.coverUploadDisable = true;
      let progress = progressEvent => {
        // 使用本地 progress 事件
        if (progressEvent.lengthComputable) {
          this.coverUProgress =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
        }
      };
      this.util.uploadFile2OSS(
        this,
        this.converimg,
        this.imgfile,
        true,
        progress,
        null
      );
    },
    courseFileChange(e) {
      //上传
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.courseFile = files[0]; //File对象

      this.courseFileName =
        new Date().getTime() +
        this.courseFile.name.substring(this.courseFile.name.length - 4);
      this.coResUploadDisable = false;
      this.courseResUProgress = "0%";
    },
    uploadCourseRes() {
      this.coResUploadDisable = true;
      let progress = progressEvent => {
        // 使用本地 progress 事件
        if (progressEvent.lengthComputable) {
          this.courseResUProgress =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
        }
      };

      this.util.uploadFile2OSS(
        this,
        this.courseFileName,
        this.courseFile,
        false,
        progress,
        null
      );
    },
    textLength(text) {
      text = text.replace(/<\/?[^>]+(>|$)/g, "");
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
        freesee: false,
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
      //console.log(this.chpters[index].file);
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
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
      localforage.getItem("classpubdraft").then(value => {
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
              _this.courseWork = _this.draft.courseWork;
              _this.corResDiscribe = _this.draft.corResDiscribe;
              _this.coverUProgress = _this.draft.coverUProgress;
              _this.converimg = _this.draft.converimg;
              _this.courseResUProgress = _this.draft.courseResUProgress;
              _this.courseFileName = _this.draft.courseFileName;
            })
            .onCancel(() => {
              localforage.removeItem("classpubdraft");
            });
        }
      });
    },
    saveDraft() {
      this.saveTxInterval = setInterval(() => {
        let chpters2 = [];
        for (let i = 0; i < this.chpters.length; i++) {
          if (this.chpters[i].statusText === "文件上传完毕") {
            chpters2.push(this.chpters[i]);
          } else {
            chpters2.push({
              title: this.chpters[i].title,
              summary: this.chpters[i].summary,
              freesee: this.chpters[i].freesee,
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
        }

        this.draft = {
          classname: this.classname,
          classsummary: this.classsummary,
          classdetail: this.classdetail,
          classprice: this.classprice,
          chpters: chpters2,
          time: new Date().toLocaleString(),
          courseWork: this.courseWork,
          corResDiscribe: this.corResDiscribe
        };

        if (this.coverUProgress === "100%") {
          this.draft.coverUProgress = this.coverUProgress;
          this.draft.converimg = this.converimg;
        }

        if (this.courseResUProgress === "100%") {
          this.draft.courseResUProgress = this.courseResUProgress;
          this.draft.courseFileName = this.courseFileName;
        }

        if (
          this.classdetail !== "" ||
          this.classname !== "" ||
          this.classsummary !== ""
        ) {
          localforage.setItem("classpubdraft", JSON.stringify(this.draft));
          //console.log("saved，" + new Date().toLocaleString(),this.draft);
        }
      }, 5 * 1000); //每5秒钟保存一次
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

      if (this.classdetail.replace(/<\/?[^>]+(>|$)/g, "").length > 1500) {
        toast("课程详情需小于1500字");
        return false;
      }

      if (this.courseWork.replace(/<\/?[^>]+(>|$)/g, "").length > 500) {
        toast("资源描述需小于500字");
        return false;
      }

      if (this.courseWork.replace(/<\/?[^>]+(>|$)/g, "").length > 500) {
        toast("作业描述需小于500字");
        return false;
      }

      if (!this.usemoney && !this.usecoin) {
        toast("请至少选择一种销售方式");
        return false;
      }

      if (this.classprice === "" && this.scoin === "") {
        toast("请填写课程销售方式");
        return false;
      }

      if (parseFloat(this.classprice) > 20000) {
        toast("单门课程售价不能超过2万元");
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
      if (typeof this.user.uuid === "undefined") {
        toast("当前未登陆，无法发布课程");
        return;
      }
      // debugger
      if (this.checkInfoOk()) {
        let params = {
          author: this.user.uuid,
          classname: this.classname,
          converimg: this.converimg,
          classsummary: this.classsummary,
          classdetail: this.classdetail,
          videos: this.chpters,
          res_name: this.courseFileName,
          res_discribe: this.corResDiscribe,
          homework: this.courseWork
        };

        if (this.usemoney) {
          params.classprice = this.classprice;
        }

        if (this.usecoin) {
          params.coin = this.scoin;
        }

        let timestamp = new Date().getTime() + this.global.requestExpireT;
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
            //console.log(response);
            if (response.status === 200 && response.data.code === 0) {
              this.$q
                .dialog({
                  title: "提交成功",
                  message: "请等待审核，稍后您可以在我发布的课程中查看结果",
                  ok: "确定",
                  persistent: true
                })
                .onOk(() => {
                  this.$router.push("/MyCreate");
                });
            }
          });
      }
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      let filename =
        new Date().getTime() + file.name.substring(file.name.length - 4);
      this.util.uploadFile2OSS(this, filename, file, true, null, () => {
        Editor.insertEmbed(
          cursorLocation,
          "image",
          this.global.api.aliyunosshostpubread + "/" + filename
        );
        resetUploader();
      });
    }
  }
};
</script>
<style scoped>
.chapters {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  background-color: rgb(241, 216, 127);
  padding: 10px;
}
.upload-type {
  margin-top: 10px;
}
</style>
