<template>
  <div class="flex-col">
    <div class="white-block" style="margin-top:0px;">
      <span>后台配置信息</span>
      <q-separator />
      <pre>{{JSON.stringify(config, null,2)}}</pre>
      <q-btn label="刷新" color="primary" flat class="q-ml-sm" @click="refresh" />
    </div>
    <div class="white-block" style="margin-bottom:30px;">
      <span>更改配置<span style="color:red;">(除了网站公告外其余字段不能为空)</span></span>
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
      <q-input v-model="answerReward" :dense="true" style="width:300px;" placeholder="answerReward(回答默认奖励积分数量)" />
      <q-input v-model="homeworkReward" :dense="true" style="width:300px;" placeholder="homeworkReward(提交作业奖励积分数量)" />
      <q-input v-model="defaultCoin" :dense="true" style="width:300px;" placeholder="defaultCoin(注册默认积分数量)" />
      <q-input v-model="autoAnswer" :dense="true" style="width:300px;" placeholder="百度AI自动回答" />
      <q-input v-model="notify" :dense="true" style="width:300px;" placeholder="网站重要公告" />
      <q-btn label="提交" color="primary" flat class="q-ml-sm" @click="submit" />
      <q-btn label="清空缓存" color="primary" flat class="q-ml-sm" @click="clearAll" />
    </div>
    <!-- <div class="white-block" style="margin-bottom:30px;">
      <span>Redis运行时信息</span>
      <q-separator />
      <pre>{{JSON.stringify(redisRuntime, null,2)}}</pre>
    </div>-->
  </div>
</template>

<script>
/* eslint-disable */


export default {
  components: {
    
  },
  data() {
    return {
      config: "",
      apilimitT: "",
      apiLimitNum: "",
      alipayExpire: "",
      defaultEx: "",
      redisRuntime: "",
      answerReward:'',
      homeworkReward:'',
      defaultCoin:'',
      notify:'',
      autoAnswer:''
    };
  },
  mounted() {
    // this.getConfig();
    // this.getRedisRuntimeInfo();
    this.config = this.global.backendConfig
  },
  methods: {
    getRedisRuntimeInfo() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "config/getRedis", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(response);
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
          //console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          //console.log('I am triggered on both OK and Cancel')
        });
    },
    clearAll2(data) {
      let params = {
        phrase: this.util.hash(data)
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
          //console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          //console.log('I am triggered on both OK and Cancel')
        });
    },
    updateConfig() {
      var _this = this;
      let params = {
        apilimitT: this.apilimitT,
        apiLimitNum: this.apiLimitNum,
        alipayExpire: this.alipayExpire,
        defaultEx: this.defaultEx,
        answerReward:this.answerReward,
        homeworkReward:this.homeworkReward,
        defaultCoin:this.defaultCoin,//
        autoAnswer:this.autoAnswer,
        notify:this.notify
      };
      let timestamp = new Date().getTime() + this.global.requestExpireT;
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
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "config/get", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            this.config = this.global.backendConfig = response.data.data;
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

</style>
