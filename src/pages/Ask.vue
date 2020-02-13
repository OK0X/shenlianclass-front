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
        <q-tab name="all" label="全部问答" />
        <q-tab name="highcoin" label="悬赏问答" />
        <q-tab name="myask" label="我的提问" />
        <q-tab name="creatask" label="新建提问" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="all">
          <div class="flex-col" v-for="(item,index) in asks" :key="index">
            <div style="display:flex;justify-content: space-between;">
              <div style="display:flex;">
                <img src="statics/coin.png" class="reward-icon" v-if="item.reward" />
                <span class="reward-num" v-if="item.reward">{{item.reward_num}}</span>
                <span class="ask-tx" @click="toAskDetail(item)">{{item.title}}</span>
              </div>
              <!-- <div style="color: #999;margin-right:20px;line-height: 25px;" v-html="item.detail"></div> -->
              <div style="display:flex;color:#bbb;margin-top:5px;">
                <span>{{util.getShortTime(item.create_at)}}</span>
                <span style="width:1px;background: rgba(0, 0, 0, 0.12);margin:2px 10px 2px 10px;"></span>
                <span>{{item.answer_num}} 回答</span>
              </div>
            </div>
            <q-separator
              style="margin:5px 0 5px 0;background: rgba(0, 0, 0, 0.06);"
              v-if="index!==asks.length-1"
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="highcoin">
          <div class="flex-col" v-for="(item,index) in awardasks" :key="index">
            <div style="display:flex;justify-content: space-between;">
              <div style="display:flex;">
                <img src="statics/coin.png" class="reward-icon" v-if="item.reward" />
                <span class="reward-num" v-if="item.reward">{{item.reward_num}}</span>
                <span class="ask-tx" @click="toAskDetail(item)">{{item.title}}</span>
              </div>
              <!-- <div style="color: #999;margin-right:20px;line-height: 25px;" v-html="item.detail"></div> -->
              <div style="display:flex;color:#bbb;margin-top:5px;">
                <span>{{util.getShortTime(item.create_at)}}</span>
                <span style="width:1px;background: rgba(0, 0, 0, 0.12);margin:2px 10px 2px 10px;"></span>
                <span>{{item.answer_num}} 回答</span>
              </div>
            </div>
            <q-separator style="margin:5px 0 5px 0;" v-if="index!==awardasks.length-1" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="myask">
          <div class="flex-col" v-for="(item,index) in myasks" :key="index">
            <div style="display:flex;justify-content: space-between;">
              <div style="display:flex;">
                <img src="statics/coin.png" class="reward-icon" v-if="item.reward" />
                <span class="reward-num" v-if="item.reward">{{item.reward_num}}</span>
                <span class="ask-tx" @click="toAskDetail(item)">{{item.title}}</span>
              </div>
              <!-- <div style="color: #999;margin-right:20px;line-height: 25px;" v-html="item.detail"></div> -->
              <div style="display:flex;color:#bbb;margin-top:5px;">
                <span>{{util.getShortTime(item.create_at)}}</span>
                <span style="width:1px;background: rgba(0, 0, 0, 0.12);margin:2px 10px 2px 10px;"></span>
                <span>{{item.answer_num}} 回答</span>
              </div>
            </div>
            <q-separator style="margin:5px 0 5px 0;" v-if="index!==myasks.length-1" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="creatask" class="flex-col">
          <q-input
            v-model="asktitle"
            :dense="true"
            counter
            maxlength="50"
            placeholder="一句话完整描述你的问题"
          />
          <VueEditor
            placeholder="详细说明你的问题，以便获得更好的回答（选填）"
            v-model="askDetail"
            useCustomImageHandler
            @image-added="handleImageAdded"
            style="height: 300px;width:100%;margin:10px 0 50px 0;"
          />
          <span style="align-self: flex-end;color: rgba(0, 0, 0, 0.54);">{{detailLength()}} / 1000</span>
          <div style="display:flex;">
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
          <q-btn unelevated color="primary" label="提交" style="width:100px;" @click="createAsk" />
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
import LoginDialog from "../components/LoginDialog";

export default {
  components: {
    MyFooter,
    VueEditor,
    LoginDialog
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
    this.getAsks();
    this.getAwardAsks();
    this.getMyAsks();
  },
  methods: {
    toAskDetail(item) {
      this.$router.push({
        path: "/AskDetail",
        query: {
          arg: item
        }
      });
    },
    getMyAsks() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        user_id: this.user.uuid
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
            this.myasks = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getAwardAsks() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        reward: 1 + ""
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
            this.awardasks = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    getAsks() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = null;
      this.$axios
        .get(this.global.api.backurl + "ask/getAsk", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.asks = response.data.data;
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

      this.util.loadingShow(this)

      let params = {
        user_id: this.user.uuid,
        title: this.asktitle,
        detail: this.askDetail,
        reward: this.reward,
        reward_num: this.rewardNum
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
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
          this.util.loadingHide(this)
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

            this.asktitle=''
            this.askDetail=''
          }
        });
    },
    detailLength() {
      let text = this.askDetail.replace(/<\/?[^>]+(>|$)/g, "");
      let len = text.length;
      return len;
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
<style scoped>
.ask-tx {
  color: #3066b3;
  line-height: 35px;
}
.ask-tx:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
  text-decoration: underline;
}
.reward-icon {
  width: 13px;
  height: 12px;
  margin: 5px;
  align-self: center;
}
.reward-num {
  color: #e7412b;
  margin-right: 20px;
  line-height: 35px;
}
</style>
