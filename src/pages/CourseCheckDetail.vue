<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img :src="global.api.aliyunosshostpubread + '/' + course.converimg" class="course-cover" onerror="src = 'statics/default-conver.jpg'"/>
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
        <q-btn unelevated :label="util.getCourseStatus(course.status)" class="study" color="primary" />
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
      course: {},
      videos: []
    };
  },
  mounted() {
    if (
      this.$route.query.arg === "[object Object]"
    ) {
      this.course = this.global.routeCache.courseCheckDetail;
    } else {
      this.course = this.$route.query.arg;
      this.global.routeCache.courseCheckDetail = this.course;
    }
    this.getVideos();
  },
  methods: {
    changeCourseStatus(status) {
      let params = {
        status: status+'',
        author: this.course.author
      };
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .put(
          this.global.api.backurl + "course/updateStatus?uuid=" + this.course.uuid,
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
        .then((response) =>{
          //console.log(response);
          if (response.status === 200 && response.data.code === 0){
            
            this.course.status=status
            toast('操作成功'+(status===2?',预计5分钟内生效':''))
          }
        });
    },
    isCanPub() {
      if (this.user.uuid !== this.course.author||this.course.status!==1) {
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
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        videoid: video.video_id,
        course_id:this.course.uuid
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
            video.status=1
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
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  /* background-image: linear-gradient(to right, #ff7a00, #fe560a); */
  /* color: white; */
}
</style>
