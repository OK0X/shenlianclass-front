<template>
  <q-page class="mypage">
    <div class="buywatch">
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
          <div v-html="item.classdetail"></div>
        </q-tab-panel>
        <q-tab-panel name="chapters">
          <q-timeline color="secondary">
            <q-timeline-entry
              :title="item.title"
              subtitle
              v-for="(item,index) in videos"
              :key="index"
              @click="chapterPlay(item)"
              class="chapter-info"
            >
              <div>{{item.summary}}</div>
              <span style="color:#027be3" v-if="item.freesee">试看</span>
              <div style="display:flex;margin-top: 10px;">
                <!-- <img src="statics/play.png" style="width:40px;height:40px;" /> -->
                <!-- <q-btn flat color="primary" label="试看" @click="chapterPlay(item)" v-if="item.freesee"/> -->
                <!-- <q-btn unelevated label="试看" class="study-chapter"  /> -->
                <!-- <q-btn flat color="primary" label="学习该小节" style="align-self:center;"/> -->
              </div>
            </q-timeline-entry>
          </q-timeline>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <VideoDialog :video="video" />
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
import { bus } from "../bus.js";

export default {
  components: {
    MyFooter,
    VideoDialog,
    LoginDialog
  },
  data() {
    return {
      tab: "detail",
      item: {},
      videos: [],
      video: {
        show: false
      },
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      isPayed: false, //是否已购买
      out_trade_no: "",
      payurl: ""
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
        this.tab='chapters'
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
    getStudyProgress(){
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let videoIds=[]
      for(let i=0;i<this.videos.length;i++){
        videoIds.push(this.videos[i].video_id)
      }
      // console.log(999,this.videos)
      let params = {
        user_id: this.user.uuid,
        course_id: this.item.uuid,
        video_id:encodeURIComponent(JSON.stringify(videoIds))
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
          console.log(888,response);
          if (response.status === 200 && response.data.code === 0) {
            
          }
        })
        .catch(error => {
          console.log(error);
        });
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
              this.tab='chapters'
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
            this.videos = response.data.data.videos;
            this.isPayed = true;
            this.tab='chapters'
            toast("购买成功!");
          }
        })
        .catch(error => {
          //console.log(error);
        });
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
    chapterPlay(item) {
      if (this.isPayed || item.freesee) {
        this.video.id = item.video_id;
        this.video.course_id=this.item.uuid
        this.video.show = true;
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
            this.videos = response.data.data;
            if(this.isPayed){
              this.getStudyProgress()
            }
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
.detail {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 50px 0;
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
.chapter-info:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
}
</style>
