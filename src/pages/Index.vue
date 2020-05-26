<template>
  <q-page class="mypage">
    <div class="gallery">
      <q-carousel arrows animated v-model="slide" height="400px" :autoplay="5000" :infinite="true">
        <q-carousel-slide
          :name="index"
          :img-src="global.api.aliyunosshostpubread + '/' + item.carouselimg"
          v-for="(item,index) in bannerCourses"
          :key="index"
          style="cursor: pointer;"
          @click="toDetail(item)"
        ></q-carousel-slide>
      </q-carousel>
    </div>
    <div class="class-list">
      <div style="display:flex;margin-top:60px;">
        <div class="myseperator"></div>
        <span style="color:#1f2328;font-size:24px;">精品课程</span>
        <div class="myseperator"></div>
      </div>
      <div class="card-list">
        <div
          class="class-card"
          @click="toDetail(item)"
          v-for="(item,index) in courses"
          :key="index"
        >
          <img
            :src="global.api.aliyunosshostpubread + '/' + item.converimg"
            class="card-img"
            onerror="src = 'statics/default-conver.png'"
          />
          <div class="card-info">
            <span class="card-title">{{item.classname}}</span>
            <div class="more-text">
              <span>
                学习人数:
                <span style="color: orange;">{{item.studynum}}</span>
              </span>
              <span>
                价格:
                <span style="color: orange;">
                  <span v-show="item.classprice!==''">{{item.classprice}}元</span>
                  <span v-show="item.classprice!==''&&item.coin!==''">+</span>
                  <span v-show="item.coin!==''">{{item.coin}}积分</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="class-list">
      <div style="display:flex;margin-top:30px;">
        <div class="myseperator"></div>
        <span style="color:#1f2328;font-size:24px;">热门问答</span>
        <div class="myseperator"></div>
      </div>
      <AskItem :asks="hotasks" style="margin: 30px 0 30px 0;" />
    </div>
    <div class="class-list" style="margin:30px 0 50px 0;">
      <div style="display:flex;">
        <div class="myseperator"></div>
        <span style="color:#1f2328;font-size:24px;">热门资源</span>
        <div class="myseperator"></div>
      </div>
      <ResourceItem :res="hotRes" style="margin: 30px 0 30px 0;padding: 20px" />
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import AskItem from "../components/AskItem";
import ResourceItem from "../components/ResourceItem";
import localforage from "localforage";
export default {
  components: {
    MyFooter,
    AskItem,
    ResourceItem
  },
  data() {
    return {
      slide: 0,
      courses: [],
      hotasks: [],
      hotRes: [],
      bannerCourses: []
    };
  },
  mounted() {
    if (typeof this.global.routeCache.indexCache !== 'undefined') {
      this.setCourse(this.global.routeCache.indexCache.courses);
      this.hotasks = this.global.routeCache.indexCache.asks;
      this.hotRes = this.global.routeCache.indexCache.ress;
    }
    this.getCourses();

    if (this.$route.query.u !== "undefined") {
      localforage.setItem("uin", this.$route.query.u);
    }
  },
  methods: {
    getCourses() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;

      let params = {
        courseNum: "12",
        askNum: "10",
        resNum: "10"
      };

      this.$axios
        .get(this.global.api.backurl + "course/getIndexData", {
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.global.routeCache.indexCache = response.data.data;
            this.setCourse(response.data.data.courses);
            this.hotasks = response.data.data.asks;
            this.hotRes = response.data.data.ress;
          }
        });
    },
    setCourse(allCourse) {
      this.bannerCourses = [];
      this.courses = [];
      for (const course of allCourse) {
        if (course.carousel !== 0 && course.carousel > new Date().getTime()) {
          this.bannerCourses.push(course);
        } else {
          this.courses.push(course);
        }
      }
    },
    toDetail(item) {
      this.$router.push({
        path: "/CourseDetail",
        query: {
          arg: item
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.gallery {
  width: 100%;
  height: 400px;
  overflow: hidden;
  max-width: 1200px;
  // border-radius: 5px;
  margin-top: 30px;
  box-shadow: 0px 26px 24px 0 #d9dfe9;
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
  margin: 30px 0 5px 0;
  display: flex;
  flex-wrap: wrap;
}
.class-card {
  width: 222px;
  height: 215px;
  background: #fff;
  box-shadow: 0 2px 5px 0 #d9dfe9;
  margin: 0 18px 25px 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.card-img {
  width: 100%;
  height: 130px;
}
.card-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.card-title {
  color: #333333;
  margin: 10px;
}
.more-text {
  color: #333333;
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px 10px;
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
.myseperator {
  background: rgba(0, 0, 0, 0.06);
  height: 1px;
  flex: 1;
  align-self: center;
  margin: 10px;
}
</style>
