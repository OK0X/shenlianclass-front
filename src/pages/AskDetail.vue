<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <span class="ask-title">{{ask.title}}</span>
      <div v-html="ask.detail" v-highlight></div>
      <q-btn outline color="primary" label="我来回答" style="width: 100px;" @click="ianswer" />
      <VueEditor
        v-show="editorShow"
        v-model="myanswer"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 300px;width:100%;margin:10px 0 50px 0;"
      />
      <q-btn
        outline
        color="primary"
        label="提交回答"
        style="width: 100px;align-self: flex-end;margin-top:10px;"
        @click="submitAnswer"
        v-show="editorShow"
      />
      <div style="display:flex;margin:20px 0 20px 0;">
        <span style="font-size:18px;color: #7a8f9a;font-weight: 700;">{{this.answers.length}}个回答</span>
        <div
          style="flex:1;height:1px;background: rgba(0, 0, 0, 0.06);align-self: center;margin-left:10px;"
        ></div>
      </div>
      <div class="flex-col" v-for="(item,index) in answers" :key="index">
        <div style="display:flex;">
          <img
            src="statics/default.png"
            style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
          />
          <div class="flex-col">
            <span style="font-size: 14px;color: #333;font-weight: 700;">{{item.nickname}}</span>
            <span style="font-size: 12px;color: #9eacb6;">{{util.timeUTC2Local(item.create_at)}}</span>
          </div>
        </div>
        <div v-html="item.content" style="margin:10px 0 10px 0;" v-highlight></div>
        <div style="display:flex;">
          <img src="statics/accept.png" class="zan-cai" v-show="user.uuid===ask.user_id"/>
          <span class="zan-cai-num" v-show="user.uuid===ask.user_id">采纳</span>
          <img src="statics/zan.png" class="zan-cai" v-show="user.uuid!==ask.user_id"/>
          <span class="zan-cai-num" v-show="user.uuid!==ask.user_id">{{item.agree}}</span>
          <img src="statics/cai.png" class="zan-cai" v-show="user.uuid!==ask.user_id"/>
          <span class="zan-cai-num" v-show="user.uuid!==ask.user_id">{{item.disagree}}</span>
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
            <q-input dense outlined v-model="item.comment_new" style="flex:1" counter maxlength="200"/>
            <q-btn
              outline
              color="primary"
              label="发表"
              style="margin-left:10px;height:40px;"
              @click="submitComment('',item,item.comment_new)"
            />
          </div>
          <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
          <div class="flex-col" v-for="(subitem,index) in item.comments" :key="index">
            <div style="display:flex;">
              <img
                src="statics/default.png"
                style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
              />
              <div class="flex-col">
                <span style="font-size: 14px;color: #333;font-weight: 700;">{{subitem.nickname}}</span>
                <span style="font-size: 12px;color: #9eacb6;">{{util.timeUTC2Local(subitem.create_at)}}</span>
              </div>
            </div>
            <div style="margin:10px 0 10px 0;">
              <span style="color:#027BE3">{{subitem.atwho===''?subitem.atwho:'@'+subitem.atwho}}</span>
              {{subitem.content}}
              </div>
            <div style="display:flex;font-size:12px;">
              <img src="statics/zan-black.png" class="reply-icon" />
              <span>赞</span>
              <img
                src="statics/reply.png"
                @click="subitem.comments_show=!subitem.comments_show"
                class="reply-icon"
              />
              <span @click="subitem.comments_show=!subitem.comments_show" style="cursor: pointer;">回复</span>
            </div>
            <div style="display:flex;margin-top:10px;" v-show="subitem.comments_show">
              <q-input dense outlined v-model="subitem.comment_new" style="flex:1" counter maxlength="200"/>
              <q-btn
                outline
                color="primary"
                label="发表"
                style="margin-left:10px;height:40px;"
                @click="submitComment('testnick',item,subitem.comment_new)"
              />
            </div>
            <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" v-if="index!==item.comments.length-1"/>
          </div>
        </div>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==answers.length-1"
        />
      </div>
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    GoBack,
    VueEditor,
    MyFooter
  },
  data() {
    return {
      ask: "",
      editorShow: false,
      myanswer: "",
      answers: [
        // {
        //   nickname: "昵称",
        //   create_at: "2020-02-09 12:12:12",
        //   content:
        //     "dfaf反对反对反对反对反对反对反对反对反对反<br>对反对反对反对反对反对反对反对反对反对反对",
        //   accept:false,
        //   agree: 128,
        //   disagree: 0,
        //   comment_num: 22,
        //   comments_show: false,
        //   comment_new: "",
        //   comments: [
        //     {
        //       nickname: "昵称",
        //       create_at: "2020-02-09 12:12:12",
        //       atwho:'@小宝',
        //       content: "评论内容",
        //       comments_show: false,
        //       comment_new: ""
        //     },
        //     {
        //       nickname: "昵称",
        //       create_at: "2020-02-09 12:12:12",
        //       atwho:'',
        //       content: "评论内容",
        //       comments_show: false,
        //       comment_new: ""
        //     }
        //   ]
        // }
      ]
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
    console.log(this.ask);
    this.getAnswer()
  },
  methods: {
    getAnswer(){
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params = {
        ask_id: this.ask.uuid
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
            
            let data = response.data.data;
            for(let i=0;i<data.length;i++){
              data[i].comments_show=false
              data[i].comment_new=''
              data[i].nickname=''
              for(let j=0;j<data[i].comments.length;j++){
                data[i].comments[j].comments_show=false
                data[i].comments[j].comment_new=''
                data[i].comments[j].nickname=''
              }
            }

            console.log(999666,data);
            this.answers=data
            this.getNicknames()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNicknames(){
      let timestamp = new Date().getTime() + 1000 * 60 * 1;

      let userids=[]
      for(let i=0;i<this.answers.length;i++){
        userids.push(this.answers[i].user_id)
      }
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
            console.log(333,data);
            let nicks={}
            for(let i=0;i<data.length;i++){

              nicks[data[i].uuid]=data[i].nick

              
            }

            for(let i=0;i<this.answers.length;i++){

              this.answers[i].nickname=nicks[this.answers[i].user_id]

              for(let j=0;j<this.answers[i].comments.length;j++){
                
                this.answers[i].comments[j].nickname=nicks[this.answers[i].comments[j].user_id]
              }
            }

          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitComment(atwho,whichAnswer,content) {
      if (content === "") {
        toast("请输入评论内容");
        return;
      }

      this.$q.loading.show({
        message: this.$t("submiting"),
        spinnerSize: 50
      });

      let params = {
        atwho:atwho,
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        answer_id:whichAnswer.uuid,
        content: content
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
          this.$q.loading.hide();
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("评论成功");
          }
        });
    },
    submitAnswer() {
      if (this.myanswer === "") {
        toast("请输入你的回答");
        return;
      }

      this.$q.loading.show({
        message: this.$t("submiting"),
        spinnerSize: 50
      });

      let params = {
        user_id: this.user.uuid,
        ask_id: this.ask.uuid,
        content: this.myanswer
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
          this.$q.loading.hide();
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("回答成功");
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
          // this.$q.loading.hide();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
<style scoped>
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
  align-self: flex-end;
}
.zan-cai-num {
  margin-left: 5px;
  color: #027be3;
  font-weight: bold;
}
.comment-icon {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  cursor: pointer;
}
.reply-icon {
  width: 18px;
  height: 18px;
  margin: 0 5px 0 10px;
  cursor: pointer;
}
.comment-tx {
  color: #027be3;
  cursor: pointer;
  font-weight: bold;
  margin-left: 5px;
}
.comment-list {
  display: flex;
  flex-direction: column;
  background: #fafafa;
  margin-top: 10px;
  padding: 20px 50px 20px 50px;
}
</style>
