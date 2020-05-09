<template>
  <q-page class="mypage">
    <div class="page-content" style="flex-direction: row;">
      <div class="flex-col" style="flex-shrink: 0;">
        <span
          class="menu-tx"
          :style="currentMenu===1?'color:#1976D2;':'color:black;'"
          @click="menuClick(1)"
        >课程审核</span>
        <span
          class="menu-tx"
          :style="currentMenu===2?'color:#1976D2;':'color:black;'"
          @click="menuClick(2)"
        >用户反馈</span>
        <span
          class="menu-tx"
          :style="currentMenu===3?'color:#1976D2;':'color:black;'"
          @click="menuClick(3)"
        >讲师审核</span>
        <span
          class="menu-tx"
          :style="currentMenu===6?'color:#1976D2;':'color:black;'"
          @click="menuClick(6)"
          v-show="user.role>=3"
        >用户数据</span>
        <span
          class="menu-tx"
          :style="currentMenu===5?'color:#1976D2;':'color:black;'"
          @click="menuClick(5)"
          v-show="user.role>=3"
        >系统管理</span>
        <span
          class="menu-tx"
          :style="currentMenu===4?'color:#1976D2;':'color:black;'"
          @click="menuClick(4)"
          v-show="user.role>=3"
        >缓存设置</span>
      </div>
      <div style="margin:10px 20px 20px 30px;width:100%;">
        <CourseCheck v-show="currentMenu===1" />
        <Feedback v-show="currentMenu===2" />
        <TeacherCheck v-show="currentMenu===3" />
        <SetCache v-show="currentMenu===4" />
        <SystemMgr v-show="currentMenu===5" />
        <UserData v-show="currentMenu===6" />
      </div>
    </div>
    <MyFooter />
  </q-page>
</template>
<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import Feedback from "../components/Feedback";
import CourseCheck from "../components/CourseCheck";
import TeacherCheck from "../components/TeacherCheck";
import SetCache from "../components/SetCache";
import SystemMgr from "../components/SystemMgr";
import UserData from "../components/UserData";

export default {
  components: {
    MyFooter,
    Feedback,
    CourseCheck,
    TeacherCheck,
    SetCache,
    SystemMgr,
    UserData
  },
  data() {
    return {
      currentMenu: 1
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
  mounted() {},
  methods: {
    menuClick(index) {
      this.currentMenu = index;
      //
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-tx {
  margin: 10px;
  cursor: pointer;
}
</style>
