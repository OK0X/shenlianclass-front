<template>
  <div style="display:flex;    flex-direction: column;">
    <q-input :dense="true" v-model.trim="text" type="textarea" style="width:100%;margin:20px;" />
    <q-btn label="开始导入" @click="addUser" />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "PageIndex",
  data() {
    return {
      text: ""
    };
  },
  methods: {
    addUser() {
      let array = JSON.parse(this.text);
      console.log(array);
      let item = {};
      for (let i = 0; i < array.length; i++) {
        item = array[i];

        let gender = "";
        if (item.g === 0) {
          gender = "男";
        } else if (item.g === 1) {
          gender = "女";
        } else {
          gender = "未知";
        }

        let role = "";
        if (item.role === 0) {
          role = "群主";
        } else if (item.role === 1) {
          role = "管理员";
        } else {
          role = "普通成员";
        }

        let nick = unescape(item.nick.replace(/\\u/g, "%u"));
        // console.log('---去除前：'+nick)
        nick = nick.replace(/&nbsp;/g, "");
        // console.log('---去除后：'+nick)

        let card = unescape(item.card.replace(/\\u/g, "%u"));
        card = card.replace(/&nbsp;/g, "");

        let params = {
          uin: item.uin,
          nick: nick,
          gender: gender,
          age: 0,
          country: "",
          city: "",
          role: role,
          qgroup_name: "Android开发者之家",
          qage: item.qage,
          card: card
        };
        let timestamp = new Date().getTime();
        this.$axios
          .post(this.global.apiconfig.otcbackapi + "qq/create", params, {
            headers: {
              "access-token": this.util.generateToken(
                JSON.stringify(params),
                timestamp
              ),
              "otc-timestamp": timestamp
            }
          })
          .then(response => {
            console.log(response);
          });
      }
    }
  }
};
</script>
