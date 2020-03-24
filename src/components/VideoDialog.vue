<template>
  <q-dialog
    v-model="videoDialog.show"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    @show="onShow"
  >
    <q-card class="bg-black text-white">
      <q-card-section style="display:flex;justify-content:space-between;">
        <div style="display:flex;">
          <div  @click="close">
            <img src="statics/back-white.png" style="width: 35px;height: 35px;cursor: pointer;" />
            <q-tooltip content-class="bg-white text-primary">返回</q-tooltip>
          </div>
          <div
            class="text-h6"
            style="margin-left:15px"
          >{{'第'+(playIndex+1)+'节：'+currentVideo.title}}</div>
        </div>
        <div @click="close">
          <img src="statics/close.png" style="width: 35px;height: 35px;cursor: pointer;" />
          <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
        </div>
      </q-card-section>
      <q-card-section style="display:flex;">
        <div id="ali-h5-player" style="flex-shrink:0;"></div>
        <div style="margin:10px;">
          <div v-for="(item,index) in videos" :key="index">
            <q-expansion-item
              switch-toggle-side
              expand-separator
              :label="'第'+(index+1)+'节：'+item.title"
              :style="index===playIndex?'color:#ff9800':'color:white'"
            >
              <q-card>
                <q-card-section style="background:black">{{item.summary}}</q-card-section>
              </q-card>
              <q-btn
                outline
                color="primary"
                label="播放"
                style="margin-left:15px;"
                @click="switchVideo(index)"
                v-show="index!==playIndex"
              />
            </q-expansion-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import localforage from "localforage";
export default {
  props: ["videoDialog"],
  data() {
    return {
      player: null,
      maximizedToggle: true,
      PlayAuth: "",
      MtsHlsUriToken: "",
      videos: [],
      playIndex: 0,
      currentVideo: "",
      width: "1536px",
      height: "864px",
      cover:
        "https://shenlianclasspubread.oss-cn-shanghai.aliyuncs.com/play-cover.jpg"
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
  methods: {
    onShow() {
      //console.log(999, this.videoDialog);
      this.videos = this.videoDialog.videos;
      this.playIndex = this.videoDialog.currentPlay;
      this.currentVideo = this.videos[this.playIndex];
      this.playVID = this.currentVideo.video_id;

      this.player = new Aliplayer(
        {
          id: "ali-h5-player",
          source: "//player.alicdn.com/video/editor.mp4",
          width: this.width,
          height: this.height,
          cover: this.cover,
          /* To set an album art, you must set 'autoplay' and 'preload' to 'false' */
          autoplay: false,
          preload: false,
          isLive: false
        },
        function(player) {
          //console.log("The player is created");
        }
      );

      this.getPlayAuth();
    },
    getPlayAuth() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        VideoId: this.playVID
      };
      this.$axios
        .get(this.global.api.backurl + "vod/getVideoPlayAuth", {
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
          if (response.status === 200 && response.data.code === 0) {
            this.PlayAuth = response.data.data.PlayAuth;
            this.getPlayToken();
          }
        });
    },
    getPlayToken() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        videoid: this.playVID
      };
      this.$axios
        .get(this.global.api.backurl + "vod/generateToken", {
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
            this.MtsHlsUriToken = response.data.data;

            this.player.dispose();
            document.getElementById("ali-h5-player").innerHTML = "";
            this.player = new Aliplayer(
              {
                id: "ali-h5-player",
                vid: this.playVID,
                playauth: this.PlayAuth,
                qualitySort: "asc",
                format: "m3u8",
                mediaType: "video",
                width: this.width,
                height: this.height,
                cover: this.cover,
                /* To set an album art, you must set 'autoplay' and 'preload' to 'false' */
                autoplay: true,
                preload: true,
                isLive: false,
                rePlay: false,
                useH5Prism: true,
                vodRetry: 0,
                playConfig: {
                  MtsHlsUriToken: this.MtsHlsUriToken
                }
              },
              player => {
                player.on("ended", () => {
                  //自动播放下一节
                  this.updateProgress();

                  if (!this.videoDialog.course_payed) {
                    toast("请购买后观看");
                    this.videoDialog.show = false;
                    return;
                  }

                  this.playIndex++;
                  this.currentVideo = this.videos[this.playIndex];
                  this.playVID = this.currentVideo.video_id;
                  this.getPlayAuth();
                });
                player.fullscreenService.requestFullScreen();
                localforage.getItem(this.playVID).then(value => {
                  let seek = 0;
                  if (value !== null) {
                    seek = value;
                  } else {
                    if (typeof this.videoDialog.studyProgress !== "undefined") {
                      let playProgress = this.videoDialog.studyProgress[
                        this.playVID
                      ];
                      if (typeof playProgress !== "undefined")
                        seek = playProgress;
                    }
                  }

                  seek = parseInt(seek) - 5; //这里回放5s,以便用户能更好地连贯起来。
                  player.seek(seek > 0 ? seek : 0);
                });
              }
            );
          }
        });
    },
    switchVideo(index) {
      if (this.playIndex === index) return;
      this.updateProgress();

      if (!this.videoDialog.course_payed) {
        toast("请购买后观看");
        this.videoDialog.show = false;
        return;
      }

      this.playIndex = index;
      this.currentVideo = this.videos[this.playIndex];
      this.playVID = this.currentVideo.video_id;
      this.getPlayAuth();
    },
    close() {
      this.videoDialog.show = false;
      this.updateProgress();
      localforage.setItem(this.playVID, this.player.getCurrentTime());
      this.player.dispose();
    },
    updateProgress() {
      let params = {
        user_id: this.user.uuid,
        course_id: this.videoDialog.course_id,
        video_id: this.playVID,
        progress: parseInt(this.player.getCurrentTime()) + "",
        total: parseInt(this.player.getDuration()) + ""
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(this.global.api.backurl + "studyProgress/updateProgress", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(function(response) {
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            //console.log('更新成功')
          }
        });
    }
  }
};
</script>
<style scoped>
/* .prism-controlbar-bg {
    background: rgba(75, 75, 75, 0.856);
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1
} */
</style>
