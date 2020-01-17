<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img :src="getImgUrl(item.converimg)" class="videoimg" />
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
        <q-btn unelevated :label="item.status===0?'审核中':'已发布'" class="study" color="primary" />
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
              title="Event Title"
              subtitle="February 22, 1986"
              color="orange"
              icon="done_all"
            >
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
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
                @click="videoMgr(item.video_id)"
                v-show="user.role>=2&&item.status===0"
              />
            </q-timeline-entry>
          </q-timeline>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-btn
      unelevated
      color="primary"
      label="发布"
      style="width:100px;margin-bottom:30px;"
      @click="pubMyCourse"
      v-show="isCanPub()"
    />
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
export default {
  components: {
    MyFooter
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
      item: this.$route.query.arg,
      videos: []
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.getVideos();
  },
  methods: {
    pubMyCourse() {
      let params = {
        status: 1
      };
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .put(
          this.global.api.backurl + "course/updateStatusById?id=" + this.item.id,
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
        .then(function(response) {
          console.log(response);
          if (response.status === 200 && response.data.code === 0){
            toast('发布成功')
          }
        });
    },
    isCanPub() {
      if (this.user.role <= 0) {
        return false;
      } else {
        if(this.item.status===1){
          return false
        }
        for (let i = 0; i < this.videos.length; i++) {
          if (this.videos[i].status <= 1) {
            return false;
          }
        }

        return true;
      }
    },
    getTranscodeTask(index) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
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
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            if (
              response.data.data.TranscodeTask.TaskStatus === "CompleteAllSucc"
            )
              this.videos[index].status = 2;
          }
        });
    },
    videoMgr(videoID) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        videoid: videoID
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
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("提交转码成功");
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
    getImgUrl(filename) {
      return this.util.makeImgUrl(this, filename);
    },
    getVideos() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        course_id: this.$route.query.arg.id + ""
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
          console.log(response);
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
  /* background-image: linear-gradient(to right, #ff7a00, #fe560a); */
  /* color: white; */
}
</style>
