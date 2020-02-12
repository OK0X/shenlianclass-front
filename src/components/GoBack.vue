<template>
  <div class="page-top">
    <img src="statics/back.png" class="back-icon" @click="goBack" />
      <span class="title">{{title}}</span>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  props: ["title"],
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.page-top {
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  display:flex;
}
.back-icon {
  align-self: flex-start;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.back-icon:hover {
  background-color: white;
  cursor: pointer;
}
.title {
  color: black;
  font-size: 18px;
  margin-left: 5px;
  align-self: center;
}
</style>