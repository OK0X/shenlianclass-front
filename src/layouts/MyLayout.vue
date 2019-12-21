<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="myheader" height-hint="50">
      <div class="title-bar">
        <div class="menu-left">
          <!-- <a href="https://b.ok0x.com">
            <img style="height: 45px;" src="statics/logo1.png" />
          </a>-->
          <q-btn flat label="首页" to="/" />
          <q-btn flat label="我的课程" />
          <q-btn flat label="Test" to="/CreateQQUser"/>
        </div>
        <div style="display:flex;">
          <q-btn flat label="登陆" to="/Login" ><img src="statics/weixin.png" style="margin-left:5px;width:18px;height:18px;"/></q-btn>
        </div>
      </div>
    </q-header>
    <q-page-container style="background-color: #f2f5f9;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.myheader {
  background-color: white;
  box-shadow: 0px 2px 9px 0px #1918184a;
  color: black;
}
.title-bar {
  padding-left: 20%;
  padding-right: 20%;
  display: flex;
  justify-content: space-between;
}
.menu-left {
  display: flex;
}
.menu {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.mobile-menu {
  display: none;
}
@media screen and (orientation: portrait) {
  .menu {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
}
</style>