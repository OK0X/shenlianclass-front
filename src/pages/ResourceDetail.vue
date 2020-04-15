<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <span class="res-name">{{resDetail.name}}</span>
      <div style="display:flex;">
        <img :src="setFileIcon()" style="margin-left: 20px;width:48px;height:48px;" />
        <div style="margin-left: 20px;">
          <div v-html="resDetail.discribe"></div>
          <div style="margin-top:10px;">
            <span class="mytx-tip">
              所需积分：
              <span style="font-size: 16px;color: orange;">{{resDetail.coin}}</span>
              <span>（已购买课程可免积分下载）</span>
            </span>
            <span class="mytx-tip" style="margin-left: 20px;" v-show="resDetail.course_id!==''">
              所属课程：
              <span
                class="course-tx"
                @click="gotoCourse(resDetail.course_id)"
              >{{resDetail.course_name}}</span>
            </span>
            <span
              class="mytx-tip"
              style="margin-left: 20px;"
            >上传时间：{{util.getShortTime(resDetail.create_at)}}</span>
            <span class="mytx-tip" style="margin-left: 20px;">资源大小：{{resDetail.filesize}} M</span>
          </div>
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="立即下载"
        style="width:150px;margin:20px 0 0 20px;"
        @click="downRes"
      />
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import { openURL } from "quasar";
import localforage from "localforage";
import LoginDialog from "../components/LoginDialog";

export default {
  components: {
    MyFooter,
    GoBack,
    LoginDialog
  },
  data() {
    return {
      resDetail: "",
      coursePayed: false,
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      isResPayed:false
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
    if (typeof this.$route.query.uuid !== "undefined") {
      this.getResById(this.$route.query.uuid);
      return;
    }

    if (this.$route.query.arg === "[object Object]") {
      this.resDetail = this.global.routeCache.ressouceDetail;
    } else {
      this.resDetail = this.$route.query.arg;
      this.global.routeCache.ressouceDetail = this.resDetail;
    }

    this.checkisPayed();
    this.checkResIsPayed()
  },
  methods: {
    getResById(uuid) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        uuid: uuid
      };
      // this.util.loadingShow(this)
      this.$axios
        .get(this.global.api.backurl + "resourcedown/getResById", {
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
          // this.util.loadingHide(this)
          if (response.status === 200 && response.data.code === 0) {
            this.resDetail = response.data.data[0];
            this.checkisPayed();
            this.checkResIsPayed()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setFileIcon() {
      // console.log(111,this.resDetail)
      if (this.resDetail === "") return "";
      let filetype = this.resDetail.filename.substring(
        this.resDetail.filename.length - 3
      );
      return this.util.getFileIcon(filetype);
    },
    checkisPayed() {
      if (
        this.resDetail.course_id === "" ||
        typeof this.user.uuid === "undefined"
      ) {
        //无课程信息或者未登陆则无需查询
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        course_id: this.resDetail.course_id
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
              this.coursePayed = true;
            }
          }
        })

    },
    checkResIsPayed(){
      if (typeof this.user.uuid === "undefined") {
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        resource_id: this.resDetail.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "resourcedown/isPayed", {
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
          // console.log(999,response)
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data.length > 0) {
              this.isResPayed = true;
            }
          }
        })
    },
    gotoCourse(courseid) {
      this.$router.push({
        path: "/CourseDetail",
        query: {
          courseid: courseid
        }
      });
    },
    downRes() {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆再下载");
        this.loginDialog.show = true;
        return;
      }
      if (this.coursePayed) {
        toast("您已购买过该课程，已免积分下载");
      }else if(this.isResPayed){
        //已下载过再次下载无需积分
      }else {
        if (this.user.coin - parseFloat(this.resDetail.coin) < 0) {
          toast("您的积分余额不足，请在个人中心充值后再进行下载");
          return;
        }
        this.updateUserCoin();
      }

      openURL(this.util.makeDownloadUrl(this, this.resDetail.filename));
      this.addDownNum();
    },
    addDownNum() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios.put(
        this.global.api.backurl +
          "resourcedown/addDownNum?uuid=" +
          this.resDetail.uuid,
        null,
        {
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        }
      );
      // .then(response => {
      //   //console.log(response);
      //   // if (response.status === 200 && response.data.code === 0) {

      //   // }
      // });
    },
    updateUserCoin() {
      let newCoin = this.user.coin - parseInt(this.resDetail.coin);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        coin: newCoin,
        coinChange: this.resDetail.coin,
        resource_id:this.resDetail.uuid
      };
      this.$axios
        .put(
          this.global.api.backurl +
            "user/dwonloadResource?uuid=" +
            this.user.uuid,
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
            this.isResPayed = true;
            let userData = JSON.parse(JSON.stringify(this.user));
            userData.coin = newCoin;
            this.user = userData;
            localforage.setItem("user", JSON.stringify(this.user));
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.res-name {
  font-size: 25px;
  color: black;
  font-weight: 700;
  margin: 20px;
}
.course-tx {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
}
</style>
