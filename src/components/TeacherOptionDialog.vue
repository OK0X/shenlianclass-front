<template>
  <q-dialog v-model="data.show">
    <div class="mydialog" style="padding:20px;">
      <div class="text-h6" style="margin-left:0 10px 0 10px;">讲师审核</div>
      <div class="q-gutter-sm" style="margin-left:0 10px 0 10px;">
        <q-radio v-model="data.item.status" :val="0" label="审核中" />
        <q-radio v-model="data.item.status" :val="1" label="通过" />
        <q-radio v-model="data.item.status" :val="-1" label="未通过" />
        <q-radio v-model="data.item.status" :val="-2" label="违规" />
      </div>
      <span>备注原因(可选):</span>
      <q-input v-model="data.item.refuse_reason" style="margin-left:0 10px 0 10px;"  />
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
    };
  },
  methods: {
    onOK() {
      this.util.loadingShow(this);

      let params = {
        user_id: this.data.item.user_id,
        role: this.data.item.status===1?'1':'0',
        status: this.data.item.status + "",
        refuse_reason: this.data.item.refuse_reason
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

      this.data.show = false;
    }
  }
};
</script>
<style scoped>
</style>
