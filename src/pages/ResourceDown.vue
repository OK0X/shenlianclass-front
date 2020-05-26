<template>
  <q-page class="mypage">
    <div class="page-content" style="margin-top:50px;">
      <ResourceItem :res="resList" />
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
import ResourceItem from "../components/ResourceItem";

export default {
  components: {
    MyFooter,
    ResourceItem
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
    if (typeof this.global.routeCache.Res !== "undefined") {
      const total = this.global.routeCache.Res.total[0].total;
      this.pageMax = Math.ceil(total / this.limit);
      this.resList = this.global.routeCache.Res.res;
    }
    this.getRes();
  },
  methods: {
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
            this.global.routeCache.Res = response.data.data;
            const total = this.global.routeCache.Res.total[0].total;
            this.pageMax = Math.ceil(total / this.limit);
            this.resList = this.global.routeCache.Res.res;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
