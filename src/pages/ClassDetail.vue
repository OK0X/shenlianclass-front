<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img
        src="statics/test-watch.png"
        style="width:530px;height:320px;align-self: center;margin:0 20px 0 20px;"
      />
      <div class="summary-tx">
        <span style="font-size:24px;color:#1f2328;">Python公开课</span>
        <span>Python是一种跨平台的计算机程序设计语言。是一种面向对象的动态类型语言，最初被设计用于编写自动化脚本&#40;shell&#41;，随着版本的不断更新和语言新功能的添加，越来越多被用于独立的、大型项目的开发。</span>
        <div class="price">
          <span style="align-self: center;margin-left:10px;font-size:24px;color: orange;">￥ 20.0元</span>
          <div style="display:flex;align-self: center;margin-right:10px;">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：300人</span>
        <q-btn unelevated label="购买学习" class="study" />
      </div>
    </div>
    <div class="detail">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="mails" label="课程介绍" />
        <q-tab name="alarms" label="课程目录" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <img src="statics/test-jishao.png" />
        </q-tab-panel>
        <q-tab-panel name="alarms">
          <q-timeline color="secondary">
            <q-timeline-entry heading>Timeline heading</q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 21, 1986" icon="delete">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>

            <q-timeline-entry heading>November, 2017</q-timeline-entry>
            <q-timeline-entry
              title="Event Title"
              subtitle="February 22, 1986"
              avatar="https://cdn.quasar.dev/img/avatar2.jpg"
            >
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry
              title="Event Title"
              subtitle="February 22, 1986"
              color="orange"
              icon="done_all"
            >
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
          </q-timeline>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div class="relate-link">
      <div class="relate-content">
        <span class="link-tx">友情链接</span>
        <q-btn flat label="比特币" />
        <q-btn flat label="以太坊" />
        <q-btn flat label="智能问答" />
        <q-btn flat label="课程发布" />
      </div>
    </div>
    <div class="footer">
      <div class="footer-content">
        <div class="beian">
          <img src="statics/test-fot.jpg" style="width:156px;50px;" />
          <span style="color:#a1a1a3;margin-top:10px;">备案号：粤ICP备19159723号</span>
          <span style="color:#a1a1a3;margin-top:10px;">Copyright © 2019 深圳市深链网络科技有限公司 版权所有</span>
        </div>
        <div style="display:flex;">
          <div style="display: flex;flex-direction: column;">
            <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;" />
            <span class="wx-img-tx">关注深链网官方公众号</span>
          </div>
          <div style="display: flex;flex-direction: column;margin-left:20px;">
            <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;" />
            <span class="wx-img-tx">关注深链网官方公众号</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      tab: "mails"
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.detail {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 50px 0;
  /* height: 800px; */
  flex-direction: column;
}
.buywatch {
  width: 100%;
  max-width: 1200px;
  height: 355px;
  display: flex;
  background-color: white;
  margin: 50px 0 30px 0;
}
.summary-tx {
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
}
.price {
  width: 100%;
  height: 55px;
  display: flex;
  background-color: #f3f3f3;
  margin-top: 10px;
  justify-content: space-between;
}
.study {
  align-self: flex-start;
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  background-image: linear-gradient(to right, #ff7a00, #fe560a);
  color: white;
}
.relate-link {
  width: 100%;
  height: 100px;
  display: flex;
  background-color: white;
  justify-content: center;
}
.relate-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-self: center;
}
.link-tx {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  line-height: 36px;
}
.footer {
  display: flex;
  width: 100%;
  height: 230px;
  justify-content: center;
}
.footer-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  align-self: center;
  justify-content: space-between;
}
.beian {
  display: flex;
  flex-direction: column;
}
.wx-img-tx {
  width: 90px;
  margin: 0 auto;
  color: #55595c;
  font-size: 12px;
  text-align: center;
}
</style>
