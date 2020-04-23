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
    this.getConfig();
    
  },
  methods: {
    checkLogin() {
      localforage.getItem("user").then(value => {
        if (value !== null) {
          this.user = JSON.parse(value);

          this.getUserInfo();
        } else {
          let data = {
            avatar: ""
          };
          this.user = data;
        }
      });
    },
    getUserInfo() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        uuid: this.user.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "user/getinfo", {
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
          //console.log(333,response);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            this.user = data;
            localforage.setItem("user", JSON.stringify(this.user));
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getConfig() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "config/get", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          // console.log(999,response);
          if (response.status === 200 && response.data.code === 0) {
            this.global.backendConfig = response.data.data;
            if(!this.util.isEmpty(this.global.backendConfig.notify)){
              this.showNotif(this.global.backendConfig.notify)
            }
            
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    showNotif(tx) {
      this.$q.notify({
        color: "negative",
        // textColor,
        icon: "report_problem",
        message: tx,
        position: "bottom-right",
        // avatar,
        // multiLine,
        actions: [
          {
            label: "我知道了",
            color: "yellow",
            handler: () => {
              // console.log('wooow')
            }
          }
        ],
        timeout: 0
      });
    }
  }
};
</script>
