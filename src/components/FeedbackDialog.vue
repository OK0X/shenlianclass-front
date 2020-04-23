<template>
  <q-dialog v-model="dialogData.show">
    <div class="f-dialog">
      <div class="text-h6" style="margin:10px 0 0 10px">{{dialogData.title}}</div>
      <q-input
        v-model="problemTx"
        filled
        type="textarea"
        :placeholder="dialogData.hint"
        style="margin:10px;"
        counter
        maxlength="500"
      />
      <span style="align-self:center;">您也可用微信扫描下方二维码添加我们的工作人员微信，以便获得更及时的答复。</span>
      <img src="statics/qiyeweixin.jpg" style="width:130px;height:130px;align-self:center;" />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="提交" @click="onOk" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
export default {
  props: ["dialogData"],
  data() {
    return {
      problemTx: ""
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
    onOk() {
      if (this.problemTx === "") {
        toast("请描述你的问题");
        return;
      }

      this.dialogData.show=false

      this.util.loadingShow(this);
      let params = {
        user_id: this.user.uuid,
        mobile:this.user.mobile,
        event:this.dialogData.event,
        describe:this.problemTx,
        extras:JSON.stringify(this.dialogData.extras)
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .post(this.global.api.backurl + "user/createFeedback", params, {
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
            toast("提交成功，我们将尽快给您答复！");
          } 
        });
    }
  }
};
</script>
<style scoped>
.f-dialog {
  background: white;
  min-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
