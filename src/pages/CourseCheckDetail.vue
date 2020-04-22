<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img
        :src="global.api.aliyunosshostpubread + '/' + course.converimg"
        class="course-cover"
        onerror="src = 'statics/default-conver.png'"
      />
      <div class="course-summary">
        <div style="display:flex;">
          <span style="font-size:24px;color:#1f2328;">{{course.classname}}</span>
          <img src="statics/edit.png" class="edit-icon" @click="editCourseName" />
        </div>
        <div style="display:flex;">
          <span>{{course.classsummary}}</span>
          <img src="statics/edit.png" class="edit-icon" @click="editClasssummary" />
        </div>
        <div class="course-price">
          <div style="align-self: center;margin-left:10px;font-size:24px;color: orange;">
            <div style="display:flex;">
              <span v-show="course.classprice!==''">{{course.classprice}}元</span>
              <img src="statics/edit.png" class="edit-icon" @click="editCoursePrice" />
            </div>
            <span v-show="course.classprice!==''&&course.coin!==''">+</span>
            <span v-show="course.coin!==''">{{course.coin}}积分</span>
          </div>
          <div class="course-share" @click="courseShare">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <div style="display:flex;margin-top:10px;">
          <span>学习人数：{{course.studynum}}人</span>
          <img src="statics/edit.png" class="edit-icon" @click="editStudynum" />
        </div>
        <q-btn
          unelevated
          :label="util.getCourseStatus(course.status)"
          class="study"
          :color="course.status===-1?'negative':'primary'"
        />
        <input type="file" accept="image/*" style="margin-top:10px;" @change="converFileChange" />
        <div>
          <button
            type="button"
            style="width:72px;margin-top:10px;"
            @click="uploadConverImg"
            :disabled="converUploadDisable"
          >开始上传</button>
          <span style="margin-left:10px;">上传进度：{{converUProgress}}</span>
          <span style="color:green;" v-show="converUProgress === '100%'">(已保存上传记录,相同图片无需再次上传)</span>
        </div>
      </div>
    </div>
    <div class="detail">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="detail" label="课程介绍" />
        <q-tab name="chapters" label="课程目录" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="detail">
          <div v-html="course.classdetail"></div>
          <img src="statics/edit.png" class="edit-icon" @click="editDetailShow=!editDetailShow" />
          <VueEditor
            v-model="classdetail"
            useCustomImageHandler
            @image-added="handleImageAdded"
            style="height: 580px;width:100%;margin-bottom:50px;"
            v-show="editDetailShow"
          />
          <q-btn
            unelevated
            color="primary"
            label="提交修改"
            style="width:100px;margin:10px;align-self:center;"
            @click="editClassdetail"
            v-show="editDetailShow"
          />
        </q-tab-panel>
        <q-tab-panel name="chapters">
          <q-timeline color="secondary">
            <q-timeline-entry
              :title="item.title"
              subtitle
              v-for="(item,index) in videos"
              :key="index"
            >
              <div>{{item.summary}}</div>
              <div>
                视频状态：
                <span style="color: rgb(255, 122, 0);">{{getVideoStatus(item.status)}}</span>
              </div>
              <q-btn
                unelevated
                color="primary"
                label="转码"
                style="width:100px;margin-top:10px;"
                @click="videoMgr(item)"
                v-show="user.role>=1&&course.status===1&&item.status===0"
              />
            </q-timeline-entry>
          </q-timeline>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div class="detail" style="padding:16px;">
      <span style="font-weight:bold;">首页Banner设置</span>
      <q-separator style="margin:10px 0 10px 0;" />
      <span>Banner展示时间(单位:天 ,取消填: 0)：</span>
      <q-input v-model="bannertime" dense style="width:300px" />
      <span style="margin-top:20px;">副标题：</span>
      <q-input v-model="subtitle" dense style="width:300px" counter maxlength="25" />
      <span style="margin-top:10px;">课程封面：(请上传尺寸为1200×400像素的jpg图片)</span>
      <input type="file" accept="image/*" style="margin-top:10px;" @change="bannerFileChange" />
      <img :src="imgsrc" style="margin-top:10px;width:1168px;height:400px;" v-show="imgShow" />
      <div>
        <button
          type="button"
          style="width:72px;margin-top:10px;"
          @click="uploadBannerImg"
          :disabled="bannerUploadDisable"
        >开始上传</button>
        <span style="margin-left:10px;">上传进度：{{bannerUProgress}}</span>
        <span style="color:green;" v-show="bannerUProgress === '100%'">(已保存上传记录,相同图片无需再次上传)</span>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="提交修改"
        style="width:100px;margin:10px;align-self:center;"
        @click="setBanner"
      />
    </div>
    <q-btn
      unelevated
      color="primary"
      label="审核通过"
      style="width:100px;margin-bottom:30px;"
      @click="changeCourseStatus(1)"
      v-show="user.role>=2&&course.status===0"
    />
    <q-btn
      unelevated
      color="primary"
      label="发布"
      style="width:100px;margin-bottom:30px;"
      @click="changeCourseStatus(2)"
      v-show="isCanPub()"
    />
    <MyFooter />
    <ShareDialog :props="shareDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import ShareDialog from "../components/ShareDialog";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    MyFooter,
    ShareDialog,
    VueEditor
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
  data() {
    return {
      tab: "detail",
      course: {},
      videos: [],
      shareDialog: {
        show: false
      },
      bannertime: "",
      subtitle: "",
      imgsrc: "",
      imgShow: false,
      bannerUProgress: "0%",
      bannerUploadDisable: true,
      bannerImgName: "",
      bannerImgFile: null,
      classdetail: "",
      editDetailShow: false,
      converImgFile:null,
      converImgName:'',
      converUploadDisable:false,
      converUProgress: "0%"
    };
  },
  mounted() {
    if (this.$route.query.arg === "[object Object]") {
      this.course = this.global.routeCache.courseCheckDetail;
    } else {
      this.course = this.$route.query.arg;
      this.global.routeCache.courseCheckDetail = this.course;
    }

    this.bannertime =
      this.course.carousel === 0
        ? "0"
        : parseInt(
            (this.course.carousel - new Date().getTime()) / 1000 / 60 / 60 / 24
          );
    this.subtitle = this.course.subtitle;
    this.imgShow = this.course.carouselimg !== "" ? true : false;
    this.imgsrc =
      this.global.api.aliyunosshostpubread + "/" + this.course.carouselimg;
    this.getVideos();
  },
  methods: {
    editClassdetail() {
      if (this.classdetail === "") {
        toast("请输入内容");
        return;
      }

      if (this.classdetail.length > 2000) {
        toast("内容不能超过2000个字符");
        return;
      }
      let params = {
        classdetail: this.classdetail
      };
      this.modifyCourse(params);
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
    },
    editStudynum() {
      this.modifySimpleTx("修改人数", "studynum");
    },
    editCoursePrice() {
      this.modifySimpleTx("修改课程售价", "coursePrice");
    },
    editClasssummary() {
      this.modifySimpleTx("修改课程摘要", "courseSummary");
    },
    editCourseName() {
      this.modifySimpleTx("修改课程名称", "courseName");
    },
    modifySimpleTx(title, type) {
      this.$q
        .dialog({
          title: title,
          message: "",
          prompt: {
            model: "",
            type: "text" // optional
          },
          ok: "确定",
          cancel: "取消",
          persistent: false
        })
        .onOk(data => {
          if (data === "") {
            toast("输入不能为空");
            return;
          }

          let params = null;

          switch (type) {
            case "courseName":
              if (data.length > 25) {
                toast("输入长度不能超过25个字符");
                return;
              }

              params = {
                classname: data
              };
              break;
            case "courseSummary":
              if (data.length > 150) {
                toast("输入长度不能超过150个字符");
                return;
              }

              params = {
                classsummary: data
              };
              break;
            case "coursePrice":
              if (data.length > 10) {
                toast("输入长度不能超过10个字符");
                return;
              }

              params = {
                classprice: data
              };
              break;
            case "studynum":
              if (data.length > 4) {
                toast("输入长度不能超过4个字符");
                return;
              }

              params = {
                studynum: data
              };
              break;
            default:
              break;
          }

          this.modifyCourse(params);
        })
        .onCancel(() => {
          //console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          //console.log('I am triggered on both OK and Cancel')
        });
    },
    converFileChange(e){
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.converImgFile = files[0]; //File对象

      this.converImgName =
        new Date().getTime() +
        this.converImgFile.name.substring(this.converImgFile.name.length - 4);
      this.converUploadDisable = false;
      this.converUProgress = "0%";   
    },
    uploadConverImg(){
      this.converUploadDisable = true;
      let progress = progressEvent => {
        // 使用本地 progress 事件
        if (progressEvent.lengthComputable) {
          this.converUProgress =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
        }
      };
      let success=()=>{
        let params={
          converimg:this.converImgName
        }
        this.modifyCourse(params)
      }
      this.util.uploadFile2OSS(
        this,
        this.converImgName,
        this.converImgFile,
        true,
        progress,
        success
      );
    },
    bannerFileChange(e) {
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.bannerImgFile = files[0]; //File对象

      this.bannerImgName =
        new Date().getTime() +
        this.bannerImgFile.name.substring(this.bannerImgFile.name.length - 4);
      this.bannerUploadDisable = false;
      this.bannerUProgress = "0%";

      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(this.bannerImgFile); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      reader.onload = function(e) {
        _this.imgsrc = e.target.result; //图片内容的base64编码
        _this.imgShow = true;
      };
    },
    uploadBannerImg() {
      //
      this.bannerUploadDisable = true;
      let progress = progressEvent => {
        // 使用本地 progress 事件
        if (progressEvent.lengthComputable) {
          this.bannerUProgress =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%";
        }
      };
      this.util.uploadFile2OSS(
        this,
        this.bannerImgName,
        this.bannerImgFile,
        true,
        progress,
        null
      );
    },
    setBanner() {
      let params = null;
      if (this.bannertime === "0" || this.bannertime === "") {
        params = {
          carousel: 0,
          subtitle: "",
          carouselimg: ""
        };
      } else {
        params = {
          carousel:
            parseInt(this.bannertime) * 24 * 60 * 60 * 1000 +
            new Date().getTime(),
          subtitle: this.subtitle,
          carouselimg: this.bannerImgName
        };
      }

      this.modifyCourse(params);
    },
    modifyCourse(params) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(
          this.global.api.backurl +
            "course/modifyCourse?course_id=" +
            this.course.uuid,
          params,
          {
            headers: {
              "access-token": this.util.generateToken(
                JSON.stringify(params),
                timestamp
              ),
              timestamp2: timestamp
            }
          }
        )
        .then(response => {
          // console.log(9999, response);
          if (response.status === 200 && response.data.code === 0) {
            toast("修改成功");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    courseShare() {
      this.shareDialog.tx =
        "https://www.shenlianclass.com/#/CourseDetail?courseid=" +
        this.course.uuid;
      this.shareDialog.show = true;
    },
    changeCourseStatus(status) {
      let params = {
        status: status + "",
        author: this.course.author
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(
          this.global.api.backurl +
            "course/updateStatus?uuid=" +
            this.course.uuid,
          params,
          {
            headers: {
              "access-token": this.util.generateToken(
                JSON.stringify(params),
                timestamp
              ),
              timestamp2: timestamp
            }
          }
        )
        .then(response => {
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.course.status = status;
            toast("操作成功" + (status === 2 ? ",预计5分钟内生效" : ""));
          }
        });
    },
    isCanPub() {
      if (this.user.uuid !== this.course.author || this.course.status !== 1) {
        return false;
      } else {
        for (let i = 0; i < this.videos.length; i++) {
          if (this.videos[i].status <= 1) {
            return false;
          }
        }

        return true;
      }
    },
    getTranscodeTask(index) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        TranscodeTaskId: this.videos[index].transcode_task_id
      };
      this.$axios
        .get(this.global.api.backurl + "vod/getTranscodeTask", {
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
          //console.log(222,response);
          if (response.status === 200 && response.data.code === 0) {
            if (
              response.data.data.TranscodeTask.TaskStatus === "CompleteAllSucc"
            )
              this.videos[index].status = 2;
          }
        });
    },
    videoMgr(video) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        videoid: video.video_id,
        course_id: this.course.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "vod/submitTranscodeJob", {
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
          if (response.status === 200 && response.data.code === 0) {
            toast("提交转码成功,10分钟后可查看转码结果");
            video.status = 1;
          }
        });
    },
    getVideoStatus(status) {
      switch (status) {
        case 0:
          return "待转码";
        case 1:
          return "转码中";
        case 2:
          return "转码成功";
        default:
          break;
      }
    },
    getVideos() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        course_id: this.course.uuid + ""
      };
      this.$axios
        .get(this.global.api.backurl + "video/getVideos", {
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
          //console.log(111,response);
          if (response.status === 200 && response.data.code === 0) {
            this.videos = response.data.data;

            //查询转码中的状态
            for (let i = 0; i < this.videos.length; i++) {
              if (this.videos[i].status === 1) {
                this.getTranscodeTask(i);
              } else {
                this.videos[i].transresult = "";
              }
            }
          }
        });
    }
  }
};
</script>
<style scoped>
.detail {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 30px 0;
  /* height: 800px; */
  flex-direction: column;
}
.buywatch {
  width: 100%;
  max-width: 1200px;
  height: 355px;
  display: flex;
  background-color: white;
  margin: 50px 0 30px 0;
}

.study {
  align-self: flex-start;
  margin-top: 10px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  /* background-image: linear-gradient(to right, #ff7a00, #fe560a); */
  /* color: white; */
}
</style>
