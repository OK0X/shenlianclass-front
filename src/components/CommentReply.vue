<template>
  <div class="flex-col">
    <div style="display:flex;" v-show="answerType==='myanswer'">
      <img src="statics/mark.png" style="width:16px;height:16px;align-self: center;" />
      <span class="mytx-primary">我的回答</span>
    </div>
    <div style="display:flex;" v-show="answerType==='acceptanswer'">
      <img src="statics/mark.png" style="width:16px;height:16px;align-self: center;" />
      <span class="mytx-primary">已采纳</span>
    </div>
    <div style="display:flex;margin-top:10px;">
      <img
        :src="getAvatar(answer.user_id)"
        onerror="src = 'statics/default-avatar.gif'"
        style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
      />
      <div class="flex-col">
        <span style="font-size: 14px;color: #333;">{{answer.nickname}}</span>
        <span style="font-size: 12px;color: #9eacb6;">{{util.getShortTime(answer.create_at)}}</span>
      </div>
    </div>
    <div v-html="answer.content" style="margin:10px 0 10px 50px;font-size: 16px;" v-highlight></div>
    <div style="display:flex;margin:0 0 10px 50px;" v-show="answer.accept&&answerType==='myanswer'">
      <img src="statics/choosed.png" style="width:20px;height:20px;" />
      <span class="mytx-tip">本回答已被提问者采纳</span>
    </div>
    <div style="display:flex;">
      <div
        style="display:flex;"
        @click="acceptAnswer(answer)"
        v-show="user.uuid===ask.user_id&&!ask.hasaccept"
      >
        <img src="statics/accept.png" class="zan-cai" />
        <span class="zan-cai-num">采纳</span>
        <q-tooltip content-class="bg-white text-black shadow-4">每个问题只能采纳一个答案哦！</q-tooltip>
      </div>
      <div style="display:flex;" v-show="ask.hasaccept||user.uuid!==ask.user_id">
        <img
          :src="answer.zan?'statics/zan-click.png':'statics/zan-black.png'"
          class="zan-cai"
          @click="zancaiAnswer(answer,'zan')"
        />
        <span class="zan-cai-num">{{answer.agree}}</span>
        <img
          v-show="option.showCai"
          :src="answer.cai?'statics/cai-click.png':'statics/cai-black.png'"
          class="zan-cai"
          style="margin-left: 30px;"
          @click="zancaiAnswer(answer,'cai')"
        />
        <span class="zan-cai-num" v-show="option.showCai">{{answer.disagree}}</span>
      </div>
      <img
        src="statics/reply.png"
        class="comment-icon"
        @click="answer.comments_show=!answer.comments_show"
      />
      <span
        class="comment-tx"
        @click="answer.comments_show=!answer.comments_show"
      >评论({{answer.comment_num}})</span>
    </div>
    <div class="comment-list" v-show="answer.comments_show">
      <div style="display:flex;">
        <q-input dense outlined v-model="answer.comment_new" style="flex:1" counter maxlength="200" />
        <q-btn
          outline
          color="primary"
          label="发表"
          style="margin-left:10px;height:40px;"
          @click="submitComment('',answer,answer)"
        />
      </div>
      <q-separator style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);" />
      <div class="flex-col" v-for="(subitem,index) in answer.comments" :key="index">
        <div style="display:flex;">
          <img
            :src="getAvatar(subitem.user_id)"
            onerror="src = 'statics/default-avatar.gif'"
            style="width:40px;height:40px;border-radius: 50%;margin-right:10px;"
          />
          <div class="flex-col">
            <span style="font-size: 14px;color: #333;">{{subitem.nickname}}</span>
            <span style="font-size: 12px;color: #9eacb6;">{{util.timeUTC2Local(subitem.create_at)}}</span>
          </div>
        </div>
        <div style="margin:10px 0 10px 50px;font-size:16px;">
          <span style="color:#027BE3">{{subitem.atwho===''?subitem.atwho:'@'+subitem.atwho}}</span>
          {{subitem.content}}
        </div>
        <div style="display:flex;font-size:12px;">
          <img
            :src="subitem.zan?'statics/zan-click.png':'statics/zan-black.png'"
            class="reply-icon"
            @click="zanComments(subitem)"
          />
          <span style="cursor: pointer;color:#7A8F9A">{{subitem.zan?'已赞':'赞'}}</span>
          <img
            src="statics/reply.png"
            @click="subitem.comments_show=!subitem.comments_show"
            class="reply-icon"
            style="margin-left: 30px;"
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
            @click="submitComment(subitem.nickname,answer,subitem)"
          />
        </div>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-show="index!==answer.comments.length-1"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["answerType", "answer", "ask", "option"],
  data() {
    return {
      zcClickNum: {}
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
  mounted() {},
  methods: {
    getAvatar(user_id) {
      return this.global.api.aliyunosshostpubread + "/" + user_id + ".jpg";
    },
    acceptAnswer(answer) {
      if (answer.accept) return;

      this.util.loadingShow(this);

      let params = {
        ask: encodeURIComponent(JSON.stringify(this.ask)),
        answer: encodeURIComponent(JSON.stringify(answer))
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
          if (response.status === 200 && response.data.code === 0) {
            toast("采纳成功");
            this.$emit("acceptAnswerOK");

          }
        });
    },
    zancaiAnswer(answer, zc) {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆再操作");
        this.$emit('needLogin')
        return;
      }

      if (this.zcClickNum[answer.uuid] > 3) {
        toast("您变心太快，暂不能进行操纵了哦");
        return;
      }

      let params = {
        answer_id: answer.uuid,
        ask_id: this.ask.uuid,
        ans_com_id: answer.uuid,
        user_id: this.user.uuid
      };

      if (zc === "zan") {
        if (answer.cai) {
          toast("您已经踩过了");
          return;
        }
        params.agree = answer.zan ? "-1" : "1";
      } else {
        if (answer.zan) {
          toast("您已经赞过了");
          return;
        }
        params.disagree = answer.cai ? "-1" : "1";
      }

      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(this.global.api.backurl + "ask/answerZanCai", params, {
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
            if (typeof this.zcClickNum[answer.uuid] === "undefined") {
              this.zcClickNum[answer.uuid] = 0;
            } else {
              this.zcClickNum[answer.uuid]++;
            }

            if (zc === "zan") {
              answer.zan = !answer.zan;
              toast(answer.zan ? "点赞成功" : "已取消");
              answer.agree += answer.zan ? 1 : -1;
            } else {
              answer.cai = !answer.cai;
              toast(answer.cai ? "评价成功" : "已取消");
              answer.disagree += answer.cai ? 1 : -1;
            }
          }
        });
    },
    zanComments(comment) {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆再操作");
        this.$emit('needLogin')
        return;
      }

      if (this.zcClickNum[comment.uuid] > 3) {
        toast("您变心太快，暂不能进行操纵了哦");
        return;
      }

      let params = {
        ask_id: this.ask.uuid,
        ans_com_id: comment.uuid,
        user_id: this.user.uuid,
        agree: comment.zan ? "0" : "1"
      };

      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(this.global.api.backurl + "ask/zanComments", params, {
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

            if (typeof this.zcClickNum[comment.uuid] === "undefined") {
              this.zcClickNum[comment.uuid] = 0;
            } else {
              this.zcClickNum[comment.uuid]++;
            }

            comment.zan = !comment.zan;
            toast(comment.zan ? "点赞成功" : "已取消");
          }
        });
    },
    submitComment(atwho, whichAnswer, whichItem) {
      if (typeof this.user.uuid === "undefined") {
        toast("请先登陆后再评论");
        this.$emit('needLogin')
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
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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

          if (response.status === 200 && response.data.code === 0) {
            toast("评论成功");

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
              uuid: response.data.data,
              zan:false
            });
            whichAnswer.comment_num++;
            whichItem.comment_new = "";

          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.zan-cai {
  width: 17px;
  height: 16px;
  margin-left: 50px;
  cursor: pointer;
  align-self: center;
}
.zan-cai-num {
  margin-left: 5px;
  color: #7a8f9a;
  /* font-weight: bold; */
  // cursor: pointer;
}
.comment-icon {
  width: 20px;
  height: 20px;
  margin-left: 30px;
  cursor: pointer;
  align-self: center;
}
.reply-icon {
  width: 16px;
  height: 16px;
  margin: 0 5px 0 50px;
  cursor: pointer;
}
.comment-tx {
  color: #7a8f9a;
  // cursor: pointer;
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
</style>
