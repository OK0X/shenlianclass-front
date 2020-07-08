<template>
  <q-page class="mypage">
    <div class="page-content" style="padding:0px;">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="white"
        active-bg-color="white"
        align="left"
        style="background-color:#ebecec;color:black;"
      >
        <q-tab name="all" label="全部帖子" />
        <q-tab name="highcoin" label="悬赏贴" />
        <q-tab name="myask" label="我的帖子" />
        <q-tab name="creatask" label="新建帖子" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="all" class="flex-col">
          <AskItem :asks="asks" />
          <q-pagination
            v-if="pageMaxAll > 1"
            v-model="currentPageAll"
            :max="pageMaxAll"
            :direction-links="true"
            style="margin-top:30px;align-self:center;"
            @input="paginAllClick"
          ></q-pagination>
        </q-tab-panel>
        <q-tab-panel name="highcoin" class="flex-col">
          <AskItem :asks="awardasks" />
          <q-pagination
            v-if="pageMaxHcoin > 1"
            v-model="currentPageHcoin"
            :max="pageMaxHcoin"
            :direction-links="true"
            style="margin-top:30px;align-self:center;"
            @input="paginHcoinClick"
          ></q-pagination>
        </q-tab-panel>
        <q-tab-panel name="myask" class="flex-col">
          <AskItem :asks="myasks" />
          <q-pagination
            v-if="pageMaxMy > 1"
            v-model="currentPageMy"
            :max="pageMaxMy"
            :direction-links="true"
            style="margin-top:30px;align-self:center;"
            @input="paginMyClick"
          ></q-pagination>
        </q-tab-panel>
        <q-tab-panel name="creatask" class="flex-col">
          <q-input v-model="asktitle" :dense="true" counter maxlength="50" placeholder="标题" />
          <VueEditor
            placeholder="内容"
            v-model="askDetail"
            useCustomImageHandler
            @image-added="handleImageAdded"
            style="height: 300px;width:100%;margin:10px 0 50px 0;"
          />
          <span style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);">{{detailLength()}} / 3000</span>
          <div style="display:flex;margin-top:20px;">
            <span>帖子类别：</span>
            <div>
            <img src="statics/question.png" style="width:18px;height:18px;cursor: pointer;" />
            <q-tooltip content-class="bg-white text-black shadow-4">问答贴可以发布悬赏，不显示发布者，时间和阅读量；普通贴不能发布悬赏，显示发布者，时间和阅读量。</q-tooltip>
            </div>
          </div>
          <div class="q-gutter-sm">
            <q-radio v-model="postType" val="ask" label="问答贴" />
            <q-radio v-model="postType" val="general" label="普通贴" />
          </div>
          <div style="display:flex;" v-show="postType==='ask'">
            <q-checkbox v-model="reward" label="悬赏" />
            <img
              src="statics/coin.png"
              style="width:13px;height:12px;margin:5px;align-self:center;"
            />
            <q-input
              v-model.number="rewardNum"
              type="number"
              dense
              style="width: 50px;height:20px;"
            />
          </div>
          <q-btn unelevated color="primary" label="提交" style="width:100px;margin-top:20px;" @click="createAsk" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <MyFooter />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import { VueEditor } from "vue2-editor";
import localforage from "localforage";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

import AskItem from "../components/AskItem";
import LoginDialog from "../components/LoginDialog";
export default {
  components: {
    MyFooter,
    VueEditor,
    LoginDialog,
    AskItem
  },
  data() {
    return {
      tab: "all",
      asktitle: "",
      askDetail: "",
      reward: false,
      rewardNum: 10,
      asks: [],
      awardasks: [],
      myasks: [],
      loginDialog: {
        show: false,
        title: "快捷登陆"
      },
      pageMaxAll: 1,
      currentPageAll: 1,
      pageMaxHcoin: 1,
      currentPageHcoin: 1,
      pageMaxMy: 1,
      currentPageMy: 1,
      lastPageAll: 1,
      lastPageHcoin: 1,
      lastPageMy: 1,
      offsetALL: 0,
      offsetHcoin: 0,
      offsetMy: 0,
      limit: 20,
      postType: "ask"
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
    if (typeof this.global.routeCache.AskAll !== "undefined") {
      //all
      this.asks = this.global.routeCache.AskAll.asks;
      const total1 = this.global.routeCache.AskAll.total[0].total;
      this.pageMaxAll = Math.ceil(total1 / this.limit);
    }

    this.getAsks();
    this.getAwardAsks();
    this.getMyAsks();
  },
  methods: {
    paginMyClick(pageIndex) {
      if (this.lastPageMy === pageIndex) return;

      this.offsetMy += this.limit * (pageIndex - this.lastPageMy);
      this.lastPageMy = pageIndex;
      this.getMyAsks();
    },
    paginAllClick(pageIndex) {
      if (this.lastPageAll === pageIndex) return;

      this.offsetALL += this.limit * (pageIndex - this.lastPageAll);
      this.lastPageAll = pageIndex;
      this.getAsks();
    },
    paginHcoinClick(pageIndex) {
      if (this.lastPageHcoin === pageIndex) return;

      this.offsetHcoin += this.limit * (pageIndex - this.lastPageHcoin);
      this.lastPageHcoin = pageIndex;
      this.getAwardAsks();
    },
    getMyAsks() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        user_id: this.user.uuid,
        limit: this.limit + "",
        offset: this.offsetMy + ""
      };
      this.$axios
        .get(this.global.api.backurl + "ask/getAsk", {
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.myasks = response.data.data.asks;
            const total = response.data.data.total[0].total;
            this.pageMaxMy = Math.ceil(total / this.limit);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getAwardAsks() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        reward: 1 + "",
        limit: this.limit + "",
        offset: this.offsetHcoin + ""
      };
      this.$axios
        .get(this.global.api.backurl + "ask/getAsk", {
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.awardasks = response.data.data.asks;
            const total = response.data.data.total[0].total;
            this.pageMaxHcoin = Math.ceil(total / this.limit);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getAsks() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        limit: this.limit + "",
        offset: this.offsetALL + ""
      };
      this.$axios
        .get(this.global.api.backurl + "ask/getAsk", {
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
          // console.log('getAsks------------',response);
          if (response.status === 200 && response.data.code === 0) {
            this.global.routeCache.AskAll = response.data.data;
            this.asks = this.global.routeCache.AskAll.asks;
            const total = this.global.routeCache.AskAll.total[0].total;
            this.pageMaxAll = Math.ceil(total / this.limit);
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    createAsk() {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再提问");
        this.loginDialog.show = true;
        return;
      }
      if (this.asktitle === "") {
        toast("请输入你的问题");
        return;
      }

      if (this.reward && this.user.coin - this.rewardNum < 0) {
        toast("您的积分余额不足");
        return;
      }

      if(this.postType!=='ask'&&this.askDetail.length < 20){
        toast('帖子内容太少哦')
        return
      }

      this.util.loadingShow(this);

      let params = {
        user_id: this.user.uuid,
        title: this.asktitle,
        detail: this.askDetail,
        reward: this.reward,
        reward_num: this.rewardNum,
        type:this.postType==='ask'?0:1
      };
      // console.log(111,this.user)
      // console.log(1111,this.rewardNum)
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "ask/createAsk", params, {
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
            toast("发布成功");
            this.asks.unshift({
              answer_num: 0,
              create_at: new Date().getTime(),
              detail: this.askDetail,
              reward: this.reward,
              reward_num: this.rewardNum,
              user_id: this.user.uuid,
              title: this.asktitle,
              uuid: response.data.data
            });
            this.myasks.unshift({
              answer_num: 0,
              create_at: new Date().getTime(),
              detail: this.askDetail,
              reward: this.reward,
              reward_num: this.rewardNum,
              user_id: this.user.uuid,
              title: this.asktitle,
              uuid: response.data.data
            });

            if (this.reward) {
              this.awardasks.unshift({
                answer_num: 0,
                create_at: new Date().getTime(),
                detail: this.askDetail,
                reward: this.reward,
                reward_num: this.rewardNum,
                user_id: this.user.uuid,
                title: this.asktitle,
                uuid: response.data.data
              });
            }

            this.asktitle = "";
            this.askDetail = "";

            //如果是悬赏问答更新coin值
            if (params.reward) {
              let userData = JSON.parse(JSON.stringify(this.user));
              userData.coin -= params.reward_num;
              this.user = userData;
              localforage.setItem("user", JSON.stringify(this.user));
            }
          }
        });
    },
    detailLength() {
      let text = this.askDetail.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
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
<style scoped>
</style>
