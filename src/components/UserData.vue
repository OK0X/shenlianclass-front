<template>
  <div class="flex-col">
    <span>搜索条件：</span>
    <div style="display:flex;margin:10px;flex-wrap: wrap;">
      <q-input outlined v-model="mobile" label="电话" dense style="margin:10px;" />
      <q-input outlined v-model="offset" label="offset" dense style="margin:10px;" />
      <q-btn label="查询" color="primary" @click="getUsers" style="height: 40px;align-self: center;" />
    </div>
    <span>搜索结果：</span>
    <q-table
      title
      :data="searchData"
      :columns="columns"
      row-key="name"
      flat
      bordered
      style="width:1000px;margin:10px;"
    />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mobile: "",
      offset: 0,
      searchData: [],
      columns: [
        { name: "uuid", label: "uuid", field: "uuid", align: "left" },
        { name: "role", label: "role", field: "role", align: "left" },
        { name: "mobile", label: "mobile", field: "mobile", align: "left" },
        { name: "nick", label: "nick", field: "nick", align: "left" },
        { name: "avatar", label: "avatar", field: "avatar", align: "left" },
        { name: "coin", label: "coin", field: "coin", align: "left" },
        { name: "qq", label: "qq", field: "qq", align: "left" },
        {
          name: "last_login",
          label: "last_loginq",
          field: "last_login",
          align: "left",
          format: val => `${this.util.timeUTC2Local(val)}`
        }
      ]
    };
  },
  mounted() {},
  methods: {
    getUsers() {
      let params = {
        offset: this.offset+''
      };
      if(this.mobile!==''){
        params.mobile=this.mobile
      }
      this.util.loadingShow(this);
      let timestamp = new Date().getTime() + this.global.requestExpireT;
      this.$axios
        .get(this.global.api.backurl + "user/getUsers", {
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
          this.util.loadingHide(this);

          if (response.status === 200 && response.data.code === 0) {
            this.searchData = response.data.data;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
