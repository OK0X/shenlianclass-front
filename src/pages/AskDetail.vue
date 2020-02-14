<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <span class="ask-title">{{ask.title}}</span>
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
      <div class="flex-col" v-if="myanswer!==''">
        <div style="display:flex;">
          <img src="statics/mark.png" style="width:16px;height:16px;align-self: center;" />
          <span class="myanswer-tx">我的回答</span>
        </div>
        <div style="display:flex;margin-top:10px;">
          <img
            :src="getAvatar(user.uuid)"
            onerror="src = 'statics/default.png'"
            style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
          />
          <div class="flex-col">
            <span style="font-size: 14px;color: #333;">{{user.nick}}</span>
            <span style="font-size: 12px;color: #9eacb6;">{{util.getShortTime(myanswer.create_at)}}</span>
          </div>
        </div>
        <div v-html="myanswer.content" style="margin:10px 0 10px 0;font-size: 16px;" v-highlight></div>
        <div style="display:flex;margin-bottom:10px;" v-if="myanswer.accept">
          <img src="statics/choosed.png" style="width:20px;height:20px;" />
          <span class="mytx-tip">本回答已被提问者采纳</span>
        </div>
        <div style="display:flex;">
          <img src="statics/zan.png" class="zan-cai" />
          <span class="zan-cai-num">{{myanswer.agree}}</span>
          <img src="statics/cai.png" class="zan-cai" />
          <span class="zan-cai-num">{{myanswer.disagree}}</span>
          <img
            src="statics/comment-focus.png"
            class="comment-icon"
            @click="myanswer.comments_show=!myanswer.comments_show"
          />
          <span
            class="comment-tx"
            @click="myanswer.comments_show=!myanswer.comments_show"
          >评论({{myanswer.comment_num}})</span>
        </div>
        <div class="comment-list" v-show="myanswer.comments_show">
          <div style="display:flex;">
            <q-input
              dense
              outlined
              v-model="myanswer.comment_new"
              style="flex:1"
              counter
              maxlength="200"
            />
            <q-btn
              outline
              color="primary"
              label="发表"
              style="margin-left:10px;height:40px;"
              @click="submitComment('',myanswer,myanswer)"
            />
          </div>
          <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
          <div class="flex-col" v-for="(subitem,index) in myanswer.comments" :key="index">
            <div style="display:flex;">
              <img
                :src="getAvatar(subitem.user_id)"
                onerror="src = 'statics/default.png'"
                style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
              />
              <div class="flex-col">
                <span style="font-size: 14px;color: #333;">{{subitem.nickname}}</span>
                <span
                  style="font-size: 12px;color: #9eacb6;"
                >{{util.timeUTC2Local(subitem.create_at)}}</span>
              </div>
            </div>
            <div style="margin:10px 0 10px 0;font-size:16px;">
              <span style="color:#027BE3">{{subitem.atwho===''?subitem.atwho:'@'+subitem.atwho}}</span>
              {{subitem.content}}
            </div>
            <div style="display:flex;font-size:12px;">
              <img src="statics/zan-black.png" class="reply-icon" />
              <span style="cursor: pointer;color:#7A8F9A">赞</span>
              <img
                src="statics/reply.png"
                @click="subitem.comments_show=!subitem.comments_show"
                class="reply-icon"
              />
              <span
                @click="subitem.comments_show=!subitem.comments_show"
                style="cursor: pointer;color:#7A8F9A"
              >回复</span>
            </div>
            <div style="display:flex;margin-top:10px;" v-show="subitem.comments_show">
              <q-input
                dense
                outlined
                v-model="subitem.comment_new"
                style="flex:1"
                counter
                maxlength="200"
              />
              <q-btn
                outline
                color="primary"
                label="发表"
                style="margin-left:10px;height:40px;"
                @click="submitComment(subitem.nickname,myanswer,subitem)"
              />
            </div>
            <q-separator
              style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
              v-if="index!==myanswer.comments.length-1"
            />
          </div>
        </div>
        <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
      </div>
      <div class="flex-col" v-if="acceptanswer!==''&&acceptanswer.user_id!==user.uuid">
        <div style="display:flex;">
          <img src="statics/mark.png" style="width:16px;height:16px;align-self: center;" />
          <span class="myanswer-tx">已采纳</span>
        </div>
        <div style="display:flex;margin-top:10px;">
          <img
            :src="getAvatar(acceptanswer.user_id)"
            onerror="src = 'statics/default.png'"
            style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
          />
          <div class="flex-col">
            <span style="font-size: 14px;color: #333;">{{acceptanswer.nickname}}</span>
            <span
              style="font-size: 12px;color: #9eacb6;"
            >{{util.getShortTime(acceptanswer.create_at)}}</span>
          </div>
        </div>
        <div
          v-html="acceptanswer.content"
          style="margin:10px 0 10px 0;font-size: 16px;"
          v-highlight
        ></div>
        <div style="display:flex;">
          <img src="statics/zan.png" class="zan-cai" />
          <span class="zan-cai-num">{{acceptanswer.agree}}</span>
          <img src="statics/cai.png" class="zan-cai" />
          <span class="zan-cai-num">{{acceptanswer.disagree}}</span>
          <img
            src="statics/comment-focus.png"
            class="comment-icon"
            @click="acceptanswer.comments_show=!acceptanswer.comments_show"
          />
          <span
            class="comment-tx"
            @click="acceptanswer.comments_show=!acceptanswer.comments_show"
          >评论({{acceptanswer.comment_num}})</span>
        </div>
        <div class="comment-list" v-show="acceptanswer.comments_show">
          <div style="display:flex;">
            <q-input
              dense
              outlined
              v-model="acceptanswer.comment_new"
              style="flex:1"
              counter
              maxlength="200"
            />
            <q-btn
              outline
              color="primary"
              label="发表"
              style="margin-left:10px;height:40px;"
              @click="submitComment('',acceptanswer,acceptanswer)"
            />
          </div>
          <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
          <div class="flex-col" v-for="(subitem,index) in acceptanswer.comments" :key="index">
            <div style="display:flex;">
              <img
                :src="getAvatar(subitem.user_id)"
                onerror="src = 'statics/default.png'"
                style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
              />
              <div class="flex-col">
                <span style="font-size: 14px;color: #333;">{{subitem.nickname}}</span>
                <span
                  style="font-size: 12px;color: #9eacb6;"
                >{{util.timeUTC2Local(subitem.create_at)}}</span>
              </div>
            </div>
            <div style="margin:10px 0 10px 0;font-size:16px;">
              <span style="color:#027BE3">{{subitem.atwho===''?subitem.atwho:'@'+subitem.atwho}}</span>
              {{subitem.content}}
            </div>
            <div style="display:flex;font-size:12px;">
              <img src="statics/zan-black.png" class="reply-icon" />
              <span style="cursor: pointer;color:#7A8F9A">赞</span>
              <img
                src="statics/reply.png"
                @click="subitem.comments_show=!subitem.comments_show"
                class="reply-icon"
              />
              <span
                @click="subitem.comments_show=!subitem.comments_show"
                style="cursor: pointer;color:#7A8F9A"
              >回复</span>
            </div>
            <div style="display:flex;margin-top:10px;" v-show="subitem.comments_show">
              <q-input
                dense
                outlined
                v-model="subitem.comment_new"
                style="flex:1"
                counter
                maxlength="200"
              />
              <q-btn
                outline
                color="primary"
                label="发表"
                style="margin-left:10px;height:40px;"
                @click="submitComment(subitem.nickname,acceptanswer,subitem)"
              />
            </div>
            <q-separator
              style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
              v-if="index!==acceptanswer.comments.length-1"
            />
          </div>
        </div>
        <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
      </div>
      <div class="flex-col" v-for="(item,index) in answers" :key="index">
        <div style="display:flex;margin-top:10px;">
          <img
            :src="getAvatar(item.user_id)"
            onerror="src = 'statics/default.png'"
            style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
          />
          <div class="flex-col">
            <span style="font-size: 14px;color: #333;">{{item.nickname}}</span>
            <span style="font-size: 12px;color: #9eacb6;">{{util.getShortTime(item.create_at)}}</span>
          </div>
        </div>
        <div v-html="item.content" style="margin:10px 0 10px 0;font-size: 16px;" v-highlight></div>
        <div style="display:flex;">
          <div
            style="display:flex;"
            @click="acceptAnswer(item)"
            v-show="user.uuid===ask.user_id&&!ask.hasaccept"
          >
            <img src="statics/accept.png" class="zan-cai" />
            <span class="zan-cai-num">采纳</span>
            <q-tooltip
              content-class="bg-white text-black shadow-4"
              v-show="answers.length>1"
            >每个问题只能采纳一个答案哦！</q-tooltip>
          </div>
          <div style="display:flex;" v-show="ask.hasaccept||user.uuid!==ask.user_id">
            <img src="statics/zan.png" class="zan-cai" />
            <span class="zan-cai-num">{{item.agree}}</span>
            <img src="statics/cai.png" class="zan-cai" />
            <span class="zan-cai-num">{{item.disagree}}</span>
          </div>
          <img
            src="statics/comment-focus.png"
            class="comment-icon"
            @click="item.comments_show=!item.comments_show"
          />
          <span
            class="comment-tx"
            @click="item.comments_show=!item.comments_show"
          >评论({{item.comment_num}})</span>
        </div>
        <div class="comment-list" v-show="item.comments_show">
          <div style="display:flex;">
            <q-input
              dense
              outlined
              v-model="item.comment_new"
              style="flex:1"
              counter
              maxlength="200"
            />
            <q-btn
              outline
              color="primary"
              label="发表"
              style="margin-left:10px;height:40px;"
              @click="submitComment('',item,item)"
            />
          </div>
          <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
          <div class="flex-col" v-for="(subitem,index) in item.comments" :key="index">
            <div style="display:flex;">
              <img
                :src="getAvatar(subitem.user_id)"
                onerror="src = 'statics/default.png'"
                style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
              />
              <div class="flex-col">
                <span style="font-size: 14px;color: #333;">{{subitem.nickname}}</span>
                <span
                  style="font-size: 12px;color: #9eacb6;"
                >{{util.timeUTC2Local(subitem.create_at)}}</span>
              </div>
            </div>
            <div style="margin:10px 0 10px 0;font-size:16px;">
              <span style="color:#027BE3">{{subitem.atwho===''?subitem.atwho:'@'+subitem.atwho}}</span>
              {{subitem.content}}
            </div>
            <div style="display:flex;font-size:12px;">
              <img src="statics/zan-black.png" class="reply-icon" />
              <span style="cursor: pointer;color:#7A8F9A">赞</span>
              <img
                src="statics/reply.png"
                @click="subitem.comments_show=!subitem.comments_show"
                class="reply-icon"
              />
              <span
                @click="subitem.comments_show=!subitem.comments_show"
                style="cursor: pointer;color:#7A8F9A"
              >回复</span>
            </div>
            <div style="display:flex;margin-top:10px;" v-show="subitem.comments_show">
              <q-input
                dense
                outlined
                v-model="subitem.comment_new"
                style="flex:1"
                counter
                maxlength="200"
              />
              <q-btn
                outline
                color="primary"
                label="发表"
                style="margin-left:10px;height:40px;"
                @click="submitComment(subitem.nickname,item,subitem)"
              />
            </div>
            <q-separator
              style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
              v-if="index!==item.comments.length-1"
            />
          </div>
        </div>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==answers.length-1"
        />
      </div>
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
export default {
  components: {
    GoBack,
    VueEditor,
    MyFooter,
    LoginDialog
  },
  data() {
    return {
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
    this.ask = this.$route.query.arg;
    bus.$on("logout", () => {
      toast("logout");
      this.getAnswer();
    });
    bus.$on("loginok", () => {
      this.getAnswer();
    });
    this.getAnswer();
  },
  methods: {
    acceptAnswer(item) {
      if (item.accept) return;

      this.util.loadingShow(this);

      let params = {
        askid: item.ask_id,
        answerid: item.uuid
      };
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .put(this.global.api.backurl + "ask/acceptAnswer", params, {
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
            toast("采纳成功");
            this.getAnswer();
            this.ask.hasaccept = true;
          }
        });
    },
    getAvatar(user_id) {
      return this.global.api.aliyunosshostpubread + "/" + user_id + ".jpg";
    },
    getAnswer() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        ask_id: this.ask.uuid
      };
      if (typeof this.user.uuid !== "undefined") {
        params = {
          user_id: this.user.uuid,
          ask_id: this.ask.uuid
        };
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
          console.log(111, response.data.data);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data.answers;
            for (let i = 0; i < data.length; i++) {
              data[i].comments_show = false;
              data[i].comment_new = "";
              data[i].nickname = "";
              for (let j = 0; j < data[i].comments.length; j++) {
                data[i].comments[j].comments_show = false;
                data[i].comments[j].comment_new = "";
                data[i].comments[j].nickname = "";
              }
            }
            this.answers = data;
            this.totalAnswerNum = this.answers.length;

            //我的回答
            let dataMyans = response.data.data.myanswer;
            if (dataMyans !== "") {
              dataMyans.comments_show = false;
              dataMyans.comment_new = "";
              dataMyans.nickname = "";
              for (let j = 0; j < dataMyans.comments.length; j++) {
                dataMyans.comments[j].comments_show = false;
                dataMyans.comments[j].comment_new = "";
                dataMyans.comments[j].nickname = "";
              }
              this.myanswer = dataMyans;
              this.totalAnswerNum++;
            } else {
              this.myanswer = ""; //以便退出后不显示我的回答
            }

            //采纳的回答
            let dataAccept = response.data.data.acceptanswer;
            if (dataAccept !== "") {
              dataAccept.comments_show = false;
              dataAccept.comment_new = "";
              dataAccept.nickname = "";
              for (let j = 0; j < dataAccept.comments.length; j++) {
                dataAccept.comments[j].comments_show = false;
                dataAccept.comments[j].comment_new = "";
                dataAccept.comments[j].nickname = "";
              }
              this.acceptanswer = dataAccept;
              this.totalAnswerNum++;
            }

            this.getNicknames();
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getNicknames() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;

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
            // debugger
            // console.log(3334, data);
            // debugger
            let nicks = {};
            for (let i = 0; i < data.length; i++) {
              nicks[data[i].uuid] = data[i].nick;
            }

            //对回答+评论-昵称赋值
            for (let i = 0; i < this.answers.length; i++) {
              this.answers[i].nickname = nicks[this.answers[i].user_id];

              for (let j = 0; j < this.answers[i].comments.length; j++) {
                this.answers[i].comments[j].nickname =
                  nicks[this.answers[i].comments[j].user_id];
              }
            }

            //我的回答+评论-昵称-赋值
            if (this.myanswer !== "") {
              for (let j = 0; j < this.myanswer.comments.length; j++) {
                this.myanswer.comments[j].nickname =
                  nicks[this.myanswer.comments[j].user_id];
              }
            }

            //采纳的回答+评论-昵称-赋值
            if (this.acceptanswer !== "") {
              this.acceptanswer.nickname = nicks[this.acceptanswer.user_id];
              for (let j = 0; j < this.acceptanswer.comments.length; j++) {
                this.acceptanswer.comments[j].nickname =
                  nicks[this.acceptanswer.comments[j].user_id];
              }
            }
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    submitComment(atwho, whichAnswer, whichItem) {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再评论");
        this.loginDialog.show = true;
        return;
      }

      if (whichItem.comment_new === "") {
        toast("请输入评论内容");
        return;
      }

      this.util.loadingShow(this);

      let params = {
        atwho: atwho,
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        answer_id: whichAnswer.uuid,
        content: whichItem.comment_new
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "ask/createComment", params, {
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
            toast("评论成功");
            //123
            whichAnswer.comments.push({
              atwho: atwho,
              user_id: this.user.uuid,
              ask_id: this.ask.uuid,
              answer_id: whichAnswer.uuid,
              content: whichItem.comment_new,
              comment_new: "",
              comments_show: false,
              create_at: new Date().getTime(),
              nickname: this.user.nick,
              user_id: this.user.uuid,
              uuid: response.data.data
            });
            whichAnswer.comment_num++;
            whichItem.comment_new = "";
            // whichItem.comments_show=false
          }
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
            toast("回答成功");
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
.zan-cai {
  width: 17px;
  height: 16px;
  margin-left: 20px;
  cursor: pointer;
  align-self: center;
}
.zan-cai-num {
  margin-left: 5px;
  color: $primary;
  /* font-weight: bold; */
  cursor: pointer;
}
.comment-icon {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  cursor: pointer;
  align-self: center;
}
.reply-icon {
  width: 16px;
  height: 16px;
  margin: 0 5px 0 10px;
  cursor: pointer;
}
.comment-tx {
  color: $primary;
  cursor: pointer;
  /* font-weight: bold; */
  margin-left: 5px;
}
.comment-list {
  display: flex;
  flex-direction: column;
  background: #fafafa;
  margin-top: 10px;
  padding: 20px 50px 20px 50px;
}
.myanswer-tx {
  // margin-left: 5px;
  color: $primary;
}
</style>
