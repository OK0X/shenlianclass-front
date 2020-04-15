<template>
  <q-page class="mypage">
    <div class="page-content" style="margin-bottom:0">
      <span class="title-tx" style="margin-top: 35px;">关于我们</span>
      <span
        class="content-tx"
      >我们是一群来自于华为，百度，腾讯的程序员，设计师和区块链行业的早期参与者。我们每个人在各自的领域都深耕多年，有着丰富的行业经验。由于对区块链有着共同的爱好和认同感走到了一起，我们认为它是21世纪最伟大的发明之一，坚信它能改变未来的世界。但是当前的区块链发展得并不完善，大规模行业应用也尚未到来，其中有很大原因是人们对它缺乏了解，而我们创办深链课堂就是为了给大家提供一个更加专业的区块链学习平台。降低大家进入区块链领域的门槛，同时也为行业积累和培养技术人才，为行业的发展贡献我们的力量。</span>
      <span class="content-tx">
        同时我们也欢迎更多的小伙伴加入我们，一起做我们自己最喜欢的事情，一起在区块链的变革浪潮中贡献自己的力量。如果你精通区块链某个领域的技术，并且希望通过传授知识来获取额外的收入，可以直接点击
        <span class="click-tx" @click="toCourseCreate">课程发布</span> 申请成为讲师，发布自己的课程；也可以应聘我们团队的讲师职位， 除了讲师职位还有更多职位正在招聘中：
      </span>
      <span class="content-tx">
        <span class="tx-bold">工作地点：</span>深圳市南山区
      </span>
      <span class="content-tx" style="margin-top:0;">
        <span class="tx-bold">简历投递：</span>
        <a href="mailto:hr@shenlianclass.com" class="click-tx">hr@shenlianclass.com</a>
      </span>
      <span class="title-tx">我们可以提供</span>
      <ul>
        <li>轻松活跃的工作氛围；弹性的工作时间</li>
        <li>全员配备 MacBook Pro</li>
        <li>免费午餐供应</li>
        <li>不限量的零食水果下午茶及其他隐性福利</li>
        <li>老司机带路进入区块链领域</li>
        <li>股权/期权激励</li>
        <li>年底双薪</li>
      </ul>
    </div>
    <div class="page-content" style="margin: 10px 0 0 0;">
      <span class="title-tx">区块链讲师 5 ~ 10名</span>
      <span class="title-tx">【我们希望你】</span>
      <ul>
        <li>有3年以上实际项目开发经验</li>
        <li>了解比特币，以太坊等行业top公链相关原理</li>
        <li>精通某一具体领域的技术</li>
        <li>有良好的沟通和表达能力</li>
      </ul>
      <span class="title-tx">【加分项】</span>
      <ul>
        <li>曾就职于一线互联网公司</li>
        <li>参与过大型区块链开源项目</li>
      </ul>
    </div>
    <div class="page-content" style="margin: 10px 0 0 0;">
      <span class="title-tx">前端工程师 x1</span>
      <span class="title-tx">【我们希望你】</span>
      <ul>
        <li>3年以上前端开发经验；有良好的编码风格</li>
        <li>熟练使用 HTML/CSS/JS等前端技术，熟悉Web前端的性能优化，并对Web安全有丰富的认识和经验；</li>
        <li>熟悉vuejs，并有实际开发经验；</li>
        <li>熟悉typescript，并有实际开发经验；</li>
        <li>熟悉webpack，并有实际编写插件的经验；</li>
      </ul>
      <span class="title-tx">【加分项】</span>
      <ul>
        <li>熟悉nodejs，阿里的eggjs框架</li>
        <li>熟悉solidity语言</li>
      </ul>
    </div>
    <div class="page-content" style="margin: 10px 0 50px 0;">
      <span class="title-tx">测试工程师 x2</span>
      <span class="title-tx">【我们希望你】</span>
      <ul>
        <li>计算机相关专业本科及以上学历，2年以上web测试经验</li>
        <li>熟悉自动化测试领域业界最新技术，熟悉自动化测试在CI和DevOps中的应用</li>
        <li>熟练使用chrome或者fire fox控制台测试页面</li>
        <li>掌握postman等web测试工具</li>
        <li>了解测试基础理论，熟悉常用测试技术方法，有较高的质量意识</li>
      </ul>
      <span class="title-tx">【加分项】</span>
      <ul>
        <li>对区块链感兴趣</li>
        <li>有AI相关测试经验</li>
        <li>有接口自动化经验</li>
        <li>有selenium等web自动化测试经验</li>
      </ul>
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
  mounted() {},
  methods: {
    toCourseCreate() {
      this.$router.push("/CourseCreate");
    }
  }
};
</script>
<style lang="scss" scoped>
.title-tx {
  color: #303538;
  font-size: 21px;
  margin: 20px 20px 0 20px;
}
.content-tx {
  margin: 10px 20px 0 20px;
  font-size: 14px;
  color: black;
  line-height: 30px;
}
.contact-us {
  padding-left: 27px;
  font-size: 14px;
  color: #60686b;
  line-height: 32px;
}
.click-tx {
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
}
</style>
