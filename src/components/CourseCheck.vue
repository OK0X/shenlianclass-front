<template>
    <div class="flex-col">
      <span v-show="myCourses.length===0" class="mytx-tip">当前没有要审核的课程</span>
      <div
        style=" height: 355px;display: flex;"
        v-for="(item,index) in myCourses"
        :key="index"
        @click="toCheckDetail(item)"
      >
        <img
          :src="global.api.aliyunosshostpubread + '/' + item.converimg"
          class="course-cover"
          onerror="src = 'statics/default-conver.png'"
        />
        <div class="course-summary">
          <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
          <span>{{item.classsummary}}</span>
          <div class="course-price">
            <div style="align-self: center;margin-left:10px;font-size:24px;color: orange;">
              <span v-show="item.classprice!==''">{{item.classprice}}元</span>
              <span v-show="item.classprice!==''&&item.coin!==''">+</span>
              <span v-show="item.coin!==''">{{item.coin}}积分</span>
            </div>
            <div style="display:flex;align-self: center;margin-right:10px;">
              <img src="statics/share.png" style="width:20px;height:20px;" />
              <span style="margin-left:5px;">分享</span>
            </div>
          </div>
          <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
          <q-btn unelevated :label="util.getCourseStatus(item.status)" class="study" color="primary" />
        </div>
      </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
  components: {
  },
  data() {
    return {
      myCourses: []
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user.user;
      },
      set(val) {
        this.$store.commit("user/updateUser", val);
      }
    }
  },
  mounted() {
    this.getCheckingCourses();
  },
  methods: {
    toCheckDetail(item) {
      this.$router.push({
        path: "/CourseCheckDetail",
        query: {
          arg: item
        }
      });
    },
    getCheckingCourses() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;

      let params = {
        status: 0 + ""
      };

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
            this.myCourses = response.data.data;
          }
        });
    }
  }
};
</script>
<style scoped>
.study {
  align-self: flex-start;
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  /* background-image: linear-gradient(to right, #ff7a00, #fe560a); */
  /* color: white; */
}
</style>
