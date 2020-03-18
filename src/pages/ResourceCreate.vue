<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <span style="margin-top:20px;">资源类别：</span>
      <div class="q-gutter-sm" >
        <q-radio v-model="resType" val="course" label="课程资源" :disable="corResDisable" />
        <q-radio v-model="resType" val="doc" label="文档资源" />
        <q-radio v-model="resType" val="app" label="应用资源" />
        <q-radio v-model="resType" val="other" label="其它资源" />
      </div>
      <q-select
        :options="courseOptions"
        label="选择课程"
        style="width:150px;"
        v-model="courseOptionsV"
        @input="courseSelected"
        v-show="resType==='course'"
      />
      <q-input
        v-model="fileSize"
        placeholder="资源大小"
        style="width:150px;"
        v-show="resType==='course'"
      />
      <q-input v-model="resName" placeholder="资源名称" counter maxlength="20" />
      <VueEditor
        v-model="resDescribe"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 300px;width:100%;margin:10px 0 50px 0;"
        placeholder="填写资源描述（可选）"
      />
      <span
        style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);"
      >{{textLength(resDescribe)}} / 500</span>
      <span style="color:red; margin-top: 10px;" v-show="resType!=='course'">文件需小于50M</span>
      <input
        type="file"
        accept="*/*"
        style="margin-top:10px;"
        @change="fileChanged"
        v-show="resType!=='course'"
      />
      <div v-show="resType!=='course'">
        <button
          type="button"
          style="width:72px;margin-top:10px;"
          @click="uploadFile"
          :disabled="fileUploadDisable"
        >开始上传</button>
        <span style="margin-left:10px;">上传进度：{{fileUProgress}}</span>
        <span style="color:green;" v-show="fileUProgress === '100%'">(已保存该节上传记录,相同资源无需再次上传)</span>
      </div>
      <q-input v-model="needCoin" placeholder="所需积分" style="width:150px;" />
      <q-btn
        unelevated
        color="primary"
        label="发布资源"
        style="width:150px;margin-top:20px;"
        @click="submit"
      />
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    MyFooter,
    GoBack,
    VueEditor
  },
  data() {
    return {
      resName: "",
      resDescribe: "",
      file: null,
      fileName: "",
      fileUploadDisable: true,
      fileUProgress: "0%",
      fileSize: "",
      courseId: "",
      needCoin: "",
      resType: "course",
      courseRes: [],
      corResDisable: false,
      courseOptions: [],
      courseOptionsV: null,
      courseName:'',
      courseId:''
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
    this.getCourseHasRes();
  },
  methods: {
    courseSelected(value){
      this.resName=value.label
      this.resDescribe=value.res_discribe
      this.fileName=value.res_name
      this.courseName=value.label
      this.courseId=value.uuid
    },
    getCourseHasRes() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        author: this.user.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/getCourseHasRes", {
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
            this.courseRes = response.data.data;
            if (this.courseRes.length === 0) {
              toast("当前没有可以发布的课程资源");
              this.resType = "doc";
              this.corResDisable = true;
            } else {
              for (let i = 0; i < this.courseRes.length; i++) {
                this.courseOptions.push({
                  label: this.courseRes[i].classname,
                  value: this.courseRes[i].classname,
                  res_discribe:this.courseRes[i].res_discribe,
                  res_name:this.courseRes[i].res_name,
                  uuid:this.courseRes[i].uuid
                });
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
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
    },
    textLength(text) {
      text = text.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
    },
    fileChanged(e) {
      //上传
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.file = files[0]; //File对象
      // console.log(888, this.file);

      this.fileSize=(this.file.size/1024/1024).toFixed(2)
      this.fileName =
        new Date().getTime() +
        this.file.name.substring(this.file.name.length - 4);
      this.fileUploadDisable = false;
      this.fileUProgress = "0%";
    },
    uploadFile() {
      this.fileUploadDisable = true;
      let progress = progressEvent => {
        // 使用本地 progress 事件
        if (progressEvent.lengthComputable) {
          this.fileUProgress =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
        }
      };
      this.util.uploadFile2OSS(this,this.fileName, this.file, false, progress, null);
    },
    submit() {

      if(this.resName===''){
        toast('资源名称不能为空')
        return
      }

      if(this.fileName===''){
        toast('文件名不存在')
        return
      }

      if(this.fileSize===''){
        toast('资源大小不能为空')
        return
      }

      if(this.needCoin===''){
        toast('请填写下载所需积分数量')
        return
      }

      let params = {
        user_id:this.user.uuid ,
        type: this.resType,
        name: this.resName,
        filename: this.fileName,
        filesize: this.fileSize,
        coin:this.needCoin,
        discribe: this.resDescribe,
        course_name: this.courseName,
        course_id:this.courseId
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.util.loadingShow(this);
      this.$axios
        .post(this.global.api.backurl + "resourcedown/creatRes", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then((response)=> {
          this.util.loadingHide(this)
          if (response.status === 200 && response.data.code === 0) {
            toast('发布成功，5分钟后生效')
            this.$router.replace('/ResourceDown')
          }
        }).catch(error=>{
          this.util.loadingHide(this)
          console.log(error)
        })
    }
  }
};
</script>
<style scoped>
</style>
