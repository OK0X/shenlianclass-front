<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="myheader">
      <div class="header-top">
        <img
          src="statics/test-logo.png"
          style="width:131px;height:51px;align-self: center;margin-left:50px;"
        />
        <q-input bottom-slots v-model="searchText" :dense="true" class="search-bar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;align-self: center;" />
        <div style="align-self: center;margin-left:50px;">
          <div style="display:flex;">
            <img
              :src="user.avatar"
              style="width:40px;height:40px;border-radius: 50%;cursor: pointer;"
              onerror="src = 'statics/default.png'"
            />
            <span style="align-self: center;margin-left:10px;cursor: pointer;">
              {{user.nick==null?'游客':user.nick}}
            </span>
          </div>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/MyInfo">
                <q-item-section>个人中心</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/MyPub">
                <q-item-section>我发布的课程</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-show="user.role>=2" to="/CourseCheck">
                <q-item-section>课程审核</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-show="user.role>=3" to="/BackendConfig">
                <q-item-section>系统配置</q-item-section>
              </q-item>
              <q-separator v-show="typeof user.role !== 'undefined'" />
              <q-item
                clickable
                v-close-popup
                @click="logout"
                v-show="typeof user.role !== 'undefined'"
              >
                <q-item-section>安全退出</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <span style="color:#ff7a00;align-self:center;cursor: pointer;" @click="login">{{role}}</span>
      </div>
      <div class="main-tabs">
        <div
          class="main-tab"
          @click="showTab(0)"
          :style="tabIndex===0?'color: #027be3;':'color: black;'"
        >首页</div>
        <div
          class="main-tab"
          @click="showTab(1)"
          :style="tabIndex===1?'color: #027be3;':'color: black;'"
        >我的课程</div>
        <div
          class="main-tab"
          @click="showTab(2)"
          :style="tabIndex===2?'color: #027be3;':'color: black;'"
        >知识问答</div>
        <div
          class="main-tab"
          @click="showTab(3)"
          :style="tabIndex===3?'color: #027be3;':'color: black;'"
        >课程发布</div>
      </div>
    </q-header>
    <q-page-container style="background-color: #f2f5f9;">
      <router-view />
    </q-page-container>
    <LoginDialog :dialogData="loginDialog" />
  </q-layout>
</template>
<script>
/* eslint-disable */
import localforage from "localforage";
import LoginDialog from "../components/LoginDialog";
import { bus } from "../bus.js";

export default {
  components: {
    LoginDialog
  },
  data() {
    return {
      searchText: "",
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      tabIndex: 0
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
    }
  },
  mounted() {},
  methods: {
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
        bus.$emit('logout')
      });
    },
    showTab(index) {
      // if(this.tabIndex===index)
      // return

      this.tabIndex = index;
      switch (index) {
        case 0:
          this.$router.push("/");
          break;
        case 1:
          this.$router.push("/MyClass");
          break;
        case 2:
          this.$router.push("/Ask");
          break;
        case 3:
          this.$router.push("/ClassPub");
          break;

        default:
          break;
      }
    }
  }
};
</script>
<style scoped>
.myheader {
  background-color: white;
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
</style>