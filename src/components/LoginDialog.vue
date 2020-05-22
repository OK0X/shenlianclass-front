<template>
  <q-dialog v-model="dialogData.show">
    <div class="dialog">
      <div class="text-h6" style="margin-left:10px;margin-top:10px;">{{dialogData.title}}</div>
      <div style="margin-left:10px;margin-right:10px;">
        <q-input :dense="true" v-model="mobile" :placeholder="placeholder()" />
        <div style="display: flex;margin-top:15px;justify-content: space-between;">
          <q-input :dense="true" v-model="smscode" placeholder="请输入验证码" style="width: 50%;" />
          <q-btn unelevated rounded :label="'发送验证码'+smsbtnTx" color="primary" @click="sendsmscode" />
        </div>
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="确定" @click="onOk" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import localforage from "localforage";
import { bus } from "../bus.js";
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
    placeholder() {
      if (typeof this.dialogData.placeholder === "undefined") {
        return "请输入手机号";
      }
      return this.dialogData.placeholder;
    },
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
          _this.smsBtnCountdown();
        });
    },
    onOk() {
      // debugger
      if (this.smscode === "") {
        toast(this.$t("smsnull"));
        return;
      }

      this.smscodecheck();
    },
    smscodecheck() {
      this.util.loadingShow(this);
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
        .then(response => {
          // console.log(999, this.dialogData);
          if (response.data.msg === "ok") {
            // console.log(999, this.dialogData);
            if (this.dialogData.action === "updateMobile") {
              this.updateMobile();
            } else {
              this.login();
            }
            this.dialogData.show = false;
          }
        })
        .catch(error => {
          console.error(error);
          toast(this.$t("smscodeerror"));
          this.util.loadingHide(this);
        });
    },
    updateMobile() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        uuid: this.user.uuid,
        mobile: this.mobile + ""
      };
      this.$axios
        .put(this.global.api.backurl + "user/updateMobile", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data === "updateOK") {
              toast("更新成功");
              let newUser = this.user;
              newUser.mobile = this.mobile;
              this.user = JSON.parse(JSON.stringify(this.user));
              localforage.setItem("user", JSON.stringify(this.user));
            } else {
              this.mobileExistTip(response.data.data);
            }
          } else {
            toast("更新失败，请稍后重试");
          }
        })
        .catch(error => {
          console.log(error);
          this.util.loadingHide(this);
        });
    },
    mobileExistTip(user) {
      // debugger
      this.$q
        .dialog({
          message: "该手机号码已注册，是否要切换到该账号登陆？",
          ok: "确定",
          cancel: "取消"
        })
        .onOk(() => {
          this.user = user;
          localforage.setItem("user", JSON.stringify(this.user));
          bus.$emit("loginok");
        })
        .onCancel(() => {
          //console.log('>>>> Cancel')
        });
    },
    login() {
      var _this = this;
      let params = {
        mobile: this.mobile + ""
      };

      // let [err,data] = await this.util.awaitWrap(localforage.getItem("uin"))
      // if(err===null&&data!==null){
      //   params.qq=data
      // }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
        .then(response => {
          //console.log(response);
          _this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;

            delete data.type;

            this.user = data;
            localforage.setItem("user", JSON.stringify(this.user));
            toast("登陆成功");
            bus.$emit("loginok");
            this.updateQQ();
          } else {
            toast("注册失败，请稍后重试！");
          }
        });
    },
    updateQQ() {
      localforage.getItem("uin").then(value => {
        if (value !== null) {
          let timestamp = new Date().getTime() + this.global.requestExpireT;
          let params={
            qq:value
          }
          this.$axios
            .put(
              this.global.api.backurl +
                "user/updateUserGeneral?uuid=" +
                this.user.uuid,
              params,
              {
                headers: {
                  "access-token": this.util.generateToken(
                    JSON.stringify(params),
                    timestamp
                  ),
                  timestamp2: timestamp
                }
              }
            )
            .then(response => {
              //
              if (response.status === 200 && response.data.code === 0) {
                console.log('ok');
                localforage.removeItem("uin")
              }
            });
        }
      });
    }
  }
};
</script>
<style scoped>
.dialog {
  background: white;
  min-width: 300px;
}
</style>
