<template>
  <q-page class="mypage">
    <GoBack />
    <div class="summary-part">
      <img :src="getImgUrl(item)" class="course-cover" />
      <div class="course-summary">
        <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
        <span>{{item.classsummary}}</span>
        <div class="price-share">
          <span
            style="align-self: center;margin-left:10px;font-size:24px;color: orange;"
          >￥ {{item.classprice}}元</span>
          <div style="display:flex;align-self: center;margin-right:10px;">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
        <q-btn unelevated label="立即购买" class="study" @click="buyCourse" v-show="!isPayed" />
      </div>
    </div>
    <div class="detail-part">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="white"
        active-bg-color="white"
        align="left"
        style="background-color:#ebecec;color:black;"
      >
        <q-tab name="detail" label="课程介绍" />
        <q-tab name="chapters" label="课程目录" />
      </q-tabs>
      <!-- <q-separator /> -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="detail">
          <div v-html="item.classdetail"></div>
        </q-tab-panel>
        <q-tab-panel name="chapters">
          <div
            subtitle
            v-for="(item,index) in videos"
            :key="index"
            @click="chapterPlay(index,item)"
            class="chapter-info"
          >
            <div class="chapter-progress">
              <img
                :src="item.finished?'statics/finished.png':'statics/ing.png'"
                style="width:25px;height:25px;"
              />
              <div
                class="chapter-progress-line"
                :style="item.finished?'background:#ff9800':'background:#26A69A'"
                v-if="index!==videos.length-1"
              ></div>
            </div>
            <div class="chapter-summary">
              <h1 style="margin:0 0 10px 0;">{{'第'+(index+1)+'节：'+item.title}}</h1>
              <div>{{item.summary}}</div>
              <span style="color:#027be3" v-if="item.freesee">试看</span>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <VideoDialog :videoDialog="videoDialog" />
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import VideoDialog from "../components/VideoDialog";
import { openURL } from "quasar";
import LoginDialog from "../components/LoginDialog";
import GoBack from "../components/GoBack";
import { bus } from "../bus.js";

export default {
  components: {
    MyFooter,
    VideoDialog,
    LoginDialog,
    GoBack
  },
  data() {
    return {
      tab: "detail",
      item: {},
      videos: [],
      videoDialog: {
        show: false
      },
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      isPayed: false, //是否已购买
      out_trade_no: "",
      payurl: "",
      studyProgress: {}
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
    if (typeof this.$route.query.out_trade_no !== "undefined") {
      //支付完成跳转过来
      this.queryPayResult(this.$route.query.out_trade_no);
    } else {
      this.item = this.$route.query.arg;

      if (this.$route.query.from === "myclass") {
        this.isPayed = true;
        this.tab = "chapters";
      } else {
        this.checkisPayed();
      }

      this.getVideos();
    }

    bus.$on("loginok", () => {
      this.checkisPayed();
    });
  },
  methods: {
    getStudyProgress() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let videoIds = [];
      for (let i = 0; i < this.videos.length; i++) {
        videoIds.push(this.videos[i].video_id);
      }
      // console.log(999,this.videos)
      let params = {
        user_id: this.user.uuid,
        course_id: this.item.uuid,
        video_id: encodeURIComponent(JSON.stringify(videoIds))
      };
      this.$axios
        .get(this.global.api.backurl + "studyProgress/getProgress", {
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
          // console.log(888,response);
          // console.log(8889,this.videos);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            if (data.length === 0) return;
            for (let i = 0; i < data.length; i++) {
              this.studyProgress[data[i].video_id] = {
                progress: data[i].progress,
                total: data[i].total
              };
            }

            this.setProgress();

            // console.log(555,this.videos)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setProgress() {
      for (let i = 0; i < this.videos.length; i++) {
        let studyProgress = this.studyProgress[this.videos[i].video_id];
        if (studyProgress.total - studyProgress.progress <= 5) {
          this.videos[i].finished = true;
        }
      }
    },
    checkisPayed() {
      // console.log(this.item);
      if (typeof this.user.uuid === "undefined") {
        //未登陆
        return;
      }
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        user_id: this.user.uuid,
        subject_id: this.item.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/isPayed", {
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
          // console.log(888,response);
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data.length >= 1) {
              this.isPayed = true;
              this.tab = "chapters";
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    queryPayResult(out_trade_no) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        out_trade_no: out_trade_no
      };
      this.$axios
        .get(this.global.api.backurl + "alipay/getResult", {
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
          // console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.item = response.data.data.course;
            this.setVideos(response.data.data.videos);
            this.isPayed = true;
            this.tab = "chapters";
            toast("购买成功!");
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    setVideos(videos) {
      for (let i = 0; i < videos.length; i++) {
        videos[i].finished = false;
      }
      this.videos = videos;
    },
    buyCourse() {
      if (typeof this.user.uuid === "undefined") {
        this.out_trade_no = "";
        this.payurl = "";
        toast(this.$t("login2buy"));
        this.loginDialog.show = true;
        return;
      }

      this.$q
        .dialog({
          message: "请在打开页面完成支付",
          // title:'温馨提示',
          ok: "已完成支付",
          cancel: "支付遇到问题",
          persistent: true
        })
        .onOk(() => {
          this.queryPayResult(this.out_trade_no);
        })
        .onCancel(() => {
          //
        });

      if (this.out_trade_no !== "" && this.payurl !== "") {
        openURL(this.payurl);
        return;
      }

      let params = {
        user_id: this.user.uuid,
        subject_title: this.item.classname,
        subject_id: this.item.uuid,
        total_amount: this.item.classprice
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "alipay/tradepagepay", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.code === 0) {
            // console.log(response.data.data);
            const result = response.data.data;
            this.out_trade_no = result.out_trade_no;
            this.payurl = result.payurl;
            openURL(result.payurl);
          }
        });
    },
    chapterPlay(index, item) {
      if (this.isPayed || item.freesee) {
        this.videoDialog.currentPlay = index;
        this.videoDialog.videos = this.videos;
        // if (typeof this.studyProgress[item.video_id] !== "undefined") {
        this.videoDialog.studyProgress = this.studyProgress;
        // }
        this.videoDialog.course_id = this.item.uuid;
        this.videoDialog.show = true;
      } else {
        this.buyCourse();
      }
    },
    getVideos() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        course_id: this.item.uuid + ""
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
          // console.log(111,response);
          if (response.status === 200 && response.data.code === 0) {
            this.setVideos(response.data.data);
            // if (this.isPayed) {
            this.getStudyProgress();
            // }
          }
        });
    },
    getImgUrl(item) {
      if (typeof item.converimg === "undefined") {
        return "statics/test-conver.jpg";
      }
      return this.util.makeImgUrl(this, item.converimg);
    }
  }
};
</script>
<style scoped>
.detail-part {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 50px 0;
  /* height: 800px; */
  flex-direction: column;
}
.summary-part {
  width: 100%;
  max-width: 1200px;
  height: 355px;
  display: flex;
  background-color: white;
  margin: 5px 0 30px 0;
}

.study {
  align-self: flex-start;
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  background-image: linear-gradient(to right, #ff7a00, #fe560a);
  color: white;
}
.study-chapter {
  align-self: center;
  margin-left: 10px;
  background-image: linear-gradient(to right, #ff7a00, #fe560a);
  color: white;
}
.chapter-info {
  display: flex;
  margin-top: 5px;
}
.chapter-info:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
}
.chapter-progress {
  display: flex;
  flex-direction: column;
}
.chapter-summary {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
}
.chapter-progress-line {
  width: 1px;
  flex: 1;
  background: #ff9800;
  align-self: center;
  margin: 5px 0 5px 0;
}
</style>
