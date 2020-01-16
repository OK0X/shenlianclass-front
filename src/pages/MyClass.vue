<template>
  <q-page class="mypage">
    <div class="white-block">
    </div>
    <MyFooter />
    <SetMobileDialog :dialogData="setMobileDialogData" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import SetMobileDialog from "../components/SetMobileDialog";


export default {
  components: {
    MyFooter,
    SetMobileDialog
  },
  data() {
    return {
      setMobileDialogData: {
        show: false,
        title: '快捷登陆'
      }
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user.user;
      },
      set(val) {
        this.$store.commit("user/updateUser", val);
      }
    }
  },
  mounted() {
    if(typeof this.user.uuid==='undefined'){
      this.setMobileDialogData.show=true
    }
  },
  methods: {
    
  }
};
</script>
<style scoped>
.white-block {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 50px 0 50px 0;
  justify-content: flex-start;
  padding: 20px;
}

</style>
