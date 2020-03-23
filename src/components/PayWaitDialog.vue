<template>
  <q-dialog v-model="data.show" persistent>
    <div class="dialog">
      <q-spinner-hourglass color="primary" class="shalou" />
      <span class="tip-tx">等待您完成支付...</span>
      <span class="mytx-tip">请在新打开的支付页面完成支付</span>
      <q-btn unelevated rounded color="primary" label="已完成支付" style="margin-top:20px;width:150px;" @click="$emit('finishedPay')"/>
      <q-btn outline rounded color="primary" label="支付遇到问题" style="margin-top:20px;width:150px;" @click="$emit('paywithProblem')"/>
    </div>
  </q-dialog>
</template>

<script>
/* eslint-disable */

export default {
  props: ["data"],
  data() {
    return {};
  },
  methods: {
  }
};
</script>
<style scoped>
.dialog {
  width: 320px;
  height: 320px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.shalou {
  width: 80px;
  height: 80px;
  margin-top: 30px;
  /* align-self: center; */
}
.tip-tx {
  font-size: 21px;
  margin-top: 10px;
}
</style>
