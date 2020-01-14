
/* eslint-disable */
const debug = true
const api = {
  backurl: debug?'http://localhost/api/v1/':'https://api.shenlianclass.com/api/v1/',
  aliyunosshost:'https://otcfiles.oss-cn-shenzhen.aliyuncs.com',
  aliyunossaccessid:'LTAI4Fcj6yde1NHcFQ8Wc4yf',
  aliyunossaccesskey:'Fcleo7v1Xfn9SAAz9y0vH5wA1uVjU6',
  bombsmsurl:'https://api2.bmob.cn/1/',
  bombheader:{
    "X-Bmob-Application-Id": "ac7f17d258941e666eb88514048c351a",
    "X-Bmob-REST-API-Key": "f31e47e1bcf4d276e1bc19226abee442",
    "Content-Type": "application/json"
  }
}


export default {
  api
};

