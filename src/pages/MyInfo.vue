<template>
  <q-page class="mypage">
    <GoBack />
    <div class="white-block" style="margin-top:5px;">
      <div style="display:flex;">
        <img
          :src="user.avatar"
          style="width:80px;height:80px;border-radius: 50%;"
          onerror="src = 'statics/default.png'"
        />
        <div class="flex-col" style="margin-left: 16px;justify-content: space-around;">
          <div style="display:flex;">
            <span>
              <span class="tx-bold">昵称：</span>
              {{user.nick}}
            </span>
            <img src="statics/edit.png" class="edit-icon" @click="editNickName" />
          </div>
          <div style="display:flex;">
            <span>
              <span class="tx-bold">电话：</span>
              {{user.mobile}}
            </span>
            <img src="statics/edit.png" class="edit-icon" @click="editMobile" />
          </div>
          <div style="display:flex;">
            <img src="statics/coin.png" style="width: 13px;height: 12px;align-self:center;" />
            <span style="margin-left:10px;">{{user.coin}} 积分</span>
            <span style="margin-left:10px;color:#1976D2;cursor: pointer;" @click="showCharge">充值</span>
          </div>
        </div>
      </div>
      <input
        accept="image/jpg, image/png"
        type="file"
        @change="onFileChange($event)"
        class="photo-pickup"
        ref="imgpicker"
      />
    </div>
    <div class="white-block" style="margin-bottom:50px;">
      <span>积分明细</span>
      <!-- <q-separator style="margin-top:10px;" /> -->
      <q-table title :data="coinLogs" :columns="columns" row-key="name" flat bordered style="margin-top:10px;" :pagination.sync="pagination"/>
    </div>
    <MyFooter />
    <CropperDialog :data="cropperDialog" @uploadImgOK="uploadImgOK" />
    <LoginDialog :dialogData="loginDialog" />
    <PayWaitDialog :data="payWaitDialog" @finishedPay="finishedPay" @paywithProblem="paywithProblem"/>
    <FeedbackDialog :dialogData="feedbackDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import CropperDialog from "../components/CropperDialog";
import LoginDialog from "../components/LoginDialog";
import PayWaitDialog from "../components/PayWaitDialog";
import { openURL } from "quasar";
import localforage from "localforage";
import { bus } from "../bus.js";
import FeedbackDialog from "../components/FeedbackDialog";

export default {
  components: {
    MyFooter,
    GoBack,
    CropperDialog,
    LoginDialog,
    PayWaitDialog,
    FeedbackDialog
  },
  data() {
    return {
      cropperDialog: {
        title: "剪裁头像",
        show: false
      },
      loginDialog: {
        show: false,
        title: "修改手机号",
        placeholder: "请输入新手机号"
      },
      payWaitDialog: {
        show: false
      },
      out_trade_no: "",
      chargeNum: 0,
      columns: [
        { name: "event", label: "名称", field: "event", align: "left" },
        { name: "change", label: "数量", field: "change", align: "center" },
        {
          name: "create_at",
          label: "时间",
          field: "create_at",
          format: val => `${this.util.timeUTC2Local(val)}`
        }
      ],
      coinLogs: [],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 3,
        rowsNumber: 0
      },
      feedbackDialog: {
        show: false,
        title: "支付问题反馈"
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
    if (typeof this.$route.query.out_trade_no !== "undefined") {
      //支付完成跳转过来
      // console.log(111, this.$route.query);
      this.queryPayResult(this.$route.query.out_trade_no);
    }
    bus.$on("loginok", () => {
      this.getCoinLogs();
    });
    this.getCoinLogs();
  },
  methods: {
    paywithProblem() {
      this.payWaitDialog.show = false;
      this.feedbackDialog.event = "支付问题-积分充值";
      this.feedbackDialog.extras = {
        out_trade_no: this.out_trade_no
      };
      this.feedbackDialog.show = true;
    },
    getCoinLogs() {
      if (typeof this.user.uuid === "undefined") {
        return;
      }

      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid
      };

      this.$axios
        .get(this.global.api.backurl + "user/getCoinChangeLog", {
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
          if (response.status === 200 && response.data.code === 0) {
            this.coinLogs = response.data.data;
            this.pagination.rowsNumber=this.coinLogs.length
          }
        });
    },
    showCharge() {
      this.$q
        .dialog({
          title: "积分充值",
          message: "请输入充值金额（1元=10积分）: ",
          prompt: {
            model: "",
            type: "number" // optional
          },
          ok: "确定",
          cancel: "取消",
          persistent: true
        })
        .onOk(data => {
          if (data <= 1) {
            toast("充值金额需大于1元");
            return;
          }
          if (data >= 5000) {
            toast("单次充值金额需小于5000元");
            return;
          }

          this.gotoPay(data);
        });
    },
    finishedPay() {
      this.payWaitDialog.show = false;
      this.queryPayResult(this.out_trade_no);
    },
    queryPayResult(out_trade_no) {
      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        out_trade_no: out_trade_no,
        subject_type: 2 + ""
      };
      this.$axios
        .get(this.global.api.backurl + "alipay/getPayResult", {
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
          this.util.loadingHide(this);
          if (response.status === 200 && response.data.code === 0) {
            toast("充值成功，积分已实时到账!");

            // let userData = JSON.parse(JSON.stringify(this.user));
            // userData.coin += response.data.data.addcoin;
            // this.user = userData;
            // localforage.setItem("user", JSON.stringify(this.user));
          } else {
            if (response.data.code === 6006) {
              toast("请完成支付后点击该操作");
            }

            //刷新积分
            // localforage.getItem("user").then(value => {
            //   if (value !== null) {
            //     this.user = JSON.parse(value);
            //   }
            // });
          }

          this.getUserInfo();
          this.getCoinLogs();
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoPay(price) {
      this.chargeNum = price * 10;
      this.util.loadingShow(this);
      let params = {
        user_id: this.user.uuid,
        subject_title: "积分充值",
        subject_id: this.util.randomUUID(),
        subject_type: 2 + "", //积分充值
        total_amount: price + "",
        return_url: "https://www.shenlianclass.com/#/MyInfo"
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "alipay/tradePagePay", params, {
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
            this.payWaitDialog.show = true;
            //console.log(response.data.data);
            const result = response.data.data;
            this.out_trade_no = result.out_trade_no;
            // this.payurl = result.payurl;
            openURL(result.payurl);
          }
        });
    },
    editMobile() {
      this.loginDialog.action='updateMobile'
      this.loginDialog.show = true;
    },
    editNickName() {
      this.$q
        .dialog({
          title: "修改昵称",
          message: "",
          prompt: {
            model: "",
            type: "text" // optional
          },
          ok: "确定",
          cancel: "取消",
          persistent: true
        })
        .onOk(data => {
          if (data === "") {
            toast("请输入新的昵称");
            return;
          }

          let params = {
            nick: data
          };
          this.updateUser(params);
        })
        .onCancel(() => {
          //console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          //console.log('I am triggered on both OK and Cancel')
        });
    },
    updateUser(params) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(
          this.global.api.backurl + "user/updateUser?uuid=" + this.user.uuid,
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("设置成功");
            this.getUserInfo();
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
            data.avatar =
              this.global.api.aliyunosshostpubread + "/" + data.uuid + ".jpg";
            this.user = data;
            localforage.setItem("user", JSON.stringify(this.user));
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    uploadImgOK() {
      let data = JSON.parse(JSON.stringify(this.user));
      data.avatar =
        this.global.api.aliyunosshostpubread +
        "/" +
        data.uuid +
        ".jpg?" +
        Math.random(); //加个随机数才会刷新
      this.user = data;

      //console.log(9991, this.user);
    },
    onFileChange(e) {
      // debugger
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let file = files[0]; //File对象

      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(file); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      reader.onload = e => {
        // _this.imgsrc = e.target.result; //图片内容的base64编码
        // _this.imgShow = true;
        // debugger
        //console.log(555)
        this.cropperDialog.img = e.target.result;
        this.cropperDialog.show = true;
        this.$refs.imgpicker.value = null; //重置后可以再次选择同一张图片
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.tx-bold {
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.photo-pickup {
  margin-top: 10px;
  width: 72px;
}
.edit-icon {
  width: 23px;
  height: 23px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
