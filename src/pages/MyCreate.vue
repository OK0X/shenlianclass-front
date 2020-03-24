<template>
  <q-page class="mypage">
    <div class="page-content">
      <!-- <span style="color:#1f2328;font-size:24px;">我发布的课程</span> -->
      <!-- <q-separator /> -->
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
            <div class="course-share" @click.stop="courseShare(item)">
              <img src="statics/share.png" style="width:20px;height:20px;" />
              <span style="margin-left:5px;">分享</span>
            </div>
          </div>
          <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
          <q-btn unelevated :label="util.getCourseStatus(item.status)" class="study" color="primary" />
        </div>
      </div>
    </div>
    <MyFooter />
    <ShareDialog :props="shareDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import ShareDialog from "../components/ShareDialog";
export default {
  components: {
    MyFooter,
    ShareDialog
  },
  data() {
    return {
      myCourses: [],
      shareDialog: {
        show: false
      }
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
    this.getMyPubCourses();
  },
  methods: {
    courseShare(item){
      this.shareDialog.tx='https://www.shenlianclass.com/#/CourseDetail?courseid='+item.uuid
      this.shareDialog.show=true
    },
    toCheckDetail(item) {
      this.$router.push({
        path: "/CourseCheckDetail",
        query: {
          arg: item
        }
      });
    },
    getMyPubCourses() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;

      let params = {
        author: this.user.uuid
      };

      this.$axios
        .get(this.global.api.backurl + "course/getMyCreate", {
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
