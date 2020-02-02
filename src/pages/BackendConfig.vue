<template>
  <q-page class="mypage">
    <div class="white-block">
      <span>后台配置信息</span>
      <q-separator />
      <pre>{{JSON.stringify(config, null,2)}}</pre>
      <q-btn label="刷新" color="primary" flat class="q-ml-sm" @click="refresh" />
    </div>
    <div class="white-block" style="margin-bottom:30px;">
      <span>更改配置</span>
      <q-separator />
      <q-input v-model="apilimitT" :dense="true" style="width:300px;" placeholder="apilimitT(分钟)" />
      <q-input v-model="apiLimitNum" :dense="true" style="width:300px;" placeholder="apiLimitNum(次)" />
      <q-input
        v-model="alipayExpire"
        :dense="true"
        style="width:300px;"
        placeholder="alipayExpire(秒)"
      />
      <q-input v-model="defaultEx" :dense="true" style="width:300px;" placeholder="defaultEx(秒)" />
      <q-btn label="提交" color="primary" flat class="q-ml-sm" @click="submit" />
      <q-btn label="清空缓存" color="primary" flat class="q-ml-sm" @click="clearAll" />
    </div>
    <!-- <div class="white-block" style="margin-bottom:30px;">
      <span>Redis运行时信息</span>
      <q-separator />
      <pre>{{JSON.stringify(redisRuntime, null,2)}}</pre>
    </div>-->
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";

export default {
  components: {
    MyFooter
  },
  data() {
    return {
      config: "",
      apilimitT: "",
      apiLimitNum: "",
      alipayExpire: "",
      defaultEx: "",
      redisRuntime: ""
    };
  },
  mounted() {
    this.getConfig();
    // this.getRedisRuntimeInfo();
  },
  methods: {
    getRedisRuntimeInfo() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .get(this.global.api.backurl + "config/getRedis", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.redisRuntime = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    clearAll() {
      this.$q
        .dialog({
          dark: true,
          title: "重要",
          message: "请输入密码来确认操作",
          prompt: {
            model: "",
            type: "text" // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          // toast(data)
          this.clearAll2(data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    clearAll2(data) {
      let params = {
        phrase: this.util.hash(data)
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "config/clearCache", params, {
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
            toast("success");
          } else {
            toast(response.data.message);
          }
        });
    },
    refresh() {
      this.getConfig();
    },
    submit() {
      this.$q
        .dialog({
          dark: true,
          title: "警告",
          message: "生产环境配置请仔细确认配置信息无误后再提交",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.updateConfig();
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    updateConfig() {
      var _this = this;
      let params = {
        apilimitT: this.apilimitT,
        apiLimitNum: this.apiLimitNum,
        alipayExpire: this.alipayExpire,
        defaultEx: this.defaultEx
      };
      let timestamp = new Date().getTime() + 1 * 60 * 1000;
      this.$axios
        .post(this.global.api.backurl + "config/set", params, {
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
            toast("success");
          }
        });
    },
    getConfig() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .get(this.global.api.backurl + "config/get", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.config = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.white-block {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-top: 30px;
  justify-content: flex-start;
  padding: 20px;
}
</style>
