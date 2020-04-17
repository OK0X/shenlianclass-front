/* eslint-disable */
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";




function timeUTC2Local(UTCDateString) {
  // if (!UTCDateString) {
  //   return "-";
  // }
  function formatFunc(str) {
    //格式化显示
    return str > 9 ? str : "0" + str;
  }
  var date2 = new Date(UTCDateString); //这步是关键
  var year = date2.getFullYear();
  var mon = formatFunc(date2.getMonth() + 1);
  var day = formatFunc(date2.getDate());
  var hour = date2.getHours();
  // var noon = hour >= 12 ? "PM" : "AM";
  // hour = hour >= 12 ? hour - 12 : hour;
  hour = formatFunc(hour);
  var min = formatFunc(date2.getMinutes());
  var dateStr = year + "-" + mon + "-" + day + " " + hour + ":" + min; //+":"+date2.getSeconds();
  return dateStr;
}





function isEmpty(e) {

  if (e === '' || typeof e === 'undefined' || e === null) {
    return true
  } else {
    return false
  }
}

function generateToken(str, timestamp) {
  str = str === null ? '{}' : str
  str = str + '900a06ca65a211e98eae00163e11f2fe' + timestamp
  var hash = 1315423911, i, ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return (hash & 0x7FFFFFFF);
}
function awaitWrap(promise) {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null])
}

function makeDownloadUrl(_this, filename) {
  let Expires = parseInt(new Date().getTime() / 1000) + 60 * 1;//1分钟
  let StringToSign =
    "GET\n\n\n" + Expires + "\n" + "/shenlianclass/" + filename;

  let Signature = encodeURIComponent(
    CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA1(
        StringToSign,
        _this.global.api.aliyunossaccesskey
      )
    )
  );

  return (
    _this.global.api.aliyunosshost +
    "/" +
    filename +
    "?OSSAccessKeyId=" +
    _this.global.api.aliyunossaccessid +
    "&Expires=" +
    Expires +
    "&Signature=" +
    Signature
  );
}

function hash(str) {
  var hash = 1315423911, i, ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return hash & 0x7FFFFFFF
};

function getShortTime(date) {
  //获取js 时间戳
  var time = new Date().getTime();
  //去掉 js 时间戳后三位，与php 时间戳保持一致
  time = parseInt((time - new Date(date).getTime()) / 1000);

  //存储转换值
  var s;
  if (time < 60 * 10) {//十分钟内
    return '刚刚';
  } else if ((time < 60 * 60) && (time >= 60 * 10)) {
    //超过十分钟少于1小时
    s = Math.floor(time / 60);
    return s + "分钟前";
  } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + "小时前";
  } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
    //超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + "天前";
  } else {
    //超过3天
    var date = new Date(date)
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
}

function loadingShow(_this) {
  _this.$q.loading.show({
    message: _this.$t("submiting"),
    spinnerSize: 50
  });
}

function loadingHide(_this) {
  _this.$q.loading.hide()
}

function getCourseStatus(status) {
  switch (status) {
    case 0:
      return '审核中'
    case 1:
      return '审核通过'
    case 2:
      return '已发布'
    case -1:
      return '已失效'
  }
}

function randomUUID() {
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var chars = CHARS, uuid = new Array(36), rnd = 0, r;
  for (var i = 0; i < 36; i++) {
    if (i == 8 || i == 13 || i == 18 || i == 23) {
      uuid[i] = '-';
    } else if (i == 14) {
      uuid[i] = '4';
    } else {
      if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join('').replace(/-/g, "").toLowerCase();
}

function uploadFile2OSS(_this, filename, file, pubRead, progress, success) {
  //aliyun oss
  _this.util.loadingShow(_this);

  var expireTime = new Date();
  expireTime.setSeconds(expireTime.getSeconds() + 60 * 10); //10分钟

  var policyText = {
    expiration: expireTime.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    conditions: [
      ["content-length-range", 0, 1024 * 1024 * 50] // 设置上传文件的大小限制单位字节，当前50M
    ]
  };

  var policyBase64 = Base64.encode(JSON.stringify(policyText));
  var encrypted = CryptoJS.HmacSHA1(
    policyBase64,
    _this.global.api.aliyunossaccesskey
  );
  var signature = CryptoJS.enc.Base64.stringify(encrypted);

  let formData = new FormData();
  formData.append("key", filename);
  formData.append("policy", policyBase64);
  formData.append("OSSAccessKeyId", _this.global.api.aliyunossaccessid);
  formData.append("success_action_status", "200");
  formData.append("signature", signature);
  formData.append("file", file, filename);

  let url = pubRead
    ? _this.global.api.aliyunosshostpubread
    : _this.global.api.aliyunosshost;
  _this.$axios
    .post(url, formData, {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;boundary=----WebKitFormBoundarytkUbKWcxgeMi1fIr"
      },
      onUploadProgress: progress
    })
    .then(response => {
      //console.log(response);
      if (response.status === 200) {
        toast("上传成功");
        if (success !== null) success();
      }
      _this.util.loadingHide(_this);
    })
    .catch(error => {
      console.error(error);

      _this.util.loadingHide(_this);
    });
}

function getFileIcon(filetype) {
  switch (filetype) {
    case "rar":
      return "statics/rar.png";
    case "pdf":
      return "statics/pdf.png";
    case "ppt":
      return "statics/ppt.png";
    case "apk":
      return "statics/apk.png";
    default:
      return "statics/file-default.png";
  }
}

export default {
  getFileIcon,
  uploadFile2OSS,
  timeUTC2Local,
  isEmpty,
  generateToken,
  awaitWrap,
  makeDownloadUrl,
  hash,
  getShortTime,
  loadingShow,
  loadingHide,
  getCourseStatus,
  randomUUID
};
