<template>
  <q-page class="mypage">
    <div class="white-block">
      <span>课程名称：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" />
      <span style="margin-top:30px;">课程简介：</span>
      <q-input :dense="true" v-model.trim="classsummary" type="textarea" style="width:100%;height:100px;" />
      <span style="margin-top:30px;">课程介绍：</span>
      <VueEditor
        v-model="classdetail"
        useCustomImageHandler
        @image-added="handleImageAdded"
        style="height: 580px;width:100%;"
      />
      <span style="margin-top:80px;">课程价格：</span>
      <q-input v-model="classname" :dense="true" style="width:300px;" />
    </div>
    <MyFooter />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import { VueEditor } from "vue2-editor";
import localforage from "localforage";

export default {
  components: {
    MyFooter,
    VueEditor
  },
  data() {
    return {
      classname: "",
      classsummary: "",
      classdetail:'',
      saveTxInterval: '',
    };
  },
  mounted() {
    this.showDraft();
    this.saveDraft();
  },
  beforeDestroy() {
    clearInterval(this.saveTxInterval);
  },
  methods: {
    showDraft() {
      localforage.getItem("draft").then(value => {
        console.log("草稿：" + value);
        if (!this.util.isEmpty(value)) {
          this.draft= JSON.parse(value)
          this.$q
            .dialog({
              // title: _this.$t("havenew"),
              message: '你上一次有未发布的课程，编辑时间：'+this.draft.time,
              ok: '使用草稿',
              cancel: '丢弃'
            })
            .onOk(() => {
              this.classname=this.draft.classname
              this.classsummary=this.draft.classsummary
              this.classdetail=this.draft.classdetail
            })
            .onCancel(() => {
              localforage.removeItem("draft");
            });
        }
      });
    },
    saveDraft() {
      this.saveTxInterval = setInterval(() => {
        //每分钟保存一次
        // debugger
        this.draft={
          classname:this.classname,
          classsummary:this.classsummary,
          classdetail:this.classdetail,
          time:new Date().toLocaleString()
        }

        if(this.classdetail!==''||this.classname!==''||this.classsummary!==''){
          localforage.setItem("draft", JSON.stringify(this.draft));
          console.log("saved，"+new Date().toLocaleString());
        }
        
        
      }, 60 * 5000);
    },
    pushClass() {
      
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      // console.log(file)
      // return

      this.$axios
        .request({
          url:
            "https://api2.bmob.cn/2/files/" +
            // this.global.wallet.ethAddress +
            "test.jpg",
          method: "post",
          headers: {
            "X-Bmob-Application-Id": "ac7f17d258941e666eb88514048c351a",
            "X-Bmob-REST-API-Key": "f31e47e1bcf4d276e1bc19226abee442",
            "Content-Type": "image/jpeg"
          },
          data: file
        })
        .then(response => {
          // console.log(response);
          if (response.status === 200) {
            let url = response.data.url;
            Editor.insertEmbed(cursorLocation, "image", url);
            resetUploader();
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
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
