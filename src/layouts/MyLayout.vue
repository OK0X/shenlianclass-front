<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="myheader">
      <div class="header-top">
        <img
          src="statics/test-logo.png"
          style="width:131px;height:51px;align-self: center;margin-left:20px;"
        />
        <q-input
          bottom-slots
          v-model="searchText"
          :dense="true"
          class="search-bar"
          @input="getSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
          <q-menu fit no-focus>
            <div style="padding:16px;color:gray" v-show="searchText.length===0">你还未输入内容哦!</div>
            <div
              style="padding:16px;color:gray"
              v-show="searchText.length>0&&searchText.length<3"
            >输入内容太少哦!</div>
            <q-list style="min-width: 100px" v-show="searchText.length>=3">
              <q-linear-progress indeterminate style="height:2px;" v-show="searchProgressShow" />
              <div style="padding:8px 16px;" class="flex-col">
                <span style="color:gray">课程</span>
                <span style="color:gray;padding-left:16px;" v-show="courseSearch.length===0">未找到相关课程</span>
                <q-item
                  clickable
                  style="min-height:0;padding: 4px 16px;"
                  v-for="(item,index) in courseSearch"
                  :key="index"
                  @click="searchGoto(1,item)"
                >
                  <q-item-section>{{item.tx}}</q-item-section>
                </q-item>
              </div>
              <q-separator />
              <div style="padding:8px 16px;" class="flex-col">
                <span style="color:gray">帖子</span>
                <span style="color:gray;padding-left:16px;" v-show="askSearch.length===0">未找到相关帖子</span>
                <q-item
                  clickable
                  style="min-height:0;padding: 4px 16px;"
                  v-for="(item,index) in askSearch"
                  :key="index"
                  @click="searchGoto(2,item)"
                >
                  <q-item-section>{{item.tx}}</q-item-section>
                </q-item>
              </div>
              <q-separator />
              <div style="padding:8px 16px;" class="flex-col">
                <span style="color:gray">资源</span>
                <span style="color:gray;padding-left:16px;" v-show="resSearch.length===0">未找到相关资源</span>
                <q-item
                  clickable
                  style="min-height:0;padding: 4px 16px;"
                  v-for="(item,index) in resSearch"
                  :key="index"
                  @click="searchGoto(3,item)"
                >
                  <q-item-section>{{item.tx}}</q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-input>
        <!-- <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;align-self: center;" /> -->
        <div style="align-self: center;margin-left:30px;">
          <div style="display:flex;">
            <img
              :src="user.avatar"
              style="width:40px;height:40px;border-radius: 50%;cursor: pointer;"
              onerror="src = 'statics/default-avatar.gif'"
            />
            <span
              style="align-self: center;margin-left:10px;cursor: pointer;"
            >{{user.nick==null?'游客':user.nick}}</span>
          </div>
          <q-menu>
            <q-list style="min-width: 100px" v-show="typeof user.uuid !== 'undefined'">
              <q-item clickable v-close-popup to="/MyInfo">
                <q-item-section>个人中心</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/ResourceCreate">
                <q-item-section>发布资源</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/MyCreate">
                <q-item-section>我发布的课程</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-show="user.role>=2" to="/Admin">
                <q-item-section>管理员</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>安全退出</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <span style="color:#ff7a00;align-self:center;cursor: pointer;margin-right:20px;" @click="login">{{role}}</span>
      </div>
      <div class="main-tabs">
        <div
          class="main-tab"
          @click="showTab(0)"
          :style="tabIndex===0?'color: #027be3;':'color: black;'"
        >首页</div>
        <div
          class="main-tab"
          @click="showTab(6)"
          :style="tabIndex===6?'color: #027be3;':'color: black;'"
        >全部课程</div>
        <div
          class="main-tab"
          @click="showTab(2)"
          :style="tabIndex===2?'color: #027be3;':'color: black;'"
        >交流园地</div>
        <div
          class="main-tab"
          @click="showTab(4)"
          :style="tabIndex===4?'color: #027be3;':'color: black;'"
        >资源下载</div>
        <div
          class="main-tab"
          @click="showTab(1)"
          :style="tabIndex===1?'color: #027be3;':'color: black;'"
        >我的课程</div>
        <div
          class="main-tab"
          @click="showTab(3)"
          :style="tabIndex===3?'color: #027be3;':'color: black;'"
        >课程发布</div>
        <div
          class="main-tab"
          @click="showTab(5)"
          :style="tabIndex===5?'color: #027be3;':'color: black;'"
        >关于</div>
      </div>
    </q-header>
    <q-page-container style="background-color: #f2f5f9;">
      <router-view />
    </q-page-container>
    <LoginDialog :dialogData="loginDialog" />
    <FeedbackDialog :dialogData="feedbackDialog" />
    <div class="flat-bar" @click="submitQuesion">
      <div>意</div>
      <div>见</div>
      <div>反</div>
      <div>馈</div>
    </div>
  </q-layout>
</template>
<script>
/* eslint-disable */
import localforage from "localforage";
import LoginDialog from "../components/LoginDialog";
import { bus } from "../bus.js";
import FeedbackDialog from "../components/FeedbackDialog";

export default {
  components: {
    LoginDialog,
    FeedbackDialog
  },
  data() {
    return {
      searchText: "",
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      courseSearch: [],
      askSearch: [],
      resSearch: [],
      searchProgressShow: false,
      feedbackDialog: {
        show: false,
        title: "意见反馈",
        hint: "请描述您的建议"
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
    },
    role: function() {
      //console.log(1,this.user.role)
      if (typeof this.user.role === "undefined") {
        return "( 注册/登陆 )";
      }
      switch (this.user.role) {
        case 0:
          return "";
        case 1:
          return "(讲师)";
        case 2:
          return "(管理员)";
        case 3:
          return "(超级管理员)";
        default:
          break;
      }
    },
    tabIndex: {
      get: function() {
        switch (this.$route.path) {
          case "/MyCourses":
            return 1;
          case "/Ask":
            return 2;
          case "/CourseCreate":
            return 3;
          case "/ResourceDown":
            return 4;
          case "/About":
            return 5;
          case "/AllCourse":
            return 6;
          case "":
            return 0;
          case "/":
            return 0;
          default:
            return -1;
        }
      },
      set: function(newValue) {}
    }
  },
  mounted() {},
  methods: {
    submitQuesion() {
      this.feedbackDialog.show = false;
      this.feedbackDialog.event = "意见反馈";
      this.feedbackDialog.extras = {};
      this.feedbackDialog.show = true;
    },
    login() {
      if (typeof this.user.role === "undefined") {
        this.loginDialog.show = true;
      }
    },
    logout() {
      localforage.removeItem("user").then(() => {
        toast("已退出当前账户");
        let data = {
          avatar: ""
        };
        this.user = data;
        // console.log(999, this.user.uuid);
        bus.$emit("logout");
        this.$router.push("/");
      });
    },
    showTab(index) {
      if (this.tabIndex === index) return;
      this.tabIndex = index;
      switch (index) {
        case 0:
          this.$router.push("/");
          break;
        case 1:
          this.$router.push("/MyCourses");
          break;
        case 2:
          this.$router.push("/Ask");
          break;
        case 3:
          this.$router.push("/CourseCreate");

          break;
        case 4:
          this.$router.push("/ResourceDown");
          break;
        case 5:
          this.$router.push("/About");
          break;
        case 6:
          this.$router.push("/AllCourse");
          break;
        default:
          this.$router.push("/");
          break;
      }
    },
    getSearch(tx) {
      if (tx.length >= 3) {
        this.searchProgressShow = true;
        let timestamp = new Date().getTime() + this.global.requestExpireT;
        let params = {
          tx: tx
        };
        this.$axios
          .get(this.global.api.backurl + "other/search", {
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
            this.searchProgressShow = false;
            // console.log(333, response);
            if (response.status === 200 && response.data.code === 0) {
              let data = response.data.data;
              this.courseSearch = [];
              this.askSearch = [];
              this.resSearch = [];
              for (let i = 0; i < data.length; i++) {
                switch (data[i].type) {
                  case 1:
                    this.courseSearch.push(data[i]);
                    break;
                  case 2:
                    this.askSearch.push(data[i]);
                    break;
                  case 3:
                    this.resSearch.push(data[i]);
                    break;
                  default:
                    break;
                }
              }
            }
          })
          .catch(error => {
            //console.log(error);
          });
      }
    },
    searchGoto(type, item) {
      switch (type) {
        case 1:
          this.$router.push({
            path: "/CourseDetail",
            query: {
              courseid: item.uuid
            }
          });
          break;
        case 2:
          this.getAskDetailById(item.uuid);
          break;
        case 3:
          this.$router.push({
            path: "/ResourceDetail",
            query: {
              uuid: item.uuid
            }
          });
          break;
        default:
          break;
      }
    },
    getAskDetailById(askid) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        uuid: askid
      };
      this.util.loadingShow(this);
      this.$axios
        .get(this.global.api.backurl + "ask/getAskById", {
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
          this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            this.$router.push({
              path: "/AskDetail",
              query: {
                arg: response.data.data[0]
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.myheader {
  background-color: white;
  /* background: linear-gradient(#B2CCFF, #FFFFFF); */
  /* box-shadow: 0px 2px 9px 0px #1918184a; */
  color: black;
  height: 186px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.header-top {
  width: 100%;
  max-width: 1200px;
  height: 136px;
  display: flex;
  align-self: center;
}
.search-bar {
  /* height: 35px; */
  width: 509px;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  flex-shrink: 0;
}
.main-tabs {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  align-self: center;
  font-size: 19px;
}
.main-tab {
  margin: 0 30px 0 30px;
  align-self: center;
}
.main-tab:hover {
  color: #027be3;
  cursor: pointer;
}
.flat-bar {
  position: fixed;
  padding: 5px;
  top: 60%;
  right: 0;
  z-index: 999;
  background-color: #fff;
  box-shadow: 0px 2px 6px 0px rgba(7, 17, 27, 0.1);
  cursor: pointer;
}
</style>