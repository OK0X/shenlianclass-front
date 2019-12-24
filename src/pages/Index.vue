<template>
  <q-page class="mypage" style="background-color:#f8f8f8;">
    <div class="gallery">
      <q-carousel arrows animated v-model="slide" height="400px" :autoplay="5000" :infinite="true">
        <q-carousel-slide name="first" img-src="statics/test-gallery1.png">
        </q-carousel-slide>
        <!-- <q-carousel-slide name="second" img-src="https://cdn.quasar.dev/img/parallax1.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Second stop</div>
            <div class="text-subtitle1">Famous City</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="third" img-src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Third stop</div>
            <div class="text-subtitle1">Famous Bridge</div>
          </div>
        </q-carousel-slide> -->
      </q-carousel>
    </div>
    <div class="class-list">
      <span style="color:#1f2328;font-size:24px;margin-top:60px;">精品课程</span>
      <q-separator />
      <div class="card-list">
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
        <div class="class-card">
          <img src="statics/test-card1.jpg" class="card-img" />
          <span class="card-title">web前端0基础教室</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">3000</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：30</span>
            </span>
          </div>
        </div>
      </div>
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
      slide: "first",
      courses: []
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.gallery {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
.class-list {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  /* align-self: center; */
}
.list-title {
  display: flex;
}
.card-list {
  margin: 30px 0 30px 0;
  display: flex;
  flex-wrap: wrap;
}
.class-card {
  width: 222px;
  height: 215px;
  background: #fff;
  box-shadow: 0 2px 5px 0 #d9dfe9;
  margin: 0 22px 25px 0;
  display: flex;
  flex-direction: column;
}
.card-img {
  width: 100%;
  height: 130px;
}
.card-title {
  color: #333333;
  margin: 10px;
}
.more-text {
  color: #333333;
  display: flex;
  justify-content: space-between;
  margin: 10px;
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
