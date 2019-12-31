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
        <img
          src="statics/default.png"
          style="width:40px;height:40px;align-self: center;margin-left:50px;border-radius: 50%;"
        />
        <span style="align-self: center;margin-left:10px;">用户微信昵称</span>
      </div>
      <div class="menu">
        <q-btn flat label="首页" class="menu-text" to="/"/>
        <q-btn flat label="我的课程" class="menu-text" />
        <q-btn flat label="问答" class="menu-text" />
        <q-btn flat label="课程发布" class="menu-text" to="/ClassPub"/>
        <q-btn flat label="Test" class="menu-text" to="/Test" v-if="true"/>
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
    return {
      text:''
    };
  },
  methods: {}
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