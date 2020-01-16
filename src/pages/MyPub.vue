<template>
  <q-page class="mypage">
    <div class="page-content">
      <!-- <span style="color:#1f2328;font-size:24px;">我发布的课程</span> -->
      <!-- <q-separator /> -->
      <div style=" height: 355px;display: flex;" v-for="(item,index) in myCourses" :key="index">
        <img :src="getImgUrl(item.converimg)" class="videoimg" />
        <div class="summary-tx">
          <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
          <span>{{item.classsummary}}</span>
          <div class="price">
            <span style="align-self: center;margin-left:10px;font-size:24px;color: orange;">￥ {{item.classprice}}元</span>
            <div style="display:flex;align-self: center;margin-right:10px;">
              <img src="statics/share.png" style="width:20px;height:20px;" />
              <span style="margin-left:5px;">分享</span>
            </div>
          </div>
          <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
          <q-btn unelevated :label="item.status===0?'审核中':'审核通过'" class="study" color="primary" />
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
    this.getMyPubCourses();
  },
  methods: {
    getImgUrl(filename) {
      return this.util.makeImgUrl(this, filename);
    },
    getMyPubCourses() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;

      let params = {
        author: this.user.uuid
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
            this.myCourses = response.data.data;
          }
        });
    }
  }
};
</script>
<style scoped>
.page-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 50px 0 50px 0;
  padding: 16px;
}
.videoimg {
  width: 530px;
  height: 320px;
  align-self: center;
  margin: 0px 20px;
  flex-shrink: 0;
}
.summary-tx {
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
}
.price {
  width: 100%;
  height: 55px;
  display: flex;
  background-color: #f3f3f3;
  margin-top: 10px;
  justify-content: space-between;
}
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
