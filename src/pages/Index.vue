<template>
  <q-page class="mypage">
    <div class="recommend-class">
      <div class="class-title">
        <div class="title-content">
          <div>
            <img src="statics/hot.png" style="width:15px;height:15px;" />
            <span style="margin-left:5px;color: rgba(255,255,255,.6);">推荐课程 / DAPP大型项目实战</span>
          </div>
          <span class="title-bgtx">图解+仿写 新手都能学懂的SpringBoot源码课</span>
          <span class="sub-title">Java开发必会、行业风向标级框架，BAT架构师带你一课攻克SpringBoot源码</span>
          <div class="price-buy">
            <span class="price-tx">￥9.9</span>
            <q-btn rounded label="马上学习" class="btn-buy" />
            <span class="study-nums">316人已学习</span>
          </div>
        </div>
      </div>
      <div class="trysee">
        <div class="trysee-tx">
          <img src="statics/play.png" style="width:64px;height:64px;align-self: center;" />
          <span style="margin-top:10px;">观看试看课程</span>
        </div>
        <div class="trysee-tx">
          <span class="trysee-title">全方位深入解析最新版SpringBoot源码</span>
          <span>当下SpringBoot日渐取代SSM成为新项目首选框架，企业招聘对其要求也不断提高。掌握SpringBoot源码将助你高效定位和解决问题，仿写SpringBoot源码将帮你养成规范的代码习惯，轻松应对高标准的企业开发与面试要求。本课程通过图解+仿写教学模式，双管齐下，打造新手都能学得懂的源码课。</span>
        </div>
      </div>
    </div>
    <div class="more-class">
      <div class="course-card" v-for="item in courses" v-bind:key="item.index">
        <img :src="item.imgpath" class="course-img" />
        <div class="course-name">当智能合约全栈工程师学这一个就够了</div>
        <div class="course-info">
          <span>
            <i class="imv2-set-sns"></i>41
          </span>
          <span class="r js-hover-evaluation">1人评价</span>
        </div>
        <div class="course-price">￥20.00</div>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      courses: [
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img1.mukewang.com/szimg/5d9c62fb0907ccf012000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img4.mukewang.com/szimg/5dc9047a09bae31e12000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet, , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img3.mukewang.com/szimg/5db7fa4f09a2b64312000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet,r incididunt ut labore et dolore magna aliqua."
        },
        {
          imgpath:
            "https://img4.mukewang.com/szimg/5dc9047a09bae31e12000676-360-202.png",
          lorem:
            "Lorem ipsum dolor sit amet, , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
      ]
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.trysee-title{
      font-weight: 700;
    font-size: 24px;
    color: #fff;
    line-height: 36px;
    margin-bottom: 16px;
}
.trysee-tx {
  display: flex;
  flex-direction: column;
  color: white;
  margin: 30px;
  align-self: center;
  max-width: 600px;
}
.trysee {
  display: flex;
  background-size: cover;
  background-position: center;
  background-image: url("../statics/bg-trysee.jpg");
  width: 100%;
  max-width: 1100px;
  height: 338px;
  margin: 48px auto 48px auto;
  padding: 64px 0 72px 0;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
  border-radius: 16px;
  justify-content: center;
}
.study-nums {
  color: white;
  align-self: flex-end;
  text-shadow: 0 2px 4px rgba(28, 31, 33, 0.6);
  margin-left: 8px;
}
.price-tx {
  font-size: 32px;
  align-self: flex-end;
  color: #ff7a00;
  line-height: 32px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(28, 31, 33, 0.6);
}
.price-buy {
  margin-top: 32px;
  display: flex;
  align-self: flex-end;
}
.btn-buy {
  width: 160px;
  background-image: linear-gradient(
    90deg,
    #ff7a00 0,
    rgba(255, 0, 105, 0.99) 99%
  );
  color: white;
  margin-left: 20px;
}
.sub-title {
  align-self: center;
  font-size: 16px;
  color: #fff;
  line-height: 24px;
  text-shadow: 0 2px 4px rgba(28, 31, 33, 0.6);
  margin-top: 8px;
}
.title-bgtx {
  line-height: 2rem;
  align-self: center;
  font-size: 40px;
  color: #fff;
  line-height: 48px;
  text-shadow: 0 2px 4px rgba(28, 31, 33, 0.6);
  margin-top: 30px;
}
.class-title {
  width: 100%;
  display: flex;
  height: 288px;
  background-image: url("../statics/class-title-bg.jpg");
  background-size: cover;
  justify-content: center;
}
.title-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  margin: 62px;
}
.recommend-class {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.course-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 270px;
  margin: 5px;
}
.more-class {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1100px;
  justify-content: center;
}
.course-img {
  width: 270px;
  height: 148px;
  background-color: #f3f5f7;
  border-radius: 6px;
}
.course-name {
  font-size: 16px;
  color: #07111b;
  line-height: 24px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s;
  font-weight: bold;
  height: 46px;
  margin-top: 10px;
}
.course-info {
  font-size: 12px;
  color: #9199a2;
  line-height: 18px;
  margin-top: 4px;
  font-weight: 400;
}
.course-price {
  font-size: 12px;
  color: #545c66;
}
</style>
