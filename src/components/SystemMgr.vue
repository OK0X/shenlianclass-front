<template>
  <div class="flex-col">
    <span>用户管理</span>
    <q-separator />
    <q-input v-model="mobile" placeholder="请输入用户手机号" style="width:300px;margin:20px 20px 0 32px;" counter maxlength="11" />
    <div class="q-gutter-sm" style="margin:10px;">
      <q-radio
        style="margin:10px;"
        v-model="rvalueUser"
        :val="item.val"
        :label="item.label"
        v-for="(item,index) in radiosUser"
        :key="index"
      />
    </div>
    <q-btn label="提交" style="width:100px;margin:0 20px 20px 32px;" color="primary" @click="updateUserCoin"/>
    <span>内容管理</span>
    <q-separator />
    <q-input
      v-model="contentId"
      placeholder="失效资源id"
      style="width:300px;margin:20px 20px 0 32px;"
      counter maxlength="32" 
    />
    <div class="q-gutter-sm" style="margin:10px;">
      <q-radio
        style="margin:10px;"
        v-model="contentType"
        :val="item.val"
        :label="item.label"
        v-for="(item,index) in radiosContent"
        :key="index"
      />
    </div>
    <q-btn label="提交" style="width:100px;margin:0 20px 20px 32px;" color="primary" @click="invalidContent"/>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mobile: "",
      rvalueUser: 0,
      radiosUser: [
        {
          val: 2,
          label: "设置为管理员"
        },
        {
          val: 0,
          label: "取消管理员"
        },
        {
          val: -1,
          label: "冻结账号"
        }
      ],
      contentId: "",
      contentType: 0,
      radiosContent: [
        {
          val: 1,
          label: "课程"
        },
        {
          val: 2,
          label: "交流园地"
        },
        {
          val: 3,
          label: "资源下载"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    updateUserCoin() {
      if(this.mobile === ''){
        toast('请输入手机号')
        return
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        role: this.rvalueUser
      };
      this.$axios
        .put(
          this.global.api.backurl +
            "user/updateUserByMobile?mobile=" +
            this.mobile,
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast('更新成功')
          }else{
            toast('更新失败')
          }
        });
    },
    invalidContent() {
      if(this.contentId === ''){
        toast('请输入失效资源id')
        return
      }
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        type: this.contentType
      };
      this.$axios
        .put(
          this.global.api.backurl +
            "other/contentMgr?uuid=" +
            this.contentId,
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
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast('更新成功')
          }else{
            toast('更新失败')
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
