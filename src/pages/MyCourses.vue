<template>
  <q-page class="mypage">
    <div class="page-content">
      <span v-show="noPayedCourses">你还未购买过课程，先去首页看看哦！</span>
      <div class="flex-col" v-if="typeof user.uuid !== 'undefined'">
        <div
          style=" height: 355px;display: flex;flex-direction: column;"
          v-for="(item,index) in payedCourses"
          :key="index"
          @click="toCourseDetail(item)"
        >
          <div style="display: flex;flex:1;">
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
            </div>
          </div>
          <q-separator style="flex:0;" v-if="index!==payedCourses.length-1" />
        </div>
      </div>
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
    <ShareDialog :props="shareDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import LoginDialog from "../components/LoginDialog";
import { bus } from "../bus.js";
import ShareDialog from "../components/ShareDialog";

export default {
  components: {
    MyFooter,
    LoginDialog,
    ShareDialog
  },
  data() {
    return {
      noPayedCourses:false,
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      payedCourses: [],
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
    bus.$on("loginok", () => {
      this.getPayedCourse();
    });
    this.getPayedCourse();
  },
  methods: {
    courseShare(item){
      this.shareDialog.tx='https://www.shenlianclass.com/#/CourseDetail?courseid='+item.uuid
      this.shareDialog.show=true
    },
    toCourseDetail(item) {
      this.$router.push({
        path: "/CourseDetail",
        query: {
          arg: item,
          from: "myclass"
        }
      });
    },
    getPayedCourse() {
      if (typeof this.user.uuid === "undefined") {
        // toast("请登陆后查看");
        this.loginDialog.show = true;
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;

      let params = {
        user_id: this.user.uuid
      };

      this.$axios
        .get(this.global.api.backurl + "course/getPayedCourse", {
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
          // console.log(999, response);
          if (response.status === 200 && response.data.code === 0) {
            this.payedCourses = response.data.data;
            if(this.payedCourses.length === 0){
              this.noPayedCourses=true;
            }
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
