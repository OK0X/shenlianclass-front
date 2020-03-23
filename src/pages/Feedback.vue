<template>
  <q-page class="mypage">
    <div class="page-content">
      <div v-for="(item,index) in feedback" :key="index" @click="itemClick(item)">
        <div :style="(item.status===0?'background: #f4433630;':'background:#4caf503d;')+'padding:10px;'">
          <div>
            <span class="tx-bold">事件：</span>
            {{item.event}}
          </div>
          <div>
            <span>
              <span class="tx-bold">用户id：</span>
              {{item.user_id}}
            </span>
            <span style="margin-left:30px;">
              <span class="tx-bold">电话：</span>
              {{item.mobile}}
            </span>
            <span style="margin-left:30px;">
              <span class="tx-bold">当前状态：</span>
              {{statusTx(item.status)}}
            </span>
          </div>
          <div class="tx-bold">问题描述：</div>
          <div>{{item.describe}}</div>
          <div class="tx-bold">附加信息：</div>
          <pre>{{JSON.stringify(JSON.parse(item.extras), null,2)}}</pre>
          <span>
            <span class="tx-bold">提交日期：</span>
            {{util.timeUTC2Local(item.create_at)}}
          </span>
          <div>
            <span class="tx-bold">问题原因：</span>
            {{item.reason}}
          </div>
        </div>
        <q-separator
          style="margin:20px 0 20px 0;background: rgba(0, 0, 0, 0.06);"
          v-if="index!==feedback.length-1"
        />
      </div>
    </div>
    <MyFooter />
    <OptionDialog :data="tDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import OptionDialog from "../components/OptionDialog";

export default {
  components: {
    MyFooter,
    OptionDialog
  },
  data() {
    return {
      feedback: [],
      tDialog: {
        show: false,
        item: {}
      }
    };
  },
  mounted() {
    this.getfeedback();
  },
  methods: {
    statusTx(status) {
      switch (status) {
        case 0:
          return "未解决";
        case 1:
          return "已解决";
      }
    },
    getfeedback() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "user/getFeedback", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          //console.log(333,response);
          if (response.status === 200 && response.data.code === 0) {
            this.feedback = response.data.data;
          }
        })
        .catch(error => {
          //console.log(error);
        });
    },
    itemClick(item) {
      this.tDialog.title='用户反馈处理'
      this.tDialog.item = {
        uuid:item.uuid,
        status:item.status,
        radios:[{
          val:0,
          label:'未解决'
        },{
          val:1,
          label:'已解决'
        }]
      };
      this.tDialog.from='feedback'
      this.tDialog.show = true;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
