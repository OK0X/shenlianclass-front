<template>
  <div class="ask-card">
    <div class="flex-col" v-for="(item,index) in asks" :key="index">
      <div style="display:flex;justify-content: space-between;">
        <div style="display:flex;">
          <img src="statics/coin.png" class="reward-icon" v-if="item.reward" />
          <span class="reward-num" v-if="item.reward">{{item.reward_num}}</span>
          <span class="ask-tx" @click="toAskDetail(item)">{{item.title}}</span>
        </div>
        <!-- <div style="color: #999;margin-right:20px;line-height: 25px;" v-html="item.detail"></div> -->
        <div style="display:flex;color:#bbb;margin-top:5px;">
          <span class="mytx-tip">{{util.getShortTime(item.create_at)}}</span>
          <!-- <span style="width:1px;background: rgba(0, 0, 0, 0.12);margin:2px 10px 2px 10px;"></span> -->
          <!-- <span>{{item.answer_num}} 回答</span> -->
        </div>
      </div>
      <q-separator
        style="margin:5px 0 5px 0;background: rgba(0, 0, 0, 0.06);"
        v-if="index!==asks.length-1"
      />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  props: ["asks"],
  methods: {
    toAskDetail(item) {
      this.$router.push({
        path: "/AskDetail",
        query: {
          arg: item
        }
      });
    }
  }
};
</script>
<style scoped>
.ask-card {
  display: flex;
  flex-direction: column;
  background: white;
}
.ask-tx {
  color: #3066b3;
  line-height: 35px;
  font-size: 16px;
}
.ask-tx:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
  text-decoration: underline;
}
.reward-icon {
  width: 13px;
  height: 12px;
  margin: 5px;
  align-self: center;
}
.reward-num {
  color: #e7412b;
  margin-right: 10px;
  line-height: 35px;
}
</style>