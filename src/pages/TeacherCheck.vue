<template>
  <q-page class="mypage">
    <div class="page-content">
      <div v-for="(item,index) in teachers" :key="index" @click="itemClick(item)">
        <div>id：{{item.user_id}}</div>
        <span>姓名：{{item.realy_name}}</span>
        <span style="margin-left:30px;">电话：{{item.phone}}</span>
        <span style="margin-left:30px;">微信：{{item.wechat}}</span>
        <span style="margin-left:30px;">当前状态：{{statusTx(item.status)}}</span>
        <div>讲师介绍：</div>
        <div>{{item.selfsay}}</div>
        <div>视频地址：</div>
        <div>{{item.videourl}}</div>
        <div>审核理由：</div>
        <div>{{item.refuse_reason}}</div>
        <span>申请日期：{{util.timeUTC2Local(item.create_at)}}</span>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==teachers.length-1"
        />
      </div>
    </div>
    <MyFooter />
    <TeacherOptionDialog :data="tDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import TeacherOptionDialog from "../components/TeacherOptionDialog";

export default {
  components: {
    MyFooter,
    TeacherOptionDialog
  },
  data() {
    return {
      teachers: [],
      tDialog: {
        show: false,
        item: {}
      }
    };
  },
  mounted() {
    this.getTeacherApply();
  },
  methods: {
    statusTx(status) {
      switch (status) {
        case 0:
          return "审核中";
        case 1:
          return "已通过";
        case -1:
          return "未通过";
        case -2:
          return "违规";
      }
    },
    getTeacherApply() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "user/getAllTeacherApply", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(333,response);
          if (response.status === 200 && response.data.code === 0) {
            this.teachers = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    itemClick(item) {
      this.tDialog.item = item;
      this.tDialog.show = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
