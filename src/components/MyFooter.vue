<template>
  <div style="display: flex;flex-direction: column;width:100%">
    <div class="relate-link">
      <div class="relate-content">
        <span class="link-tx">友情链接</span>
        <q-btn flat label="blockchain.com" @click="openLink(4)" />
        <q-btn flat label="百度ai" @click="openLink(0)" />
        <q-btn flat label="quasar" style="font-weight: 400;" @click="openLink(2)" />
        <q-btn flat label="vuejs" style="font-weight: 400;" @click="openLink(3)" />
        <q-btn flat label="bitcoin" style="font-weight: 400;" @click="openLink(6)" />
        <q-btn flat label="ethereum" style="font-weight: 400;" @click="openLink(5)" />
        <q-btn flat label="cosmos" style="font-weight: 400;" @click="openLink(1)" />
        <q-btn flat label="阿里云" style="font-weight: 400;" @click="openLink(7)" />
        <q-btn flat label="腾讯云" style="font-weight: 400;" @click="openLink(8)" />
      </div>
    </div>
    <div class="footer">
      <div class="footer-content">
        <div class="beian">
          <img src="statics/foot-logo.png" style="width:156px;50px;" />
          <span style="color:#a1a1a3;margin-top:10px;">粤ICP备19159723号</span>
          <span style="color:#a1a1a3;margin-top:10px;">Copyright © 2020 深圳市深链网络科技有限公司</span>
        </div>
        <div style="display:flex;">
          <div style="display: flex;flex-direction: column;">
            <img src="statics/qiyeweixin.jpg" style="width:90px;height:90px;" />
            <span class="wx-img-tx">添加我们的企业微信</span>
          </div>
          <div style="display: flex;flex-direction: column;margin-left:30px;">
            <img src="statics/wx-gh-qrcode.jpg" style="width:90px;height:90px;" />
            <span class="wx-img-tx">关注深链课堂官方公众号</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { openURL } from "quasar";

export default {
  name: "MyFooter",
  methods: {
    openLink(index) {
      switch (index) {
        case 0:
          openURL("https://ai.baidu.com");
          break;
        case 1:
          openURL("https://cosmos.network/");
          break;
        case 2:
          openURL("https://quasar.dev/introduction-to-quasar");
          break;
        case 3:
          openURL("https://cn.vuejs.org/v2/guide/");
          break;
        case 4:
          openURL("https://www.blockchain.com");
          break;
        case 5:
          openURL("https://www.ethereum.org");
          break;
        case 6:
          openURL("https://bitcoin.org/zh_CN/");
          break;
        case 7:
          openURL("https://www.aliyun.com/minisite/goods?userCode=gj5yt0mj");
          break;
        case 8:
          openURL("https://url.cn/p74fGCbR");
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style scoped>
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
