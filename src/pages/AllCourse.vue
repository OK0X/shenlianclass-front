<template>
  <q-page class="mypage">
    <div class="card-list">
      <div class="class-card" @click="toDetail(item)" v-for="(item,index) in courses" :key="index">
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
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";

export default {
  components: {
    MyFooter,
    GoBack
  },
  data() {
    return {
      courses: []
    };
  },
  mounted() {
    if (typeof this.global.routeCache.allCourse !== 'undefined') {

      this.courses = this.global.routeCache.allCourse

    }
    this.getAllCourse();
  },
  methods: {
    getAllCourse() {
      let params={
        status:2+''
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "course/getCourses", {
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
            this.global.routeCache.allCourse = response.data.data;
            this.courses = response.data.data;
          }
        });
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
.card-list {
  width: 100%;
  max-width: 1200px;
  margin: 50px 0 50px 0;
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
</style>
