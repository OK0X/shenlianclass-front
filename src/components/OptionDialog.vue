<template>
  <q-dialog v-model="data.show">
    <div class="dialog">
      <div class="text-h6" style="margin:10px 0 0 10px">{{data.title}}</div>
      <div class="q-gutter-sm" style="margin:10px;">
        <q-radio
          style="margin:10px;"
          v-model="status"
          :val="item.val"
          :label="item.label"
          v-for="(item,index) in data.item.radios"
          :key="index"
        />
      </div>
      <span style="margin-left:10px;">备注原因(可选):</span>
      <q-input v-model="reason" style="margin:10px;" dense />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="确定" v-close-popup @click="onOK" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
/* eslint-disable */

export default {
  props: ["data"],
  data() {
    return {
      reason: "",
      status: this.data.item.status
    };
  },
  methods: {
    onOK() {
      this.data.show = false;
      this.util.loadingShow(this);

      if (this.data.from === "teachercheck") {
        this.updateTeacherApply();
      } else if (this.data.from === "feedback") {
        this.updateFeedback();
      }
    },
    updateTeacherApply() {
      let params = {
        user_id: this.data.item.user_id,
        role: this.status === 1 ? "1" : "0",
        status: this.status + "",
        refuse_reason: this.reason
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(this.global.api.backurl + "user/updateTeacherApply", params, {
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
            toast("操作成功");
          }
        });
    },
    updateFeedback() {
      let params = {
        status: this.status + "",
        reason: this.reason
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .put(
          this.global.api.backurl +
            "user/updateFeedback?uuid=" +
            this.data.item.uuid,
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
          this.util.loadingHide(this);

          if (response.status === 200 && response.data.code === 0) {
            toast("操作成功");
          }
        });
    }
  }
};
</script>
<style scoped>
.dialog {
  background: white;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}
</style>
