<template>
  <q-page class="mypage">
    <GoBack />
    <div class="summary-part">
      <img
        :src="global.api.aliyunosshostpubread + '/' + course.converimg"
        class="course-cover"
        onerror="src = 'statics/default-conver.jpg'"
      />
      <div class="course-summary">
        <span style="font-size:24px;color:#1f2328;">{{course.classname}}</span>
        <span>{{course.classsummary}}</span>
        <div class="price-share">
          <div style="align-self: center;margin-left:10px;font-size:24px;color: orange;">
            <span v-show="course.classprice!==''">{{course.classprice}}元</span>
            <span v-show="course.classprice!==''&&course.coin!==''">+</span>
            <span v-show="course.coin!==''">{{course.coin}}积分</span>
          </div>
          <div style="display:flex;align-self: center;margin-right:10px;">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：{{course.studynum}}人</span>
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
          <div v-html="course.classdetail"></div>
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
              <q-btn unelevated color="primary" label="试看" style="width:100px;margin-top:10px;" v-if="item.freesee"/>
              <q-btn unelevated color="primary" label="开始学习" style="width:100px;margin-top:10px;"/>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <MyFooter />
    <VideoDialog :videoDialog="videoDialog" />
    <LoginDialog :dialogData="loginDialog" />
    <PayWaitDialog :data="payWaitDialog" @finishedPay="finishedPay"/>
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
import localforage from "localforage";
import PayWaitDialog from "../components/PayWaitDialog";

export default {
  components: {
    MyFooter,
    VideoDialog,
    LoginDialog,
    GoBack,
    PayWaitDialog
  },
  data() {
    return {
      tab: "detail",
      course: {},
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
      studyProgress: {},
      payWaitDialog:{
        show:false
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
  mounted() {
    if (typeof this.$route.query.out_trade_no !== "undefined") {
      //支付完成跳转过来
      // console.log(111, this.$route.query);
      this.queryPayResult(this.$route.query.out_trade_no);
    } else {
      this.course = this.$route.query.arg;

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
      //console.log(999,this.videos)
      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid,
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
          //console.log(888,response);
          //console.log(8889,this.videos);
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

            //console.log(555,this.videos)
          }
        })
        .catch(error => {
          //console.log(error);
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
      //console.log(this.course);
      if (typeof this.user.uuid === "undefined") {
        //未登陆
        return;
      }
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid
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
          // console.log(888666,response);
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data.length >= 1) {
              this.isPayed = true;
              this.tab = "chapters";
            }
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    queryPayResult(out_trade_no) {
      this.util.loadingShow(this)
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        out_trade_no: out_trade_no,
        subject_type:1+''
      };
      this.$axios
        .get(this.global.api.backurl + "alipay/getPayResult", {
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
          this.util.loadingHide(this)
          if (response.status === 200 && response.data.code === 0) {
            this.course = response.data.data.course;
            this.setVideos(response.data.data.videos);
            this.isPayed = true;
            this.tab = "chapters";
            toast("购买成功!");
          }else{
            if(response.data.code === 6006){
              toast('请完成支付后点击该操作')
            }
          }
        })
        .catch(error => {
          console.log(error);
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

      if (this.course.classprice !== "" && this.course.coin === "") {
        //只支持现金付款
        this.buyUseAliPay();
      } else if (this.course.classprice === "" && this.course.coin !== "") {
        //只支持积分付款
        this.buyUseCoin();
      } else {
        //现金+积分付款
      }
    },
    buyUseCoin() {
      if (this.user.coin - parseFloat(this.course.coin) < 0) {
        toast("您的SC余额不足，请充值后再进行购买");
        return;
      }

      this.util.loadingShow(this);
      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid,
        coin: this.course.coin
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "course/addPayedCourse", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data === "ok") {
              toast("购买成功");
              this.isPayed = true;
              this.tab = "chapters";
              let userData = JSON.parse(JSON.stringify(this.user));
              userData.coin -= parseInt(this.course.coin);
              this.user = userData;
              localforage.setItem("user", JSON.stringify(this.user));
            }
          }
        });
    },
    finishedPay(){
      this.payWaitDialog.show=false
      this.queryPayResult(this.out_trade_no);
    },
    buyUseAliPay() {
      this.payWaitDialog.show=true

        
      //已生成过支付链接直接打开  
      if (this.out_trade_no !== "" && this.payurl !== "") {
        openURL(this.payurl);
        return;
      }

      this.util.loadingShow(this)
      let params = {
        user_id: this.user.uuid,
        subject_title: this.course.classname,
        subject_id: this.course.uuid,
        subject_type:1+'',//购买课程
        total_amount: this.course.classprice,
        return_url:'https://www.shenlianclass.com/#/ClassDetail'
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "alipay/tradePagePay", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          this.util.loadingHide(this)
          if (response.status === 200 && response.data.code === 0) {
            //console.log(response.data.data);
            const result = response.data.data;
            //支付链接缓存，离开该页面失效
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
        this.videoDialog.course_id = this.course.uuid;
        this.videoDialog.show = true;
      } else {
        this.buyCourse();
      }
    },
    getVideos() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
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
            this.setVideos(response.data.data);
            // if (this.isPayed) {
            this.getStudyProgress();
            // }
          }
        });
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
