<template>
  <q-dialog v-model="props.show" @show="onShow" @hide="onHide">
    <div class="f-dialog">
      <div class="tx-close">
        <div class="text-h6" style="margin:10px 0 0 10px">扫码分享</div>
        <q-icon name="close" class="close" @click="closeDialog"/>
      </div>
      <div id="qrcode-share" class="qr-share"></div>
    </div>
  </q-dialog>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  props: ["props"],
  data() {
    return {
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
    onShow() {
      var qrcode = new QRCode(document.getElementById("qrcode-share"), {
        text: this.props.tx,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    onHide() {
    },
    closeDialog(){
      this.props.show=false
    }
  }
};
</script>
<style scoped>
.f-dialog {
  background: white;
  min-width: 300px;
  /* width: 100%; */
  display: flex;
  flex-direction: column;
}
.tx-close {
  display: flex;
  justify-content: space-between;
}
.qr-share {
  align-self: center;
  margin: 30px;
}
.close {
  margin: 10px 10px 0 0;
  font-size: 25px;
  cursor: pointer;
}
</style>
