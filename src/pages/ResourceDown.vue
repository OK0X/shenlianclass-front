<template>
  <q-page class="mypage">
    <div class="page-content" style="margin-top:50px;">
      <div class="flex-col" v-for="(item,index) in resList" :key="index">
        <div class="res-item">
          <div style="display:flex;">
            <img :src="setFileIcon(item)" style="width:48px;height:48px;" />
            <div class="flex-col" style="margin-left:20px;align-self: center;">
              <span class="res-name" @click="toResDetail(item)">{{item.name}}</span>
              <div>
                <span class="mytx-tip" v-show="item.course_id!==''">
                  所属课程：
                  <span class="course-tx" @click="gotoCourse(item.course_id)">{{item.course_name}}</span>
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
          v-show="index!==resList.length-1"
        />
      </div>
      <q-pagination
        v-if="pageMax > 1"
        v-model="currentPage"
        :max="pageMax"
        :direction-links="true"
        style="margin-top:30px;align-self:center;"
        @input="paginationClick"
      ></q-pagination>
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
      resList: [],
      currentPage: 1,
      lastPage: 1,
      offset: 0,
      limit: 20,
      pageMax: 1
    };
  },
  mounted() {
    this.getRes();
  },
  methods: {
    setFileIcon(item){
      // console.log(111,item)
      let filetype = item.filename.substring(
        item.filename.length - 3
      );
      return this.util.getFileIcon(filetype)
    },
    gotoCourse(courseid){

      this.$router.push({
        path:'/CourseDetail',
        query:{
          courseid:courseid
        }
      })
    },
    paginationClick(pageIndex) {
      // console.log(this.lastPage, pageIndex);
      if (this.lastPage === pageIndex) return;

      this.offset += this.limit * (pageIndex - this.lastPage);
      this.lastPage = pageIndex;
      this.getRes();
    },
    getRes() {
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      let params = {
        limit: this.limit + "",
        offset: this.offset + ""
      };
      this.$axios
        .get(this.global.api.backurl + "resourcedown/getRes", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            timestamp2: timestamp
          }
        })
        .then(response => {
          // console.log(666,response);
          if (response.status === 200 && response.data.code === 0) {
            const total = response.data.data.total[0].total;
            this.pageMax = Math.ceil(total / this.limit);
            this.resList = response.data.data.res;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toResDetail(item) {
      this.$router.push({
        path: "/ResourceDetail",
        query:{
          arg:item
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
// .course-tx:hover {
//   color: $primary;
//   text-decoration:underline;
// }
</style>
