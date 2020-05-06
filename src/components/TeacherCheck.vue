<template>
  <div class="flex-col">
    <div class="flex-col">
      <div v-for="(item,index) in teachers" :key="index" @click="itemClick(item)">
        <div
          :style="(item.status===1?'background: #4caf503d;':'background:#f4433630;')+'padding:10px;'"
        >
          <div>
            <span class="tx-bold">用户id：</span>
            {{item.user_id}}
          </div>
          <span>
            <span class="tx-bold">姓名：</span>
            {{item.realy_name}}
          </span>
          <span style="margin-left:30px;">
            <span class="tx-bold">电话：</span>
            {{item.phone}}
          </span>
          <span style="margin-left:30px;">
            <span class="tx-bold">微信：</span>
            {{item.wechat}}
          </span>
          <span style="margin-left:30px;">
            <span class="tx-bold">当前状态：</span>
            {{statusTx(item.status)}}
          </span>
          <div class="tx-bold">讲师介绍：</div>
          <div>{{item.selfsay}}</div>
          <div class="tx-bold">视频地址：</div>
          <div>{{item.videourl}}</div>
          <div class="tx-bold">审核理由：</div>
          <div>{{item.refuse_reason}}</div>
          <span>
            <span class="tx-bold">申请日期：</span>
            {{util.timeUTC2Local(item.create_at)}}
          </span>
        </div>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==teachers.length-1"
        />
      </div>
    </div>
    <OptionDialog :data="tDialog" />
  </div>
</template>

<script>
/* eslint-disable */
import OptionDialog from "../components/OptionDialog";

export default {
  components: {
    OptionDialog
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
       this.tDialog.title='讲师审核处理'
      this.tDialog.item = {
        user_id:item.user_id,
        status:item.status,
        reason:item.refuse_reason,
        radios:[{
          val:0,
          label:'审核中'
        },{
          val:1,
          label:'通过'
        },{
          val:-1,
          label:'未通过'
        },{
          val:-2,
          label:'违规'
        }]
      };
      this.tDialog.from='teachercheck'
      this.tDialog.show = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
