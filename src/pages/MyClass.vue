<template>
  <q-page class="mypage">
    <div class="page-content">
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
            onerror="src = 'statics/default-conver.jpg'"
          />
          <div class="course-summary">
            <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
            <span>{{item.classsummary}}</span>
            <div class="price-share">
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
          </div>
        </div>
        <q-separator style="flex:0;" v-if="index!==payedCourses.length-1" />
      </div>
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import LoginDialog from "../components/LoginDialog";

export default {
  components: {
    MyFooter,
    LoginDialog
  },
  data() {
    return {
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      payedCourses: []
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
    this.getPayedCourse();
  },
  methods: {
    toCourseDetail(item) {
      this.$router.push({
        path: "/ClassDetail",
        query: {
          arg: item,
          from: "myclass"
        }
      });
    },
    getPayedCourse() {
      if (typeof this.user.uuid === "undefined") {
        toast("请登陆后查看");
        this.loginDialog.show = true;
        return;
      }
      let timestamp = new Date().getTime() + 1000 * 60 * 1;

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
          //console.log(999, response);
          if (response.status === 200 && response.data.code === 0) {
            this.payedCourses = response.data.data;
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
