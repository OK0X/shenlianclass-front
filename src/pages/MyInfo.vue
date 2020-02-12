<template>
  <q-page class="mypage">
    <GoBack />
    <div class="page-content" style="margin-top:5px;">
      <div style="display:flex;">
        <img
          :src="user.avatar"
          style="width:80px;height:80px;border-radius: 50%;"
          onerror="src = 'statics/default.png'"
        />
        <div class="flex-col" style="margin-left: 16px;justify-content: space-around;">
          <div style="display:flex;">
            <span>
              <span class="tx-bold">昵称：</span>
              {{user.nick}}
            </span>
            <img src="statics/edit.png" class="edit-icon" @click="editNickName" />
          </div>
          <div style="display:flex;">
            <span>
              <span class="tx-bold">电话：</span>
              {{user.mobile}}
            </span>
            <img src="statics/edit.png" class="edit-icon" @click="editMobile" />
          </div>
          <div style="display:flex;">
            <img src="statics/coin.png" style="width: 13px;height: 12px;align-self:center;" />
            <span style="margin-left:10px;">{{user.coin}} SC</span>
          </div>
        </div>
      </div>
      <input
        accept="image/gif, image/jpeg, image/jpg, image/png"
        type="file"
        @change="onFileChange($event)"
        class="photo-pickup"
        ref="imgpicker"
      />
    </div>
    <MyFooter />
    <CropperDialog :data="cropperDialog" @uploadImgOK="uploadImgOK" />
    <LoginDialog :dialogData="loginDialog" />
  </q-page>
</template>

<script>
/* eslint-disable */
import MyFooter from "../components/MyFooter";
import GoBack from "../components/GoBack";
import CropperDialog from "../components/CropperDialog";
import LoginDialog from "../components/LoginDialog";

export default {
  components: {
    MyFooter,
    GoBack,
    CropperDialog,
    LoginDialog
  },
  data() {
    return {
      cropperDialog: {
        title: "剪裁头像",
        show: false
      },
      loginDialog: {
        show: false,
        title: "修改手机号",
        placeholder:'请输入新手机号'
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
  mounted() {},
  methods: {
    editMobile(){

      this.loginDialog.show = true;
    },
    editNickName() {
      this.$q
        .dialog({
          title: "修改昵称",
          message: "",
          prompt: {
            model: "",
            type: "text" // optional
          },
          ok: "确定",
          cancel: "取消",
          persistent: true
        })
        .onOk(data => {
          if (data === "") {
            toast("请输入新的昵称");
            return;
          }

          let params = {
            nick: data
          };
          this.updateUser(params)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    updateUser(params) {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      this.$axios
        .put(
          this.global.api.backurl +
            "user/updateUser?uuid=" +
            this.user.uuid,
          params,
          {
            headers: {
              "access-token": this.util.generateToken(
                JSON.stringify(params),
                timestamp
              ),
              timestamp2: timestamp
            }
          }
        )
        .then((response)=> {
          //console.log(response);
          if (response.status === 200 && response.data.code === 0) {
            toast("设置成功");
            this.getUserInfo()
          }
        });
    },
    getUserInfo() {
      let timestamp = new Date().getTime() + 1000 * 60 * 1;
      let params={
        uuid:this.user.uuid
      }
      this.$axios
        .get(this.global.api.backurl + "user/getinfo", {
          params: params,
          headers: {
            "access-token": this.util.generateToken(JSON.stringify(params), timestamp),
            timestamp2: timestamp
          }
        })
        .then(response => {
          // console.log(333,response);
          if (response.status === 200 && response.data.code === 0) {
            let data = response.data.data;
            data.avatar=this.global.api.aliyunosshostpubread+'/'+data.uuid+'.jpg'
            this.user=data
            localforage.setItem("user",JSON.stringify(this.user))
          }
        })
        .catch(error => {

          console.log(error);
        });
    },
    uploadImgOK() {
      let data = JSON.parse(JSON.stringify(this.user));
      data.avatar =
        this.global.api.aliyunosshostpubread +
        "/" +
        data.uuid +
        ".jpg?" +
        Math.random();
      this.user = data;

      // console.log(9991, this.user);
    },
    onFileChange(e) {
      // debugger
      let _this = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let file = files[0]; //File对象

      let reader = new FileReader(); //FileReader对象
      reader.readAsDataURL(file); //该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，readyState 会变成已完成（DONE），并触发 loadend 事件，同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
      reader.onload = e => {
        // _this.imgsrc = e.target.result; //图片内容的base64编码
        // _this.imgShow = true;
        // debugger
        // console.log(555)
        this.cropperDialog.img = e.target.result;
        this.cropperDialog.show = true;
        this.$refs.imgpicker.value = null; //重置后可以再次选择同一张图片
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.tx-bold {
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.photo-pickup {
  margin-top: 10px;
  width: 72px;
}
.edit-icon {
  width: 23px;
  height: 23px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
