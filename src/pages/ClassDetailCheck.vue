<template>
  <q-page class="mypage">
    <div class="buywatch">
      <img :src="getImgUrl(item.converimg)" class="videoimg" />
      <div class="summary-tx">
        <span style="font-size:24px;color:#1f2328;">{{item.classname}}</span>
        <span>{{item.classsummary}}</span>
        <div class="price">
          <span style="align-self: center;margin-left:10px;font-size:24px;color: orange;">￥ {{item.classprice}}元</span>
          <div style="display:flex;align-self: center;margin-right:10px;">
            <img src="statics/share.png" style="width:20px;height:20px;" />
            <span style="margin-left:5px;">分享</span>
          </div>
        </div>
        <span style="margin-top:20px;">学习人数：{{item.studynum}}人</span>
        <q-btn unelevated :label="item.status===0?'审核中':'审核通过'" class="study" color="primary" />
      </div>
    </div>
    <div class="detail">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="detail" label="课程介绍" />
        <q-tab name="chapters" label="课程目录" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="detail">
          <div v-html="item.classdetail"></div>
        </q-tab-panel>
        <q-tab-panel name="chapters">
          <q-timeline color="secondary">
            <q-timeline-entry heading>Timeline heading</q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 21, 1986" icon="delete">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>

            <q-timeline-entry heading>November, 2017</q-timeline-entry>
            <q-timeline-entry
              title="Event Title"
              subtitle="February 22, 1986"
              avatar="https://cdn.quasar.dev/img/avatar2.jpg"
            >
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry
              title="Event Title"
              subtitle="February 22, 1986"
              color="orange"
              icon="done_all"
            >
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
            <q-timeline-entry title="Event Title" subtitle="February 22, 1986">
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </q-timeline-entry>
          </q-timeline>
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
      tab:'detail',
      item: this.$route.query.arg
    };
  },
  mounted() {
    console.log(this.$route.query)
  },
  methods: {
    getImgUrl(filename) {
      return this.util.makeImgUrl(this, filename);
    }
  }
};
</script>
<style scoped>
.detail {
  width: 100%;
  max-width: 1200px;
  display: flex;
  background-color: white;
  margin: 0 0 50px 0;
  /* height: 800px; */
  flex-direction: column;
}
.buywatch {
  width: 100%;
  max-width: 1200px;
  height: 355px;
  display: flex;
  background-color: white;
  margin: 50px 0 30px 0;
}
.videoimg {
  width: 530px;
  height: 320px;
  align-self: center;
  margin: 0px 20px;
  flex-shrink: 0;
}
.summary-tx {
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
}
.price {
  width: 100%;
  height: 55px;
  display: flex;
  background-color: #f3f3f3;
  margin-top: 10px;
  justify-content: space-between;
}
.study {
  align-self: flex-start;
  margin-top: 20px;
  width: 145px;
  height: 50px;
  font-size: 18px;
  /* background-image: linear-gradient(to right, #ff7a00, #fe560a); */
  /* color: white; */
}
</style>
