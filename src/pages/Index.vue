<template>
  <q-page class="mypage">
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
        <div class="class-card" @click="toDetail(item)" v-for="(item,index) in courses" :key="index" >
          <img :src="getImgUrl(item.converimg)" class="card-img" />
          <span class="card-title">{{item.classname}}</span>
          <div class="more-text">
            <span>
              学习人数：
              <span style="color: orange;">{{item.studynum}}</span>
            </span>
            <span>
              价格：
              <span style="color: orange;">￥：{{item.classprice}}</span>
            </span>
          </div>
        </div>
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
    return {
      slide: "first",
      courses: []
    };
  },
  mounted() {
    this.getCourses()
  },
  methods: {
    getImgUrl(filename) {
      return this.util.makeImgUrl(this, filename);
    },
    getCourses(){
      let timestamp = new Date().getTime() + 1000 * 60 * 1;

      let params = {
        status: 0+''//正式发布改成审核通过的课程
      };

      this.$axios
        .get(this.global.api.backurl + "course/getMyCourses", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.courses = response.data.data;
          }
        });
    },
    toDetail(item){

      this.$router.push({
        path:'/ClassDetail',
        query:{
          arg:item
        }
      })
    }
  }
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
