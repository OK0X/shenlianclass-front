
/* eslint-disable */
const debug = false
const api = {
  backurl: debug?'http://localhost/api/v1/':'https://api.shenlianclass.com/api/v1/',
  aliyunosshost:'https://shenlianclass.oss-cn-shanghai.aliyuncs.com',
  aliyunosshostpubread:'https://shenlianclasspubread.oss-cn-shanghai.aliyuncs.com',
  aliyunossaccessid:'LTAI4FmgqTnRgG8ibrsXmDEF',
  aliyunossaccesskey:'vQ6FlwR8H1IOnVIthQp5XSTciQg6EQ',
  bombsmsurl:'https://api2.bmob.cn/1/',
  bombheader:{
    "X-Bmob-Application-Id": "ac7f17d258941e666eb88514048c351a",
    "X-Bmob-REST-API-Key": "f31e47e1bcf4d276e1bc19226abee442",
    "Content-Type": "application/json"
  }
}

let backendConfig={
  answerReward:1
}

let routeCache={
  //缓存了以下内容
  // courseDetail:null,
  // askDetail:null,
  // ressouceDetail:null,
  // courseCheckDetail:null,
  // indexCache:null,
  // allCourse:null
  //知识问答-全部问答
  //资源下载
  //我的课程
}

const requestExpireT=1000 * 60 * 1//一分钟

export default {
  api,
  backendConfig,
  routeCache,
  requestExpireT
};

