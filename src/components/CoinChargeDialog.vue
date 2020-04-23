<template>
  <q-dialog v-model="dialogData.show">
    <div class="f-dialog">
      <div class="text-h6" style="margin:10px 0 0 10px">快捷充值：</div>
      <div style="display:flex;">
        <q-btn
          outline
          label="2元"
          @click="coinCharge(2)"
          color="orange"
          style="width:100px;margin:10px 0 0 10px;"
        />
        <q-btn
          outline
          label="5元"
          @click="coinCharge(5)"
          color="orange"
          style="width:100px;margin:10px 0 0 10px;"
        />
        <q-btn
          outline
          label="10元"
          @click="coinCharge(10)"
          color="orange"
          style="width:100px;margin:10px 10px 0 10px;"
        />
      </div>
      <div style="display:flex;">
        <q-btn
          outline
          label="20元"
          @click="coinCharge(20)"
          color="orange"
          style="width:100px;margin:10px 0 0 10px;"
        />
        <q-btn
          outline
          label="50元"
          @click="coinCharge(50)"
          color="orange"
          style="width:100px;margin:10px 0 0 10px;"
        />
        <q-btn
          outline
          label="100元"
          @click="coinCharge(100)"
          color="orange"
          style="width:100px;margin:10px 10px 0 10px;"
        />
      </div>
      <div class="text-h6" style="margin:10px 0 0 10px">自定义充值：</div>
      <q-input v-model="chargeAmount" dense style="margin:10px;" />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="确定" @click="onOk" />
      </q-card-actions>
    </div>
  </q-dialog>
</template>

<script>
export default {
  props: ["dialogData"],
  data() {
    return {
      chargeAmount: ""
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
    coinCharge(amount) {
      this.$emit("onCharge", amount);
      this.dialogData.show = false;
      
    },
    onOk() {
      if(this.chargeAmount===''){
        toast("请输入充值金额");
        return;
      }
      if (parseInt(this.chargeAmount) <= 1) {
        toast("充值金额需大于1元");
        return;
      }
      if (parseInt(this.chargeAmount) >= 5000) {
        toast("单次充值金额需小于5000元");
        return;
      }
      this.$emit("onCharge", this.chargeAmount);
      this.dialogData.show = false;
    }
  }
};
</script>
<style scoped>
.f-dialog {
  background: white;
  /* min-width: 300px; */
  /* width: 100%; */
  display: flex;
  flex-direction: column;
}
</style>
