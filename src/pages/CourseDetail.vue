<template>
  <q-page class="mypage">
    <GoBack />
    <div class="summary-part">
      <img
        :src="global.api.aliyunosshostpubread + '/' + course.converimg"
        class="course-cover"
        onerror="src = 'statics/default-conver.png'"
      />
      <div class="course-summary">
        <span style="font-size:24px;color:#1f2328;">{{course.classname}}</span>
        <span>{{course.classsummary}}</span>
        <div class="course-price">
          <div style="align-self: center;margin-left:10px;font-size:24px;color: orange;">
            <span v-show="course.classprice!==''">{{course.classprice}}元</span>
            <span v-show="course.classprice!==''&&course.coin!==''">+</span>
            <span v-show="course.coin!==''">{{course.coin}}积分</span>
          </div>
          <div class="course-share" @click="courseShare">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：{{course.studynum}}人</span>
        <q-btn unelevated label="立即购买" class="orenge-btn" @click="buyCourse" v-show="!isPayed" />
      </div>
    </div>
    <div class="detail-part">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="white"
        active-bg-color="white"
        align="left"
        style="background-color:#ebecec;color:black;"
      >
        <q-tab name="detail" label="课程介绍" />
        <q-tab name="chapters" label="课程目录" />
        <q-tab name="resources" label="课程资源" />
        <q-tab name="homework" label="课后作业" />
        <q-tab name="appraise" label="课程评价" />
      </q-tabs>
      <!-- <q-separator /> -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="detail">
          <div v-html="course.classdetail"></div>
        </q-tab-panel>
        <q-tab-panel name="chapters">
          <div
            subtitle
            v-for="(item,index) in videos"
            :key="index"
            @click="chapterPlay(index,item)"
            class="chapter-info"
          >
            <div class="chapter-progress">
              <img
                :src="item.finished?'statics/finished.png':'statics/ing.png'"
                style="width:25px;height:25px;margin-top:4px;"
              />
              <div
                class="chapter-progress-line"
                :style="item.finished?'background:#ff9800':'background:#26A69A'"
                v-if="index!==videos.length-1"
              ></div>
            </div>
            <div class="chapter-summary">
              <h1 style="margin:0 0 10px 0;">{{'第'+(index+1)+'节：'+item.title}}</h1>
              <div>{{item.summary}}</div>
              <q-btn
                unelevated
                label="试看"
                class="orenge-btn"
                style="width:100px;height:36px;font-size:14px;margin-top:10px;"
                v-if="item.freesee"
              />
              <q-btn
                unelevated
                color="primary"
                label="开始学习"
                style="width:100px;margin-top:10px;"
                v-if="!item.freesee"
              />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="resources">
          <div v-html="course.res_discribe===''?'该课程无额外资源':course.res_discribe"></div>
          <div
            style="display:flex;cursor: pointer;"
            @click="downloadRes"
            v-show="course.res_discribe!==''"
          >
            <img :src="setFileIcon()" style="width:32px;height:32px" />
            <span class="tx-cour-res">{{course.res_name}}</span>
          </div>
        </q-tab-panel>
        <q-tab-panel name="homework" class="flex-col">
          <div v-html="course.homework===''?'该课程无作业':course.homework"></div>
          <q-separator v-show="isWorkFinished" />
          <div class="flex-col" v-show="!isWorkFinished&&course.homework!==''">
            <VueEditor
              v-model="homework"
              useCustomImageHandler
              @image-added="handleImageAdded"
              style="height: 300px;width:100%;margin-bottom:50px;margin-top:20px;"
            />
            <span
              style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);"
            >{{textLength(homework)}} / 1000</span>
            <q-btn
              unelevated
              color="primary"
              label="提交作业"
              style="width:150px;margin-top:10px;"
              @click="submitHomeWork"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >提交作业后可阅览他人作业</q-tooltip>
            </q-btn>
          </div>
          <div class="flex-col" v-show="isWorkFinished" style="margin:30px;">
            <CommentReply
              v-show="myanswer!==''"
              answerType="myanswer"
              :answer="myanswer"
              :ask="homeworkAsk"
              :option="CROption"
              @needLogin="needLogin"
            />
            <q-separator
              style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
              v-show="myanswer!==''"
            />
            <div class="flex-col" v-for="(item,index) in answers" :key="index">
              <CommentReply
                answerType="other"
                :answer="item"
                :ask="homeworkAsk"
                :option="CROption"
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
        </q-tab-panel>
        <q-tab-panel name="appraise" class="flex-col">
          <div class="flex-col" v-show="showAppraise">
            <q-input v-model="appraiseText" filled type="textarea" counter maxlength="200" />
            <q-rating
              v-model="appraiseStar"
              max="5"
              size="2em"
              color="orange"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              no-dimming
            />
            <q-btn
              unelevated
              color="primary"
              label="提交评价"
              style="width:150px;margin-top:20px;"
              @click="submitAppraise"
            />
            <q-separator style="margin-top:20px;" v-show="allAppraises.length!==0" />
          </div>
          <div class="flex-col" v-for="(appraises,index) in allAppraises" :key="index">
            <div style="display:flex;margin-top:10px;" v-show="user.uuid===appraises.user_id">
              <img src="statics/mark.png" style="width:16px;height:16px;align-self: center;" />
              <span class="mytx-primary">我的评价</span>
            </div>
            <div style="display:flex;margin-top:10px;">
              <img
                :src="getAvatar(appraises.user_id)"
                onerror="src = 'statics/default-avatar.gif'"
                style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
              />
              <div class="flex-col">
                <span style="font-size: 14px;color: #333;">{{appraises.nick}}</span>
                <span
                  style="font-size: 12px;color: #9eacb6;"
                >{{util.getShortTime(appraises.create_at)}}</span>
              </div>
            </div>
            <q-rating
              v-model="appraises.star"
              max="5"
              size="2em"
              color="orange"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              no-dimming
              readonly
              style="margin-top:10px;"
            />
            <span style="margin:10px 0 10px 0;">{{appraises.content}}</span>
            <q-separator v-show="index!==allAppraises.length-1" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <MyFooter />
    <VideoDialog :videoDialog="videoDialog" />
    <LoginDialog :dialogData="loginDialog" />
    <PayWaitDialog
      :data="payWaitDialog"
      @finishedPay="finishedPay"
      @paywithProblem="paywithProblem"
    />
    <FeedbackDialog :dialogData="feedbackDialog" />
    <ShareDialog :props="shareDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import VideoDialog from "../components/VideoDialog";
import { openURL } from "quasar";
import LoginDialog from "../components/LoginDialog";
import GoBack from "../components/GoBack";
import { bus } from "../bus.js";
import localforage from "localforage";
import PayWaitDialog from "../components/PayWaitDialog";
import { VueEditor } from "vue2-editor";
import CommentReply from "../components/CommentReply";
import FeedbackDialog from "../components/FeedbackDialog";
import ShareDialog from "../components/ShareDialog";

export default {
  components: {
    MyFooter,
    VideoDialog,
    LoginDialog,
    GoBack,
    PayWaitDialog,
    VueEditor,
    CommentReply,
    FeedbackDialog,
    ShareDialog
  },
  data() {
    return {
      showAppraise: true,
      allAppraises: [],
      appraiseText: "",
      appraiseStar: 3,
      CROption: {
        showCai: false
      },
      tab: "detail",
      course: {},
      videos: [],
      videoDialog: {
        show: false
      },
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      isPayed: false, //是否已购买
      out_trade_no: "",
      payurl: "",
      studyProgress: {},
      payWaitDialog: {
        show: false
      },
      homework: "",
      homeworkAsk: "",
      isWorkFinished: false,
      myanswer: "",
      feedbackDialog: {
        show: false,
        title: "支付问题反馈",
        hint:'请描述您的问题'
      },
      shareDialog: {
        show: false
      },
      answers: [],
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
    // console.log(999,this.$route)

    if (typeof this.$route.query.out_trade_no !== "undefined") {
      //支付跳转
      this.queryPayResult(this.$route.query.out_trade_no);
    } else if (typeof this.$route.query.courseid !== "undefined") {
      //courseid跳转
      this.getCourseById(this.$route.query.courseid);
    } else {
      //其它情况
      if (this.$route.query.arg === "[object Object]") {
        this.course = this.global.routeCache.courseDetail;
      } else {
        this.course = this.$route.query.arg;
        this.global.routeCache.courseDetail = this.course;
      }

      this.homeworkAsk = {
        hasaccept: 1,
        reward: 0,
        user_id: this.course.author,
        uuid: this.course.uuid
      };

      if (this.$route.query.from === "myclass") {
        this.isPayed = true;
        this.tab = "chapters";
      }

      this.getVideos();
      this.getAppraise();
      this.isMyWorkFinish();
      this.checkisPayed();
    }

    bus.$on("loginok", () => {
      this.checkisPayed();
      this.isMyWorkFinish();
      this.findMyAppraises();
      this.getAnswer();
    });

    bus.$on("logout", () => {
      this.isWorkFinished = false;
      this.showAppraise = true;
      this.isPayed = false;
      this.homework = "";
      this.getAnswer();
    });
    this.getAnswer();
  },
  methods: {
    paginationClick(pageIndex) {
      // console.log(this.lastPage, pageIndex);
      if (this.lastPage === pageIndex) return;

      this.offset += this.limit * (pageIndex - this.lastPage);
      this.lastPage = pageIndex;
      this.getAnswer();
    },
    getAnswer() {
      if (typeof this.user.uuid === "undefined") return;
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        ask_id: this.course.uuid,
        limit: this.limit + "",
        offset: this.offset + "",
        user_id: this.user.uuid
      };

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

      // console.log(999,ans_com_ids)
      if (ans_com_ids.length === 0) {
        return;
      }

      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        ask_id: this.course.uuid,
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
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    needLogin() {
      this.loginDialog.show = true;
    },
    courseShare() {
      this.shareDialog.tx =
        "https://www.shenlianclass.com/#/CourseDetail?courseid=" +
        this.course.uuid;
      this.shareDialog.show = true;
    },
    paywithProblem() {
      this.payWaitDialog.show = false;
      this.feedbackDialog.event = "支付问题-课程购买";
      this.feedbackDialog.extras = {
        out_trade_no: this.out_trade_no,
        classname: this.course.classname,
        classid: this.course.uuid
      };
      this.feedbackDialog.show = true;
    },
    getCourseById(courseid) {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        courseid: courseid,
        userid: this.user.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/getCourseById", {
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
          // console.log(999, response);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            this.course = data.course[0];

            this.isPayed = data.payedCourse.length > 0 ? true : false;
            this.tab = this.isPayed ? "chapters" : this.tab;
            this.setVideos(data.videos);

            this.homeworkAsk = {
              hasaccept: 1,
              reward: 0,
              user_id: this.course.author,
              uuid: this.course.uuid
            };

            this.isWorkFinished = data.isFinishedHW;

            this.allAppraises = data.appraise;
            this.findMyAppraises();

            if (data.studyProgress.length > 0) {
              for (let i = 0; i < data.studyProgress.length; i++) {
                this.studyProgress[data.studyProgress[i].video_id] = {
                  progress: data.studyProgress[i].progress,
                  total: data.studyProgress[i].total
                };
              }

              this.setProgress();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAvatar(user_id) {
      return this.global.api.aliyunosshostpubread + "/" + user_id + ".jpg";
    },
    submitAppraise() {
      var _this = this;
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后评论");
        this.loginDialog.show = true;
        return;
      }

      if (!this.isPayed) {
        toast("学习完课程后才可以评论");
        return;
      }

      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid,
        star: this.appraiseStar + "",
        content: this.appraiseText
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "course/createAppraise", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          // console.log(444, response);
          if (response.status === 200 && response.data.code === 0) {
            toast("评论成功");
            this.showAppraise = false;
            this.allAppraises.unshift({
              user_id: this.user.uuid,
              nick: this.user.nick,
              create_at: new Date(),
              star: this.appraiseStar,
              content: this.appraiseText
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAppraise() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        course_id: this.course.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/getAppraise", {
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
            this.allAppraises = response.data.data;
            this.findMyAppraises();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    findMyAppraises() {
      if (typeof this.user.uuid !== "undefined") {
        let myappraise = null;
        for (let i = 0; i < this.allAppraises.length; i++) {
          if (this.allAppraises[i].user_id === this.user.uuid) {
            this.showAppraise = false;
            myappraise = this.allAppraises[i];
            this.allAppraises.splice(i, 1);
            this.allAppraises.unshift(myappraise);
            break;
          }
        }
      }
    },
    isMyWorkFinish() {
      if (typeof this.user.uuid === "undefined") {
        //未登录则返回
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        userid: this.user.uuid,
        courseid: this.course.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/isHomeWorkFinish", {
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
          // console.log(333, response);
          if (response.status === 200 && response.data.code === 0) {
            this.isWorkFinished = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
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
    },
    submitHomeWork() {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再回答");
        this.loginDialog.show = true;
        return;
      }

      if (!this.isPayed) {
        toast("你还未学习这门课程哦！");
        return;
      }

      if (this.textLength(this.homework) < 10) {
        toast("作业内容不能少于10个字哦");
        return;
      }

      if (this.textLength(this.homework) > 1000) {
        toast("作业内容需小于1000字");
        return;
      }
      this.util.loadingShow(this);

      let params = {
        user_id: this.user.uuid,
        ask_id: this.course.uuid, //这里填course id
        content: this.homework,
        from: "course"
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
            // toast("提交成功");
            this.isWorkFinished = true;

            toast(
              "提交成功,已到账奖励：" +
                this.global.backendConfig.answerReward +
                "积分"
            );
            //123
            this.myanswer = {
              accept: 0,
              agree: 0,
              ask_id: this.course.uuid,
              comment_new: "",
              comment_num: 0,
              comments: [],
              comments_show: false,
              content: this.homework,
              create_at: new Date().getTime(),
              disagree: 0,
              nickname: this.user.nick,
              avatar: this.user.avatar,
              user_id: this.user.uuid,
              uuid: response.data.data
            };
          }
        });
    },
    textLength(text) {
      text = text.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
    },
    downloadRes() {
      if (this.isPayed) {
        openURL(this.util.makeDownloadUrl(this, this.course.res_name));
      } else {
        toast("购买课程后可下载");
      }
    },
    setFileIcon() {
      // debugger
      if (typeof this.course.res_name === "undefined") return;
      let filetype = this.course.res_name.substring(
        this.course.res_name.length - 3
      );
      return this.util.getFileIcon(filetype);
    },
    getStudyProgress() {
      if (typeof this.user.uuid === "undefined") {
        //未登录则返回
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let videoIds = [];
      for (let i = 0; i < this.videos.length; i++) {
        videoIds.push(this.videos[i].video_id);
      }

      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid,
        video_id: encodeURIComponent(JSON.stringify(videoIds))
      };
      this.$axios
        .get(this.global.api.backurl + "studyProgress/getProgress", {
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
          //console.log(888,response);
          //console.log(8889,this.videos);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                this.studyProgress[data[i].video_id] = {
                  progress: data[i].progress,
                  total: data[i].total
                };
              }

              this.setProgress();
            }
            //console.log(555,this.videos)
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    setProgress() {
      for (let i = 0; i < this.videos.length; i++) {
        let studyProgress = this.studyProgress[this.videos[i].video_id];
        if (studyProgress.total - studyProgress.progress <= 5) {
          this.videos[i].finished = true;
        }
      }
    },
    checkisPayed() {
      if (this.isPayed || typeof this.user.uuid === "undefined") {
        //已支付或者未登陆则无需查询
        return;
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid
      };
      this.$axios
        .get(this.global.api.backurl + "course/isPayed", {
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
          // console.log(888666,response);
          if (response.status === 200 && response.data.code === 0) {
            if (response.data.data.length >= 1) {
              this.isPayed = true;
              this.tab = "chapters";
            }
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    queryPayResult(out_trade_no) {
      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        out_trade_no: out_trade_no,
        subject_type: 1 + ""
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
            toast("购买成功!");
            this.course = response.data.data.course;
            this.isPayed = true;
            this.tab = "chapters";
            this.setVideos(response.data.data.videos);
            this.getStudyProgress();

            this.homeworkAsk = {
              hasaccept: 1,
              reward: 0,
              user_id: this.course.author,
              uuid: this.course.uuid
            };

            this.isMyWorkFinish();
            this.getAppraise();
          } else {
            if (response.data.code === 6006) {
              toast("请完成支付后点击该操作");
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setVideos(videos) {
      for (let i = 0; i < videos.length; i++) {
        videos[i].finished = false;
      }
      this.videos = videos;
    },
    buyCourse() {
      if (typeof this.user.uuid === "undefined") {
        this.out_trade_no = "";
        this.payurl = "";
        toast(this.$t("login2buy"));
        this.loginDialog.show = true;
        return;
      }

      if (this.course.classprice !== "" && this.course.coin === "") {
        //只支持现金付款
        this.buyUseAliPay(this.course.classprice);
      } else if (this.course.classprice === "" && this.course.coin !== "") {
        //只支持积分付款
        this.buyUseCoin();
      } else {
        //现金+积分付款
      }
    },
    buyUseCoin() {
      if (this.user.coin - parseFloat(this.course.coin) < 0) {
        let yuan=parseInt(parseInt(this.course.coin)/10)
        this.$q
          .dialog({
            title: '积分余额不足<span style="color:#959595;font-size:14px;"> 当前余额:'+this.user.coin+'</span>',
            message:
              '用支付宝支付只需<span class="text-orange"> '+yuan+'元 </span>即可购买该课程',
            html: true,
            ok:'确定',
            cancel:'取消'
          })
          .onOk(() => {
            this.buyUseAliPay(yuan);
          })
          .onCancel(() => {
            // console.log('Cancel')
          });
        return;
      }

      this.util.loadingShow(this);
      let params = {
        user_id: this.user.uuid,
        course_id: this.course.uuid,
        coin: this.course.coin
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "course/addPayedCourse", params, {
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
            if (response.data.data === "ok") {
              toast("购买成功");
              this.isPayed = true;
              this.tab = "chapters";
              let userData = JSON.parse(JSON.stringify(this.user));
              userData.coin -= parseInt(this.course.coin);
              this.user = userData;
              localforage.setItem("user", JSON.stringify(this.user));
            }
          }
        });
    },
    finishedPay() {
      this.payWaitDialog.show = false;
      this.queryPayResult(this.out_trade_no);
    },
    buyUseAliPay(price) {
      this.payWaitDialog.show = true;

      //已生成过支付链接直接打开
      if (this.out_trade_no !== "" && this.payurl !== "") {
        openURL(this.payurl);
        return;
      }

      this.util.loadingShow(this);
      let params = {
        user_id: this.user.uuid,
        subject_title: this.course.classname,
        subject_id: this.course.uuid,
        subject_type: 1 + "", //购买课程
        total_amount: price,
        return_url: "https://www.shenlianclass.com/#/CourseDetail"
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
            //console.log(response.data.data);
            const result = response.data.data;
            //支付链接缓存，离开该页面失效
            this.out_trade_no = result.out_trade_no;
            this.payurl = result.payurl;
            openURL(result.payurl);
          }
        });
    },
    chapterPlay(index, item) {
      if (this.isPayed || item.freesee) {
        this.videoDialog.currentPlay = index;
        this.videoDialog.videos = this.videos;
        // if (typeof this.studyProgress[item.video_id] !== "undefined") {
        this.videoDialog.studyProgress = this.studyProgress;
        // }
        this.videoDialog.course_id = this.course.uuid;
        this.videoDialog.course_payed = this.isPayed;
        this.videoDialog.show = true;
      } else {
        this.buyCourse();
      }
    },
    getVideos() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        course_id: this.course.uuid + ""
      };
      this.$axios
        .get(this.global.api.backurl + "video/getVideos", {
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
          //console.log(111,response);
          if (response.status === 200 && response.data.code === 0) {
            this.setVideos(response.data.data);
            this.getStudyProgress();
          }
        });
    }
  }
};
</script>
<style scoped>
.detail-part {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 50px 0;
  /* height: 800px; */
  flex-direction: column;
}
.summary-part {
  width: 100%;
  max-width: 1200px;
  height: 355px;
  display: flex;
  background-color: white;
  margin: 5px 0 30px 0;
}

.orenge-btn {
  align-self: flex-start;
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  background-image: linear-gradient(to right, #ff7a00, #fe560a);
  color: white;
}
.study-chapter {
  align-self: center;
  margin-left: 10px;
  background-image: linear-gradient(to right, #ff7a00, #fe560a);
  color: white;
}
.chapter-info {
  display: flex;
  margin-top: 5px;
}
.chapter-info:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
}
.chapter-progress {
  display: flex;
  flex-direction: column;
}
.chapter-summary {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 10px;
}
.chapter-progress-line {
  width: 1px;
  flex: 1;
  background: #ff9800;
  align-self: center;
  margin: 5px 0 5px 0;
}
.tx-cour-res {
  font-size: 18px;
  align-self: center;
  color: blue;
  text-decoration: underline;
}
</style>
