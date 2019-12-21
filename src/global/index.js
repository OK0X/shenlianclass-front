
/* eslint-disable */
const debug = true
const apiconfig = {
  BmobRestAPIUrl: 'https://api2.bmob.cn/1/',
  BmobRestAPIHeaders: {
    "X-Bmob-Application-Id": "ac7f17d258941e666eb88514048c351a",
    "X-Bmob-REST-API-Key": "f31e47e1bcf4d276e1bc19226abee442",
    "Content-Type": "application/json"
  },
  bmobotcappid: 'ac7f17d258941e666eb88514048c351a',//上传微信二维码用
  bmobotcapikey: 'f31e47e1bcf4d276e1bc19226abee442',
  infuraPROJECTID: '9a81acdff7f54d69863937a52f5e7244',
  etherscanAPIKey: '7PJM9WX71AEI9SF29XG318XMB9CE4JWMYP',
  etherscanapi: debug?'https://ropsten.etherscan.io/':'https://api-cn.etherscan.com/', 
  etherscancn: debug?'https://ropsten.etherscan.io/':'https://cn.etherscan.com/', 
  otcbackapi: debug?'http://localhost/api/v1/':'https://api.ok0x.com/api/v1/',
  ethgasstationapi: 'https://ethgasstation.info/json/ethgasAPI.json',
  aliyunosshost:'https://otcfiles.oss-cn-shenzhen.aliyuncs.com',
  aliyunossaccessid:'LTAI4Fcj6yde1NHcFQ8Wc4yf',
  aliyunossaccesskey:'Fcleo7v1Xfn9SAAz9y0vH5wA1uVjU6'
}

export default {
  apiconfig
};

