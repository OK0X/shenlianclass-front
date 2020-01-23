<template>
  <q-dialog
    v-model="video.show"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
    @show="onShow"
  >
    <q-card class="bg-black text-white">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pt-none">
        <div id="ali-h5-player"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import localforage from "localforage";
export default {
  props: ["video"],
  data() {
    return {
      player: null,
      dialog: false,
      maximizedToggle: true,
      PlayAuth: "",
      MtsHlsUriToken: ""
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
    //console.log("dialog-show");
  },
  methods: {
    onShow() {

      this.player = new Aliplayer(
        {
          id: "ali-h5-player",
          source: "//player.alicdn.com/video/editor.mp4",
          width: "100%",
          height: "500px",
          cover:
            "https://img.alicdn.com/tps/TB1EXIhOFXXXXcIaXXXXXXXXXXX-760-340.jpg",
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
    getPlayToken() {
      let timestamp = new Date().getTime()+1000*60*1;
      let params = {
        videoid: this.video.id
      };
      this.$axios
        .get(this.global.api.backurl + "vod/generateToken", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "timestamp2": timestamp
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
                vid:this.video.id,
                playauth:this.PlayAuth,
                qualitySort:'asc',
                format:'m3u8',
                mediaType:'video',
                width: "100%",
                height: "100%",
                cover:
                  "https://img.alicdn.com/tps/TB1EXIhOFXXXXcIaXXXXXXXXXXX-760-340.jpg",
                /* To set an album art, you must set 'autoplay' and 'preload' to 'false' */
                autoplay: true,
                preload: true,
                isLive: false,
                rePlay:false,
                useH5Prism:true,
                vodRetry:0,
                playConfig:{
                  MtsHlsUriToken:this.MtsHlsUriToken
                }
              },
              function(player) {
                //console.log("The player is created");
              }
            );
          }
        });
    },
    getPlayAuth() {
      let timestamp = new Date().getTime()+1000*60*1;
      let params = {
       VideoId: this.video.id
        };
      this.$axios
        .get(this.global.api.backurl + "vod/getVideoPlayAuth", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "timestamp2": timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.PlayAuth = response.data.data.PlayAuth;
            this.getPlayToken();
          }
        });
    },
    onOk() {
      // debugger
    }
  }
};
</script>
<style scoped>
</style>
