<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
/* eslint-disable */
import localforage from "localforage";
export default {
  name: "App",
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
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      localforage.getItem("user").then(value => {
        if (value !== null) {
          this.user = JSON.parse(value);

          this.getUserInfo();
        } else{
          let data={
            avatar:''
          }
          this.user = data;
        }
      });
    },
    getUserInfo() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params={
        uuid:this.user.uuid
      }
      this.$axios
        .get(this.global.api.backurl + "user/getinfo", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(JSON.stringify(params), timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(333,response);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            data.avatar=this.global.api.aliyunosshostpubread+'/'+data.uuid+'.jpg'
            this.user=data
            localforage.setItem("user",JSON.stringify(this.user))
          }
        })
        .catch(error => {

          //console.log(error);
        });
    }
  }
};
</script>
