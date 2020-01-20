<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="myheader">
      <div class="title">
        <img
          src="statics/test-logo.png"
          style="width:131px;height:51px;align-self: center;margin-left:50px;"
        />
        <q-input bottom-slots v-model="text" :dense="true" class="search-bar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;align-self: center;" />
        <div style="align-self: center;margin-left:50px;">
          <img src="statics/default.png" style="width:40px;height:40px;border-radius: 50%;" />
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>个人中心</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="toMyPub">
                <q-item-section>我发布的课程</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-show="user.role>=2" @click="course2Check">
                <q-item-section>课程审核</q-item-section>
              </q-item>
              <q-separator v-show="typeof user.role !== 'undefined'"/>
              <q-item clickable v-close-popup @click="logout" v-show="typeof user.role !== 'undefined'">
                <q-item-section>安全退出</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <span style="align-self: center;margin-left:10px;">
          {{user.nick==null?'游客':user.nick}}
          <span style="color:#ff7a00;" @click="login">{{role}}</span>
        </span>
      </div>
      <div class="menu">
        <q-btn flat label="首页" class="menu-text" to="/" />
        <q-btn flat label="我的课程" class="menu-text" to="/MyClass" />
        <q-btn flat label="问答" class="menu-text" />
        <q-btn flat label="课程发布" class="menu-text" to="/ClassPub" />
      </div>
    </q-header>
    <q-page-container style="background-color: #f2f5f9;">
      <router-view />
    </q-page-container>
    <LoginDialog :dialogData="setMobileDialogData" />
  </q-layout>
</template>
<script>
/* eslint-disable */
import localforage from "localforage";
import LoginDialog from "../components/LoginDialog";


export default {
  components: {
    LoginDialog
  },
  data() {
    return {
      text: "",
      setMobileDialogData: {
        show: false,
        title: '快捷登陆'
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
    role:function(){
      console.log(1,this.user.role)
      if(typeof this.user.role === 'undefined'){
        return '( 注册/登陆 )'
      }
      switch (this.user.role) {
        case 0:
          return ''
        case 1:
          return "(讲师)";
        case 2:
          return "(管理员)";
        default:
          
          break;
      }
    }
  },
  mounted() {
    
  },
  methods: {
    login(){
      if(typeof this.user.role === 'undefined'){
        this.setMobileDialogData.show=true
      }
    },
    logout(){
      localforage.removeItem("user").then(()=>{
        toast('已退出当前账户')
        this.user={}
      })
    },
    toMyPub(){
       this.$router.push('/MyPub');
    },
    course2Check() {
      this.$router.push('/CourseCheck');
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
.title {
  width: 100%;
  max-width: 1200px;
  height: 136px;
  display: flex;
  align-self: center;
}
.menu {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-self: center;
  padding-left: 50px;
}
.search-bar {
  /* height: 35px; */
  width: 509px;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  flex-shrink: 0;
}
.menu-text {
  font-size: 18px;
  color: #333333;
  height: 50px;
  width: 160px;
}
</style>