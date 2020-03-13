<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <div style="display:flex;">
        <span class="ask-title">{{ask.title}}</span>
        <img src="statics/coin.png" class="reward-icon" v-if="ask.reward" />
        <span v-if="ask.reward" class="reward-tx">{{ask.reward_num}}</span>
      </div>
      <div v-html="ask.detail" v-highlight></div>
      <div class="flex-col" v-if="ask.user_id!==user.uuid&&myanswer===''">
        <q-btn
          unelevated
          color="primary"
          label="我来回答"
          style="width: 90px;margin-top:15px;"
          @click="ianswer"
        />
        <VueEditor
          v-show="editorShow"
          v-model="myanswerInput"
          useCustomImageHandler
          @image-added="handleImageAdded"
          style="height: 300px;width:100%;margin:10px 0 50px 0;"
        />
        <q-btn
          unelevated
          color="primary"
          label="提交回答"
          style="width: 100px;align-self: flex-end;margin-top:10px;"
          @click="submitAnswer"
          v-show="editorShow"
        />
      </div>
      <div style="display:flex;margin:20px 0 20px 0;">
        <span style="font-size:18px;color: #7a8f9a;font-weight: 700;">{{totalAnswerNum}}个回答</span>
        <div
          style="flex:1;height:1px;background: rgba(0, 0, 0, 0.06);align-self: center;margin-left:10px;"
        ></div>
      </div>
      <CommentReply :ask="$route.query.arg" :myanswer="myanswer" :option="CROption"/>
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import { VueEditor } from "vue2-editor";
import LoginDialog from "../components/LoginDialog";
import { bus } from "../bus.js";
import localforage from "localforage";
import CommentReply from "../components/CommentReply";

export default {
  components: {
    GoBack,
    VueEditor,
    MyFooter,
    LoginDialog,
    CommentReply
  },
  data() {
    return {
      CROption:{
        showCai:true
      },
      ask: "",
      editorShow: false,
      myanswerInput: "",
      answers: [],
      myanswer: "",
      acceptanswer: "",
      totalAnswerNum: 0,
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      zcClickNum: {},
      currentPage: 1,
      lastPage: 1,
      offset: 0,
      limit: 20,
      pageMax: 1
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
    // console.log(222,this.$route.query.arg)
    this.ask = this.$route.query.arg;
    bus.$on("logout", () => {
      // toast("logout");
      this.getAnswer();
    });
    bus.$on("loginok", () => {
      this.getAnswer();
    });
    this.getAnswer();
  },
  methods: {
    getAnswer() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        ask_id: this.ask.uuid,
        limit: this.limit + "",
        offset: this.offset + ""
      };
      if (typeof this.user.uuid !== "undefined") {
        params.user_id = this.user.uuid;
      }
      this.$axios
        .get(this.global.api.backurl + "ask/getAnswer", {
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
          // console.log(111, response.data.data);
          if (response.status === 200 && response.data.code === 0) {
            const total = response.data.data.total[0].total;
            this.pageMax = Math.ceil(total / this.limit);
            let data = response.data.data.answers;
            //其它回答
            for (let i = 0; i < data.length; i++) {
              data[i].comments_show = false;
              data[i].comment_new = "";
              data[i].nickname = "";
              data[i].zan = false;
              data[i].cai = false;
              for (let j = 0; j < data[i].comments.length; j++) {
                data[i].comments[j].comments_show = false;
                data[i].comments[j].comment_new = "";
                data[i].comments[j].nickname = "";
                data[i].comments[j].zan = false;
              }
            }
            this.answers = data;
            this.totalAnswerNum = total;

            //我的回答
            let dataMyans = response.data.data.myanswer;
            if (dataMyans !== "") {
              dataMyans.comments_show = false;
              dataMyans.comment_new = "";
              dataMyans.nickname = "";
              dataMyans.zan = false;
              dataMyans.cai = false;
              for (let j = 0; j < dataMyans.comments.length; j++) {
                dataMyans.comments[j].comments_show = false;
                dataMyans.comments[j].comment_new = "";
                dataMyans.comments[j].nickname = "";
                dataMyans.comments[j].zan = false;
              }

              this.myanswer = dataMyans;
            } else {
              this.myanswer = ""; //以便退出后不显示我的回答
            }

            //采纳的回答
            let dataAccept = response.data.data.acceptanswer;
            if (dataAccept !== "") {
              dataAccept.comments_show = false;
              dataAccept.comment_new = "";
              dataAccept.nickname = "";
              dataAccept.zan = false;
              dataAccept.cai = false;
              for (let j = 0; j < dataAccept.comments.length; j++) {
                dataAccept.comments[j].comments_show = false;
                dataAccept.comments[j].comment_new = "";
                dataAccept.comments[j].nickname = "";
                dataAccept.comments[j].zan = false;
              }

              this.acceptanswer = dataAccept;
            }

            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitAnswer() {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再回答");
        this.loginDialog.show = true;
        return;
      }

      if (this.myanswerInput === "") {
        toast("请输入你的回答");
        return;
      }

      this.util.loadingShow(this);

      let params = {
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        content: this.myanswerInput
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "ask/createAnswer", params, {
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("回答成功,已到账奖励："+this.global.backendConfig.answerReward+'积分');
            //123
            this.myanswer = {
              accept: 0,
              agree: 0,
              ask_id: this.ask.uuid,
              comment_new: "",
              comment_num: 0,
              comments: [],
              comments_show: false,
              content: this.myanswerInput,
              create_at: new Date().getTime(),
              disagree: 0,
              nickname: this.user.nick,
              user_id: this.user.uuid,
              uuid: response.data.data
            };

            this.myanswerInput = "";
            this.editorShow = false;
            this.totalAnswerNum++;

            //更新用户SC数量
            let userData = JSON.parse(JSON.stringify(this.user));
            userData.coin += parseInt(this.global.backendConfig.answerReward);
            this.user = userData;
            localforage.setItem("user", JSON.stringify(this.user));
          }
        });
    },
    ianswer() {
      if (this.editorShow) {
        this.editorShow = false;
      } else {
        this.editorShow = true;
      }
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var expireTime = new Date();
      expireTime.setSeconds(expireTime.getSeconds() + 600);

      var policyText = {
        expiration: expireTime.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
        conditions: [
          ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
        ]
      };

      var policyBase64 = Base64.encode(JSON.stringify(policyText));
      var encrypted = CryptoJS.HmacSHA1(
        policyBase64,
        this.global.api.aliyunossaccesskey
      );
      var signature = CryptoJS.enc.Base64.stringify(encrypted);

      let filename = new Date().getTime() + ".jpg";
      let formData = new FormData();
      formData.append("key", filename);
      formData.append("policy", policyBase64);
      formData.append("OSSAccessKeyId", this.global.api.aliyunossaccessid);
      formData.append("success_action_status", "200");
      formData.append("signature", signature);
      formData.append("file", file, filename);

      this.$axios
        .post(this.global.api.aliyunosshostpubread, formData, {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;boundary=----WebKitFormBoundarytkUbKWcxgeMi1fIr"
          }
        })
        .then(response => {
          //console.log(response);

          if (response.status === 200) {
            Editor.insertEmbed(
              cursorLocation,
              "image",
              this.global.api.aliyunosshostpubread + "/" + filename
            );
            resetUploader();
          }
          // this.util.loadingHide(this)
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.ask-title {
  font-size: 24px;
  line-height: 34px;
  font-weight: 400;
}
.reward-icon {
  width: 13px;
  height: 12px;
  margin-left: 10px;
  align-self: center;
}
.reward-tx {
  align-self: center;
  font-size: 18px;
  color: red;
  margin-left: 5px;
}
</style>
