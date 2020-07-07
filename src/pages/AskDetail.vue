<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <div style="display:flex;">
        <span class="ask-title">{{ask.title}}</span>
        <img src="statics/coin.png" class="reward-icon" v-if="ask.reward" />
        <span v-if="ask.reward" class="reward-tx">{{ask.reward_num}}</span>
      </div>
      <div class="post-info" v-if="ask.type===1">
        <img :src="author.avatar" class="author-img" onerror="src = 'statics/default-avatar.gif'" />
        <span class="ad-vr-tx">{{author.nick}}</span>
        <span class="ad-vr-tx">{{util.timeUTC2Local(ask.create_at)}}</span>
        <img src="statics/reply-num.png" class="ad-vr-ic" />
        <span class="ad-vr-tx">{{totalAnswerNum}}</span>
        <img src="statics/eye.png" class="ad-vr-ic" />
        <span class="ad-vr-tx">{{ask.view_num}}</span>
      </div>
      <div v-html="ask.detail" v-highlight style="margin-top: 30px;"></div>
      <div class="flex-col" v-if="ask.user_id!==user.uuid&&myanswer===''">
        <q-btn
          unelevated
          color="primary"
          :label="ask.type===0?'我来回答':'发表评论'"
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
          :label="ask.type===0?'提交回答':'提交评论'"
          style="width: 100px;align-self: flex-end;margin-top:10px;"
          @click="submitAnswer"
          v-show="editorShow"
        />
      </div>
      <div style="display:flex;margin:20px 0 20px 0;">
        <span
          style="font-size:18px;color: #7a8f9a;font-weight: 700;"
        >{{ask.type===0?(totalAnswerNum+'个回答'):''}}</span>
        <div
          style="flex:1;height:1px;background: rgba(0, 0, 0, 0.06);align-self: center;margin-left:10px;"
        ></div>
      </div>
      <CommentReply
        v-show="myanswer!==''"
        answerType="myanswer"
        :answer="myanswer"
        :ask="ask"
        :option="CROption"
        @acceptAnswerOK="acceptAnswerOK"
        @needLogin="needLogin"
      />
      <q-separator
        style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
        v-show="myanswer!==''"
      />
      <CommentReply
        v-show="acceptanswer!==''&&acceptanswer.user_id!==user.uuid"
        answerType="acceptanswer"
        :answer="acceptanswer"
        :ask="ask"
        :option="CROption"
        @needLogin="needLogin"
      />
      <q-separator
        style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
        v-show="acceptanswer!==''&&acceptanswer.user_id!==user.uuid"
      />
      <div class="flex-col" v-for="(item,index) in answers" :key="index">
        <CommentReply
          answerType="other"
          :answer="item"
          :ask="ask"
          :option="CROption"
          @acceptAnswerOK="acceptAnswerOK"
          @needLogin="needLogin"
        />
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==answers.length-1"
        />
      </div>
      <q-pagination
        v-if="pageMax > 1"
        v-model="currentPage"
        :max="pageMax"
        :direction-links="true"
        style="margin-top:30px;align-self:center;"
        @input="paginationClick"
      ></q-pagination>
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
      CROption: {
        showCai: true
      },
      ask: {},
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
      pageMax: 1,
      author: {
        avatar: "",
        nick: ""
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
    if (typeof this.$route.query.uuid !== "undefined") {
      // console.log(888, this.$route.query.uuid);
      this.ask.uuid=this.$route.query.uuid
      this.getAskDetailById(this.ask.uuid)
    } else {
      if (this.$route.query.arg === "[object Object]") {
        this.ask = this.global.routeCache.askDetail;
      } else {
        this.ask = this.$route.query.arg;
        this.global.routeCache.askDetail = this.ask;
      }
    }
    // console.log(999, this.ask);
    bus.$on("logout", () => {
      // toast("logout");
      this.getAnswer();
    });
    bus.$on("loginok", () => {
      this.getAnswer();
    });
    this.getAnswer();
    this.getAuthorInfo();
    this.viewnumAdd();
  },
  methods: {
    getAskDetailById(askid) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        uuid: askid
      };
      this.util.loadingShow(this);
      this.$axios
        .get(this.global.api.backurl + "ask/getAskById", {
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
            this.ask=response.data.data[0]
            this.getAuthorInfo()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    viewnumAdd() {
      let params = {
        uuid: this.ask.uuid
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "ask/viewnumAdd", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {});
    },
    getAuthorInfo() {
      let userids = [];
      userids.push(this.ask.user_id);
      let params = {
        uuid: encodeURIComponent(JSON.stringify(userids))
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "user/getNames", {
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
          // console.log(999,response.data.data)
          if (
            response.status === 200 &&
            response.data.code === 0 &&
            response.data.data.length === 1
          ) {
            this.author.avatar = response.data.data[0].avatar;
            this.author.nick = response.data.data[0].nick;
          }
        });
    },
    paginationClick(pageIndex) {
      // console.log(this.lastPage, pageIndex);
      if (this.lastPage === pageIndex) return;

      this.offset += this.limit * (pageIndex - this.lastPage);
      this.lastPage = pageIndex;
      this.getAnswer();
    },
    getAnswer() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
              data[i].avatar = "";
              data[i].zan = false;
              data[i].cai = false;
              for (let j = 0; j < data[i].comments.length; j++) {
                data[i].comments[j].comments_show = false;
                data[i].comments[j].comment_new = "";
                data[i].comments[j].nickname = "";
                data[i].comments[j].avatar = "";
                data[i].comments[j].zan = false;
              }
            }
            this.answers = data;
            this.totalAnswerNum = total;

            //我的回答
            let dataMyans = response.data.data.myanswer;
            if (dataMyans !== "") {
              this.totalAnswerNum++;
              dataMyans.comments_show = false;
              dataMyans.comment_new = "";
              dataMyans.nickname = this.user.nick;
              dataMyans.avatar = this.user.avatar;
              dataMyans.zan = false;
              dataMyans.cai = false;
              for (let j = 0; j < dataMyans.comments.length; j++) {
                dataMyans.comments[j].comments_show = false;
                dataMyans.comments[j].comment_new = "";
                dataMyans.comments[j].nickname = "";
                dataMyans.comments[j].avatar = "";
                dataMyans.comments[j].zan = false;
              }

              this.myanswer = dataMyans;
            } else {
              this.myanswer = ""; //以便退出后不显示我的回答
            }

            //采纳的回答
            let dataAccept = response.data.data.acceptanswer;
            if (dataAccept !== "") {
              this.totalAnswerNum++;
              dataAccept.comments_show = false;
              dataAccept.comment_new = "";
              dataAccept.nickname = "";
              dataAccept.avatar = "";
              dataAccept.zan = false;
              dataAccept.cai = false;
              for (let j = 0; j < dataAccept.comments.length; j++) {
                dataAccept.comments[j].comments_show = false;
                dataAccept.comments[j].comment_new = "";
                dataAccept.comments[j].nickname = "";
                dataAccept.comments[j].avatar = "";
                dataAccept.comments[j].zan = false;
              }

              this.acceptanswer = dataAccept;
            }

            this.getNicknames();
            this.getZanCai();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getZanCai() {
      let ans_com_ids = [];

      for (let i = 0; i < this.answers.length; i++) {
        ans_com_ids.push(this.answers[i].uuid);
        for (let j = 0; j < this.answers[i].comments.length; j++) {
          ans_com_ids.push(this.answers[i].comments[j].uuid);
        }
      }

      if (this.myanswer !== "") {
        ans_com_ids.push(this.myanswer.uuid);
        for (let j = 0; j < this.myanswer.comments.length; j++) {
          ans_com_ids.push(this.myanswer.comments[j].uuid);
        }
      }

      if (this.acceptanswer !== "") {
        ans_com_ids.push(this.acceptanswer.uuid);
        for (let j = 0; j < this.acceptanswer.comments.length; j++) {
          ans_com_ids.push(this.acceptanswer.comments[j].uuid);
        }
      }

      // console.log(999,ans_com_ids)
      if (ans_com_ids.length === 0) {
        return;
      }

      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        ans_com_id: encodeURIComponent(JSON.stringify(ans_com_ids))
      };
      this.$axios
        .get(this.global.api.backurl + "ask/getZanCai", {
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
            let data = response.data.data;

            let cutZanCais = {};
            for (let i = 0; i < data.length; i++) {
              cutZanCais[data[i].ans_com_id] = {
                zan: data[i].zan,
                cai: data[i].cai
              };
            }

            //我的回答-赞踩-赋值
            if (this.myanswer !== "") {
              if (typeof cutZanCais[this.myanswer.uuid] !== "undefined") {
                this.myanswer.zan = cutZanCais[this.myanswer.uuid].zan;
                this.myanswer.cai = cutZanCais[this.myanswer.uuid].cai;
              } else {
                this.myanswer.zan = false;
                this.myanswer.cai = false;
              }

              // console.log(334,this.myanswer)

              for (let j = 0; j < this.myanswer.comments.length; j++) {
                if (
                  typeof cutZanCais[this.myanswer.comments[j].uuid] !==
                  "undefined"
                ) {
                  this.myanswer.comments[j].zan =
                    cutZanCais[this.myanswer.comments[j].uuid].zan;
                  // this.myanswer.comments[j].cai =
                  // cutZanCais[this.myanswer.comments[j].uuid].cai;
                } else {
                  this.myanswer.comments[j].zan = false;
                  // this.myanswer.comments[j].cai = false;
                }
              }
            }

            //已采纳-赞踩-赋值
            if (this.acceptanswer !== "") {
              if (typeof cutZanCais[this.acceptanswer.uuid] !== "undefined") {
                this.acceptanswer.zan = cutZanCais[this.acceptanswer.uuid].zan;
                this.acceptanswer.cai = cutZanCais[this.acceptanswer.uuid].cai;
              } else {
                this.acceptanswer.zan = false;
                this.acceptanswer.cai = false;
              }

              for (let j = 0; j < this.acceptanswer.comments.length; j++) {
                if (
                  typeof cutZanCais[this.acceptanswer.comments[j].uuid] !==
                  "undefined"
                ) {
                  this.acceptanswer.comments[j].zan =
                    cutZanCais[this.acceptanswer.comments[j].uuid].zan;
                  // this.acceptanswer.comments[j].cai =
                  // cutZanCais[this.acceptanswer.comments[j].uuid].cai;
                } else {
                  this.acceptanswer.comments[j].zan = false;
                  // this.acceptanswer.comments[j].cai = false;
                }
              }
            }

            //其它回答--赞踩-赋值
            for (let i = 0; i < this.answers.length; i++) {
              if (typeof cutZanCais[this.answers[i].uuid] !== "undefined") {
                this.answers[i].zan = cutZanCais[this.answers[i].uuid].zan;
                this.answers[i].cai = cutZanCais[this.answers[i].uuid].cai;
              } else {
                this.answers[i].zan = false;
                this.answers[i].cai = false;
              }

              for (let j = 0; j < this.answers[i].comments.length; j++) {
                if (
                  typeof cutZanCais[this.answers[i].comments[j].uuid] !==
                  "undefined"
                ) {
                  this.answers[i].comments[j].zan =
                    cutZanCais[this.answers[i].comments[j].uuid].zan;
                  // this.answers[i].comments[j].cai = cutZanCais[this.answers[i].comments[j].uuid].cai;
                } else {
                  this.answers[i].comments[j].zan = false;
                  // this.answers[i].comments[j].cai = false;
                }
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNicknames() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;

      let userids = [];
      for (let i = 0; i < this.answers.length; i++) {
        userids.push(this.answers[i].user_id);
        for (let j = 0; j < this.answers[i].comments.length; j++) {
          userids.push(this.answers[i].comments[j].user_id);
        }
      }

      if (this.myanswer !== "") {
        userids.push(this.myanswer.user_id);
        for (let j = 0; j < this.myanswer.comments.length; j++) {
          userids.push(this.myanswer.comments[j].user_id);
        }
      }

      if (this.acceptanswer !== "") {
        userids.push(this.acceptanswer.user_id);
        for (let j = 0; j < this.acceptanswer.comments.length; j++) {
          userids.push(this.acceptanswer.comments[j].user_id);
        }
      }

      if (userids.length === 0) return;

      let params = {
        uuid: encodeURIComponent(JSON.stringify(userids))
      };
      this.$axios
        .get(this.global.api.backurl + "user/getNames", {
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
            let data = response.data.data;

            let nicks = {};
            let avatars = {};
            for (let i = 0; i < data.length; i++) {
              nicks[data[i].uuid] = data[i].nick;
              avatars[data[i].uuid] = data[i].avatar;
            }

            //其它回答+评论-昵称赋值
            for (let i = 0; i < this.answers.length; i++) {
              this.answers[i].nickname = nicks[this.answers[i].user_id];
              this.answers[i].avatar = avatars[this.answers[i].user_id];
              for (let j = 0; j < this.answers[i].comments.length; j++) {
                this.answers[i].comments[j].nickname =
                  nicks[this.answers[i].comments[j].user_id];
                this.answers[i].comments[j].avatar =
                  avatars[this.answers[i].comments[j].user_id];
              }
            }

            //我的回答+评论-昵称-赋值
            if (this.myanswer !== "") {
              for (let j = 0; j < this.myanswer.comments.length; j++) {
                this.myanswer.comments[j].nickname =
                  nicks[this.myanswer.comments[j].user_id];
                this.myanswer.comments[j].avatar =
                  avatars[this.myanswer.comments[j].user_id];
              }
            }

            //采纳的回答+评论-昵称-赋值
            if (this.acceptanswer !== "") {
              this.acceptanswer.nickname = nicks[this.acceptanswer.user_id];
              this.acceptanswer.avatar = avatars[this.acceptanswer.user_id];
              for (let j = 0; j < this.acceptanswer.comments.length; j++) {
                this.acceptanswer.comments[j].nickname =
                  nicks[this.acceptanswer.comments[j].user_id];
                this.acceptanswer.comments[j].avatar =
                  avatars[this.acceptanswer.comments[j].user_id];
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    needLogin() {
      this.loginDialog.show = true;
    },
    acceptAnswerOK() {
      this.getAnswer();
      this.ask.hasaccept = true;
    },
    submitAnswer() {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再操作");
        this.loginDialog.show = true;
        return;
      }

      if (this.myanswerInput === "") {
        toast("请输入内容");
        return;
      }

      this.util.loadingShow(this);

      let params = {
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        content: this.myanswerInput
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
            toast(
              "提交成功,已到账奖励：" +
                this.global.backendConfig.answerReward +
                "积分"
            );
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
              avatar: this.user.avatar,
              user_id: this.user.uuid,
              uuid: response.data.data
            };

            this.myanswerInput = "";
            this.editorShow = false;
            this.totalAnswerNum++;

            //更新用户积分数量
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
      let filename =
        new Date().getTime() + file.name.substring(file.name.length - 4);
      this.util.uploadFile2OSS(this, filename, file, true, null, () => {
        Editor.insertEmbed(
          cursorLocation,
          "image",
          this.global.api.aliyunosshostpubread + "/" + filename
        );
        resetUploader();
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
.ad-vr-tx {
  color: #888888;
  margin-left: 5px;
}
.post-info {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.author-img {
  width: 29px;
  height: 29px;
  border-radius: 50%;
}
.ad-vr-ic {
  width: 20px;
  height: 20px;
  margin-left: 20px;
}
</style>
