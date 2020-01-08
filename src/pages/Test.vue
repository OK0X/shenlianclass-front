<template>
  <q-page class="mypage">
    <div class="white-block">
      <div id="ali-h5-player"></div>
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import { VueEditor } from "vue2-editor";
import localforage from "localforage";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

export default {
  components: {
    MyFooter,
    VueEditor
  },
  data() {
    return {
      classname: "",
      classsummary: "",
      classdetail: "",
      saveTxInterval: "",
      PlayAuth: "",
      MtsHlsUriToken: "",
      vid: "1082165df61f405aac17e9d25e58c1a2",
      player:null
    };
  },
  mounted() {
    // this.getPlayToken();
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
        console.log("The player is created");
      }
    );
    this.getPlayAuth();
    
  },
  methods: {
    getPlayToken() {
      let timestamp = new Date().getTime();
      let params = {
        videoid: "1082165df61f405aac17e9d25e58c1a2"
      };
      this.$axios
        .get(this.global.apiconfig.otcbackapi + "vod/generateToken", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.MtsHlsUriToken = response.data.data;

            this.player.dispose();
            document.getElementById("ali-h5-player").innerHTML = "";
            this.player = new Aliplayer(
              {
                id: "ali-h5-player",
                vid:this.vid,
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
                console.log("The player is created");
              }
            );
          }
        });
    },
    getPlayAuth() {
      let timestamp = new Date().getTime();
      let params = {
        // Ciphertext:'NWNiOTNlMTAtMDQyZS00MjM5LWJlNDctZTkzODFiZDU4ZTNmcldZSzZkNnYrVGR0SmQ2NjAyVWJraXlRZGgwVnd2R0NBQUFBQUFBQUFBQTVybXRCWG0rZGkzbGRJVXYzaTZFbmVlbC9oeExVaDYyRmJJTWhXZmdEV3RXZTl6RXh2b2JYU0pTUlhUbGVRU3l2cG4rSVkrVCtvQzdnS3RJPQ==',
        VideoId: "1082165df61f405aac17e9d25e58c1a2"
        // MtsHlsUriToken:"U2FsdGVkX1+d970ZyjqF27tSJM3rHDleMtfr+zAGSF5eKO2jPxCmYwjq5xuKbrhCqsaWLeqYXufNetb3/5HdsMHZ/iBotG7zIliunndwIh9WTZcBcju9SGT7nBUMpxc/"
      };
      this.$axios
        .get(this.global.apiconfig.otcbackapi + "vod/getVideoPlayAuth", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.PlayAuth = response.data.data.PlayAuth;
            this.getPlayToken();
          }
        });
    }
  }
};
</script>
<style scoped>
.white-block {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 50px 0 50px 0;
  justify-content: flex-start;
  padding: 20px;
}
.chapters {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  background-color: rgb(241, 216, 127);
  padding: 10px;
}
.upload {
  margin-top: 30px;
}
.upload-type {
  margin-top: 10px;
}
</style>
