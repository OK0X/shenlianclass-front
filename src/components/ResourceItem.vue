<template>
  <div class="res-card">
    <div class="flex-col" v-for="(item,index) in res" :key="index">
      <div class="res-item">
        <div style="display:flex;">
          <img :src="setFileIcon(item)" style="width:48px;height:48px;" />
          <div class="flex-col" style="margin-left:20px;align-self: center;">
            <span class="res-name" @click="toResDetail(item)">{{item.name}}</span>
            <div>
              <span class="mytx-tip" v-show="item.course_id!==''">
                所属课程：
                <span
                  class="course-tx"
                  @click="gotoCourse(item.course_id)"
                >{{item.course_name}}</span>
              </span>
              <span class="mytx-tip">上传时间：{{util.getShortTime(item.create_at)}}</span>
            </div>
          </div>
        </div>
        <div>
          <span class="mytx-tip">积分：</span>
          <span style="font-size: 33px;color: orange;">{{item.coin}}</span>
        </div>
      </div>
      <q-separator
        inset
        style="margin:5px 0 5px 0;background: rgba(0, 0, 0, 0.06);"
        v-show="index!==res.length-1"
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
  props: ["res"],
  methods: {
    setFileIcon(item) {
      // console.log(111,item)
      let filetype = item.filename.substring(item.filename.length - 3);
      return this.util.getFileIcon(filetype);
    },
    gotoCourse(courseid) {
      this.$router.push({
        path: "/CourseDetail",
        query: {
          courseid: courseid
        }
      });
    },
    toResDetail(item) {
      this.$router.push({
        path: "/ResourceDetail",
        query: {
          arg: item
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.res-card {
  display: flex;
  flex-direction: column;
  background: white;
}
.res-item {
  display: flex;
  margin: 10px;
  padding: 5px;
  justify-content: space-between;
}
.res-name {
  font-size: 16px;
  color: black;
  font-weight: 700;
  cursor: pointer;
}
.course-tx {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
  margin-right: 20px;
}
</style>