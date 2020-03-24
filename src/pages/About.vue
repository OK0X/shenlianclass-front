<template>
  <q-page class="mypage">
    <div class="page-content">
      <img src="statics/about-bg.jpg" style="width: 100%;height: 470px;"/>
      <span class="q-tx" style="margin-top: 35px;">我们是谁？</span>
      <span
        class="a-tx"
      >我们是一群来自于华为，百度，腾讯的程序员，设计师和区块链行业的早期参与者。由于共同的兴趣爱好走到一起，我们每个人在各自的领域都深耕多年，有着丰富的行业经验。</span>
      <span class="q-tx">为什么要创办深链课堂？</span>
      <span
        class="a-tx"
      >首先我们都热爱区块链技术，认为它是21世纪最伟大的发明之一，坚信它能改变未来的世界。但是当前的区块链发展得并不完善，大规模行业应用也尚未到来，其中有很大原因是人们对它缺乏了解，而我们创办深链课堂就是为了给大家提供一个更加专业的区块链学习平台。降低大家进入区块链领域的门槛，同时也为行业培养技术人才，为行业的发展添砖加瓦。</span>
      <span class="q-tx">我能在深链课堂发布课程吗？</span>
      <span class="a-tx">我们欢迎区块链领域的技术爱好者发布自己的原创技术课程，具体可以点击<span class="kcfb" @click="toCourseCreate">课程发布</span>查看详情。</span>
      <span class="q-tx">如何联系我们？</span>
      <span class="contact-us">电子邮箱：admin@shenlianclass.com</span>
      <span class="contact-us">公司地址：深圳市龙华区龙华街道龙峰一路554号中顺商务大厦101</span>
      <div class="contact-us" style="display:flex;">
        <span>企业微信：</span>
        <img src="statics/qiyeweixin.jpg" style="width:90px;height:90px;" />
      </div>
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";

export default {
  components: {
    MyFooter
  },
  data() {
    return {};
  },
  mounted() {
     
  },
  methods: {
    toCourseCreate(){
      this.$router.push('/CourseCreate')
    }
  }
};
</script>
<style lang="scss" scoped>
.q-tx {
  color: #303538;
  font-size: 16px;
  padding-left: 27px;
}
.a-tx {
  padding-left: 27px;
  margin-bottom: 28px;
  font-size: 14px;
  color: #60686b;
  line-height: 32px;
}
.contact-us {
  padding-left: 27px;
  font-size: 14px;
  color: #60686b;
  line-height: 32px;
}
.kcfb{
  color: $primary;
  cursor: pointer;
}
</style>
