<template>
  <div style="display:flex;    flex-direction: column;">
    <q-input :dense="true" v-model.trim="text" type="textarea" style="width:100%;margin:20px;" />
    <q-btn label="开始导入" @click="addUser" />
    <div class="upload">
      <div>
        <input type="file" id="fileUpload" @change="fileChange($event)">
        <label class="status">上传状态: <span>{{statusText}}</span></label>
      </div>
      <div class="upload-type">
        上传方式一, 使用 UploadAuth 上传:
        <button @click="authUpload" :disabled="uploadDisabled">开始上传</button>
        <button @click="pauseUpload" :disabled="pauseDisabled">暂停</button>
        <button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button>
        <span class="progress">上传进度: <i id="auth-progress">{{authProgress}}</i> %</span>
      </div>
    </div>
    <div class="info">uploadAuth及uploadAddress参数请查看<a href="https://help.aliyun.com/document_detail/55407.html" target="_blank">获取上传地址和凭证</a></div>
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
      addconnt: 0,
      uin: "",
      nick: "",
      age: "",
      timeout: '',
        partSize: '',
        parallel: '',
        retryCount: '',
        retryDuration: '',
        region: 'cn-shanghai',
        userId: '1303984639806000',
        file: null,
        authProgress: 0,
        uploadDisabled: true,
        resumeDisabled: true,
        pauseDisabled: true,
        uploader: null,
        statusText: ''
    };
  },
  mounted(){
    this.testapi()
  },
  methods: {
    fileChange (e) {
        this.file = e.target.files[0]
        if (!this.file) {
          alert("请先选择需要上传的文件!")
          return
        }
        var Title = this.file.name
        var userData = '{"Vod":{}}'
        if (this.uploader) {
          this.uploader.stopUpload()
          this.authProgress = 0
          this.statusText = ""
        }
        this.uploader = this.createUploader()
        console.log(userData)
        this.uploader.addFile(this.file, null, null, null, userData)
        this.uploadDisabled = false
        this.pauseDisabled = true
        this.resumeDisabled = true
      },
      authUpload () {
        // 然后调用 startUpload 方法, 开始上传
        if (this.uploader !== null) {
          this.uploader.startUpload()
          this.uploadDisabled = true
          this.pauseDisabled = false
        }
      },
      // 暂停上传
      pauseUpload () {
        if (this.uploader !== null) {
          this.uploader.stopUpload()
          this.resumeDisabled = false
          this.pauseDisabled = true
        }
      },
      // 恢复上传
      resumeUpload () {
        if (this.uploader !== null) {
          this.uploader.startUpload()
          this.resumeDisabled = true
          this.pauseDisabled = false
        }
      },
      createUploader (type) {
        let self = this
        let uploader = new AliyunUpload.Vod({
          timeout: self.timeout || 60000,
          partSize: self.partSize || 1048576,
          parallel: self.parallel || 5,
          retryCount: self.retryCount || 3,
          retryDuration: self.retryDuration || 2,
          region: self.region,
          userId: '1961309669016566',
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
            self.uploadDisabled = false
            self.resumeDisabled = false
            self.statusText = '添加文件成功, 等待上传...'
            console.log("addFileSuccess: " + uploadInfo.file.name)
          },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
              let createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
              self.$axios.get(createUrl).then(({data}) => {
                let uploadAuth = data.UploadAuth
                let uploadAddress = data.UploadAddress
                let videoId = data.VideoId
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)                
              })
              self.statusText = '文件开始上传...'
              console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
              self.$axios.get(refreshUrl).then(({data}) => {
                let uploadAuth = data.UploadAuth
                let uploadAddress = data.UploadAddress
                let videoId = data.VideoId
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)
              })
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
            self.statusText = '文件上传成功!'
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
            self.statusText = '文件上传失败!'
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
            self.statusText = '文件已暂停上传'
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
            let progressPercent = Math.ceil(progress * 100)
            self.authProgress = progressPercent
            self.statusText = '文件上传中...'
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
            let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
            self.$axios.get(refreshUrl).then(({data}) => {
              let uploadAuth = data.UploadAuth
              uploader.resumeUploadWithAuth(uploadAuth)
              console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
            })
            self.statusText = '文件超时...'
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {
            console.log("onUploadEnd: uploaded all the files")
            self.statusText = '文件上传完毕'
          }
        })
        return uploader
      },
    testapi(){
      let timestamp = new Date().getTime();
      this.$axios
        .get(this.global.apiconfig.otcbackapi + "vod/generateDataKey", {
          params: null,
          headers: {
            "access-token": this.util.generateToken(null, timestamp),
            "otc-timestamp": timestamp
          }
        })
        .then(response=>{
          console.log(response)
        })
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


        let nick = unescape(item.nick.replace(/\\u/g, "%u"));
        // console.log('---去除前：'+nick)
        nick = nick.replace(/&nbsp;/g, "");
        // console.log('---去除后：'+nick)


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
            if (response.data.code === 0) {
              this.addconnt++;
              console.log("已成功写入：" + this.addconnt + "条");
            }
          });
      }
    },
    addUser2() {
      let params = {
        uin: this.uin,
        nick: this.nick,
        age: 22,
        gender: "男",
        country: '中国',
        province: '广东',
        city: '深圳',
        extra2: "学生" //职业
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
          if (response.data.code === 0) {
            this.addconnt++;
            console.log("已成功写入：" + this.addconnt + "条");
            this.uin=''
            this.nick=''
            this.age=''
          }
        });
    }
  }
};
</script>
