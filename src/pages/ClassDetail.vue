<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img :src="getImgUrl(item)" class="videoimg" />
      <div class="summary-tx">
        <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
        <span>{{item.classsummary}}</span>
        <div class="price">
          <span
            style="align-self: center;margin-left:10px;font-size:24px;color: orange;"
          >￥ {{item.classprice}}元</span>
          <div style="display:flex;align-self: center;margin-right:10px;">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
        <q-btn unelevated label="购买学习" class="study" @click="buyCourse" />
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
            >
              <div>{{item.summary}}</div>
              <div style="display:flex;margin-top: 10px;">
                <img src="statics/play.png" style="width:40px;height:40px;" />
                <q-btn unelevated label="学习该章节" class="study-chapter" @click="chapterPlay(item)" />
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
      isPayed: false //是否已购买
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
    // console.log(111,this.$route.query.out_trade_no)
    if (typeof this.$route.query.out_trade_no !== "undefined") {
      //支付完成跳转过来
      this.queryPayResult(this.$route.query.out_trade_no);
    } else {

      this.item = this.$route.query.arg;
      this.getVideos();
    }
  },
  methods: {
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
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.item = response.data.data.course;
            this.videos = response.data.data.videos;
            this.isPayed = true;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    buyCourse() {

      // this.$q.dialog({
      //         message:'请在打开页面完成支付',
      //         // title:'温馨提示',
      //         ok:'已完成支付',
      //         cancel:'支付遇到问题',
      //         persistent:true
      //       }).onOk(()=>{

      //       }).onCancel(()=>{
              
      //       })
      if (typeof this.user.uuid === "undefined") {
        toast(this.$t("login2buy"));
        this.loginDialog.show = true;
        return;
      }
      let params = {
        user_id: this.user.uuid,
        subject_title: "分布式应用部署",
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
            console.log(response.data.data)
            openURL(response.data.data);
          }
        });
    },
    chapterPlay(item) {
      //console.log(item)
      this.video.id = item.video_id;
      this.video.show = true;
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.videos = response.data.data;
          }
        });
    },
    getImgUrl(item) {
      if (typeof item.converimg === 'undefined') {
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
.videoimg {
  width: 530px;
  height: 320px;
  align-self: center;
  margin: 0px 20px;
  flex-shrink: 0;
}
.summary-tx {
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
}
.price {
  width: 100%;
  height: 55px;
  display: flex;
  background-color: #f3f3f3;
  margin-top: 10px;
  justify-content: space-between;
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
</style>
