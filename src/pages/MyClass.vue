<template>
  <q-page class="mypage">
    <div class="white-block"></div>
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
      payedCourses:[]
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
    if (typeof this.user.uuid === "undefined") {
      this.loginDialog.show = true;
    }

    this.getPayedCourse();
  },
  methods: {
    getPayedCourse() {
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
          console.log(999,response);
          if (response.status === 200 && response.data.code === 0) {
            this.payedCourses = response.data.data;
          }
        });
    }
  }
};
</script>
<style scoped>
.white-block {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 50px 0 50px 0;
  justify-content: flex-start;
  padding: 20px;
}
</style>
