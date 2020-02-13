/* eslint-disable */
import CryptoJS from "crypto-js";

function showInfoDialog(_this,txhash,isBack) {
  _this.$q
    .dialog({
      title: '',//_this.$t("submitted"),
      message: _this.$t('submittips'),
      // ok: _this.$t('viewresults'),
      // cancel: _this.$t('close')
    })
    .then(() => {
      // debugger
      // openURL(_this.global.apiconfig.etherscanio + "tx/" + txhash);
      if(isBack)
       _this.$router.go(-1);
      
    })
    .catch(() => {
      if(isBack)
       _this.$router.go(-1);
    });
}



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



/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** xuanfeng 2014-08-28
*/
 
function randomWord(randomFlag, min, max){
  var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if(randomFlag){
      range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
      str += arr[Math.round(Math.random() * (arr.length-1))];
  }
  return str;
}

function isEmpty(e){

  if(e===''||typeof e==='undefined'||e===null){
    return true
  }else{
    return false
  }
}
function generateToken(str,timestamp) {
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

function makeImgUrl(_this,filename) {
  let Expires = parseInt(new Date().getTime() / 1000) + 600;
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

function getShortTime(date){
  //获取js 时间戳
  var time=new Date().getTime();
  //去掉 js 时间戳后三位，与php 时间戳保持一致
  time=parseInt((time-new Date(date).getTime())/1000);

  //存储转换值
  var s;
  if(time<60*10){//十分钟内
      return '刚刚';
  }else if((time<60*60)&&(time>=60*10)){
      //超过十分钟少于1小时
      s = Math.floor(time/60);
      return  s+"分钟前";
  }else if((time<60*60*24)&&(time>=60*60)){ 
      //超过1小时少于24小时
      s = Math.floor(time/60/60);
      return  s+"小时前";
  }else if((time<60*60*24*3)&&(time>=60*60*24)){ 
      //超过1天少于3天内
      s = Math.floor(time/60/60/24);
      return s+"天前";
  }else{ 
      //超过3天
      var date= new Date(date)
      return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
  }
}

function loadingShow(_this){
  _this.$q.loading.show({
    message: _this.$t("submiting"),
    spinnerSize: 50
  });
}

function loadingHide(_this){
  _this.$q.loading.hide()
}

export default {
  showInfoDialog,
  timeUTC2Local,
  randomWord,
  isEmpty,
  generateToken,
  awaitWrap,
  makeImgUrl,
  hash,
  getShortTime,
  loadingShow,
  loadingHide
};
