<template>
  <q-dialog v-model="dialogData.show">
    <div class="mydialog">
      <div class="text-h6" style="margin-left:10px;margin-top:10px;">{{dialogData.title}}</div>
      <div style="margin-left:10px;margin-right:10px;">
        <q-input :dense="true" v-model="mobile" placeholder="请输入手机号" />
        <div style="display: flex;margin-top:15px;justify-content: space-between;">
          <q-input :dense="true" v-model="smscode" placeholder="请输入验证码" style="width: 50%;" />
          <q-btn unelevated rounded :label="'发送验证码'+smsbtnTx" color="primary" @click="sendsmscode" />
        </div>
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="确定" @click="submitinfo2bmob" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import localforage from "localforage";
export default {
  props: ["dialogData"],
  data() {
    return {
      mobile: "",
      smscode: "",
      smsbtnTx: "",
      mcount: 60
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
  methods: {
    smsBtnCountdown() {
      var smstask = setInterval(() => {
        this.smsbtnTx = "(" + this.mcount + "S)";
        this.mcount--;
        if (this.mcount === -1) {
          this.mcount = 60;
          this.smsbtnTx = "";
          clearInterval(smstask);
        }
      }, 1000);
    },
    sendsmscode() {
      var _this = this;

      if (!/^1(3|4|6|5|7|8)\d{9}$/.test(this.mobile)) {
        toast(this.$t("mobilecheckfail"));
        return;
      }

      if (this.mcount !== 60) {
        toast(this.$t("latersend"));
        return;
      }

      this.$axios
        .post(
          this.global.api.bombsmsurl + "requestSmsCode",
          {
            mobilePhoneNumber: this.mobile + "",
            template: "ok0x1"
          },
          {
            headers: this.global.api.bombheader
          }
        )
        .then(function(response) {
          // //console.log('add');
          // //console.log(response);
          _this.smsBtnCountdown();
        });
    },
    onOk() {
      // debugger
      if (this.smscode === "") {
        toast(this.$t("smsnull"));
        return;
      }
      this.$q.loading.show({
        message: this.$t("submiting"),
        spinnerSize: 50
      });
      this.smscodecheck();
      
    },
    smscodecheck() {
      var _this = this;
      this.$axios
        .post(
          this.global.api.bombsmsurl + "verifySmsCode/" + this.smscode,
          {
            mobilePhoneNumber: this.mobile + ""
          },
          {
            headers: this.global.api.bombheader
          }
        )
        .then(function(response) {
          // //console.log(response);
          if (response.data.msg === "ok") {
            _this.submitinfo2bmob();
          }
        })
        .catch(error => {
          console.error(error);
          toast(_this.$t("smscodeerror"));
          _this.$q.loading.hide();
        });
    },
    submitinfo2bmob() {
      var _this = this;
      let params = {
        mobile: this.mobile + ""
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "user/loginORregiste", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then((response)=> {
          console.log(response);
          _this.$q.loading.hide();
          if (response.status === 200 && response.data.code === 0) {

            let data=response.data.data
            if (data.type === "login") {
              delete data.type
              
            } else {
              data.mobile=this.mobile + ""
              data.role=0
              data.nick='设置昵称'


            }

            this.user = data;
            console.log(this.user);

            localforage.setItem("user",JSON.stringify(this.user))
            toast('登陆成功')
            this.dialogData.show = false;

          }
        });
    }
  }
};
</script>
<style scoped>
</style>
