<template>
  <q-page class="mypage">
    <div class="page-content" style="padding:0px;">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        active-bg-color="white"
        align="left"
        narrow-indicator
        style="background-color:#ebecec;color:black;"
      >
        <q-tab name="all" label="全部问答" />
        <q-tab name="highcoin" label="高悬赏" />
        <q-tab name="creatask" label="我要提问" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="all">
          <div class="flex-col">
            <div class="flex-col">
              <div style="display:flex;">
                <img src="statics/coin.png" style="width:13px;height:12px;margin:5px;" />
                <span style="color: #e7412b;margin-right:20px;line-height: 25px;">200</span>
                <span class="ask-tx">把你当徒弟的已婚男人和把你当暧昧对象的师傅关系有什么区别？</span>
              </div>
              <div style="display:flex;">
                <img src="statics/label.png" style="width:16px;height:16px;" />
                <span style="color:#bbb;margin-left:10px;font-size: 12px;">以太坊 比特币 cosmos</span>
              </div>
              <span style="color: #999;margin-right:20px;line-height: 25px;">大唐荣耀的全部歌曲mp3，哪位给发一个百度云？</span>
              <span style="color:#bbb;">2020-02-02 12:12:12  |  0 回答</span>
            </div>
            <q-separator style="margin:5px 0 5px 0;"/>
            <div class="flex-col">
              <div style="display:flex;">
                <img src="statics/coin.png" style="width:13px;height:12px;margin:5px;" />
                <span style="color: #e7412b;margin-right:20px;line-height: 25px;">200</span>
                <span class="ask-tx">把你当徒弟的已婚男人和把你当暧昧对象的师傅关系有什么区别？</span>
              </div>
              <div style="display:flex;">
                <img src="statics/label.png" style="width:16px;height:16px;" />
                <span style="color:#bbb;margin-left:10px;font-size: 12px;">以太坊 比特币 cosmos</span>
              </div>
              <span style="color: #999;margin-right:20px;line-height: 25px;">大唐荣耀的全部歌曲mp3，哪位给发一个百度云？</span>
              <span style="color:#bbb;">2020-02-02 12:12:12  |  0 回答</span>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="highcoin">
          <div>222</div>
        </q-tab-panel>
        <q-tab-panel name="creatask">
          <div>222</div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
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
      tab: "all"
    };
  }
};
</script>
<style scoped>
.ask-tx {
  color: #3066b3;
  line-height: 25px;
}
.ask-tx:hover {
  /* background-color:#f3f3f3; */
  cursor: pointer;
  text-decoration: underline;
}
</style>
