<template>
  <div style="display:flex;    flex-direction: column;">
    <q-input :dense="true" v-model.trim="text" type="textarea" style="width:100%;margin:20px;" />
    <q-btn label="开始导入" @click="addUser" />
    <q-btn label="获取数据" @click="getUser" />
    <q-btn label="写入数据" @click="writeUser" />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "PageIndex",
  data() {
    return {
      text: "",
      data: [],
      index: 0,
      addconnt:0,
    };
  },
  methods: {
    writeUser() {
      let end = this.index + 1000;
      if (end > this.data.length) {
        end = this.data.length;
      }
      for (let i = this.index; i < end; i++) {
        this.write2DB(this.data[i]);
      }

      this.index += 1000;
    },
    write2DB(item) {
      if (item.qage <= 1) {
        console.log("---剔除q龄小于1年的");
        return;
      }

      let params = {
        uin: item.uin,
        nick: item.nick,
        gender: item.gender,
        role: item.role,
        qgroup_name: item.qgroup_name,
        qage: item.qage,
        card: item.card
      };
      let timestamp = new Date().getTime();
      this.$axios
        .post("http://localhost/api/v1/qq/create", params, {
          headers: {
            "access-token": this.util.generateToken(
              JSON.stringify(params),
              timestamp
            ),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          // console.log('---插入失败---')
          console.log(error);
        });
    },
    getUser() {
      let timestamp = new Date().getTime();
      this.$axios
        .get("http://localhost/api/v1/qq/getUser", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            "otc-timestamp": timestamp
          }
        })
        .then(response => {
          console.log(response.data.data.length);
          this.data = response.data.data;
        });
    },
    addUser() {
      let array = JSON.parse(this.text).result.buddy.info_list;
      console.log(array);
      let item = {};
      for (let i = 0; i < array.length; i++) {
        item = array[i];

        let gender = "";
        if (item.gender === 1) {
          gender = "男";
        } else if (item.gender === 2) {
          gender = "女";
        } else {
          gender = "未知";
        }

        // let role = "";
        // if (item.role === 0) {
        //   role = "群主";
        // } else if (item.role === 1) {
        //   role = "管理员";
        // } else {
        //   role = "普通成员";
        // }

        let nick = unescape(item.nick.replace(/\\u/g, "%u"));
        // console.log('---去除前：'+nick)
        nick = nick.replace(/&nbsp;/g, "");
        // console.log('---去除后：'+nick)

        // let card = unescape(item.card.replace(/\\u/g, "%u"));
        // card = card.replace(/&nbsp;/g, "");

        // if (item.qage <= 1) {
        //   console.log("---剔除q龄小于1年的");
        //   return;
        // }

        let params = {
          uin: item.uin,
          nick: nick,
          gender: gender,
          age: item.age,
          country: item.country,
          province: item.province,
          city: item.city
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
            // console.log(response);
            if(response.data.code===0){
              this.addconnt++
              console.log('已成功写入：'+this.addconnt+'条');
            }
          });
      }
    }
  }
};
</script>
