const app = getApp()

Page({

  data: {
    motto: '等待服务器响应',
    tempFilePaths: null,
    decode: 0,
    host: 'e29698a4a971b8d84166b8fbc56947e5',
    addToken: 0,
    userKey: 0,
    grantCode: 0,
    list: [{
      "text": "对话",
      "iconPath": "/page/weui/images/tabbar_icon_chat_default.png",
      "selectedIconPath": "/page/weui/images/tabbar_icon_chat_active.png",
      dot: true
    },
    {
      "text": "设置",
      "iconPath": "/page/weui/images/tabbar_icon_setting_default.png",
      "selectedIconPath": "/page/weui/images/tabbar_icon_setting_active.png",
      badge: 'New'
    }]
  },

  confirm: function () {
    var key = this.data.userKey
    var stats = this.data.grantCode
    if (key == 'buptyes') {
      this.setData({
        userKey: 0,
        grantCode: 1
      }),
        wx.showModal({
          title: '欢迎使用',
          content: '权限鉴定成功，请按照指引步骤操作数据库'
        })
    }
    else
      wx.showModal({
        title: '密码错误',
        content: '权限鉴定失败，请检查拼写或联系管理员'
      })
  },
  verify: function (e) {
    this.setData({
      userKey: e.detail.value
    })
  },

  onLoad: function () {
    wx.showModal({
      title: '使用提示',
      content: '请在充足光线下拍摄面部照片（图片大小请勿超过2M)，如设备故障请联系管理员。'
    })
  },


  //确定图片来源，从相册中选择或者是拍照
  chooseImage: function () {
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: (res) => {
        if (res.cancel) {
          return;
        }
        if (res.tapIndex == 0) {
          this.chooseWxImage('album')
        } else if (res.tapIndex == 1) {
          this.chooseWxImage('camera')
        }
      }
    })

  },
  //数据库图片上传
  host: function () {
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: (res) => {
        if (res.cancel) {
          return;
        }
        if (res.tapIndex == 0) {
          this.chooseWxImage('album')
        } else if (res.tapIndex == 1) {
          this.chooseWxImage('camera')
        }
      }
    })

  },
  //数据库图片解析
  database: function () {
    var code = this.data.decode
    var host = this.data.host
    var that = this


    wx.request({
      url: 'https://api-cn.faceplusplus.com/facepp/v3/compare?api_key=WzQDsGmIcIeYYDDdVFcbXlmOe3iIN-zU&api_secret=G1lb8puA1JUjZiILmzXdpqjQ6c9-BnlF',
      method: 'POST',
      data: {
        'image_base64_1': code,
        'image_base64_2': code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        that.setData({
          addToken: res.data.faces2[0].face_token  //保存特征值
        })
        wx.showModal({
          title: '解析成功',
          content: '人脸特征值解析请求成功，请执行下一步',
        })
      },
      complete() {
        wx.showModal({
          title: '解析请求等待中',
          content: '请求处理中，若等待5秒以上仍未出现成功提示，则请求失败，请检查图片大小以及图片质量并重试',
        })
      }
    })
  },

  dataUpload: function () {
    var code = this.data.decode
    var host = this.data.host
    var that = this
    var token = this.data.addToken

    wx.request({
      url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface?api_key=WzQDsGmIcIeYYDDdVFcbXlmOe3iIN-zU&api_secret=G1lb8puA1JUjZiILmzXdpqjQ6c9-BnlF',
      method: 'POST',
      data: {
        'face_tokens': token,
        "faceset_token": "c2f21835722915a67dbe69ca8ca101c2"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        wx.showModal({
          title: '上传成功',
          content: '人脸特征值上传请求成功',
        })
      },
      complete() {
        wx.showModal({
          title: '上传请求等待中',
          content: '请求处理中，若等待5秒以上仍未出现成功提示，则请求失败，请检查图片大小以及图片质量并重试',
        })
      }
    })

    that.setData({
      motto: '等待服务器响应'
    })
  },

  dataDelete: function () {
    var that = this
    var addToken
    var code = this.data.decode
    var token = this.data.addToken
    wx.request({
      url: 'https://api-cn.faceplusplus.com/facepp/v3/faceset/removeface?api_key=WzQDsGmIcIeYYDDdVFcbXlmOe3iIN-zU&api_secret=G1lb8puA1JUjZiILmzXdpqjQ6c9-BnlF',
      method: 'POST',
      data: {
        'face_tokens': token,
        "faceset_token": "c2f21835722915a67dbe69ca8ca101c2"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        wx.showModal({
          title: '删除成功',
          content: '人脸特征值删除请求成功',
        })
      },
      complete() {
        wx.showModal({
          title: '删除请求等待中',
          content: '请求处理中，若等待5秒以上仍未出现成功提示，则请求失败，请手动删除该特征数据',
        })
      }
    })
  },
  //选择图片
  chooseWxImage: function (type) {
    var that = this
    var FSM = wx.getFileSystemManager();
    let $this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: (res) => {
        this.setData({
          tempFilePaths: res.tempFilePaths,
        })
        FSM.readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success: function (data) {

            that.setData({
              decode: data.data,
            })
          }
        })
      }
    })

  },

  finalCheck: function () {
    var confidence = this.data.motto
    if (confidence == '等待服务器响应') {
      wx.showModal({
        title: '鉴权失败',
        content: '请先执行步骤1°与2°',
      })
    }
    else {
      if (confidence >= 90) {

        wx.request({
          url: 'https://api.heclouds.com/mqtt?topic=lock',
          header: {
            'content-type': 'application/json',
            'api-key': 'C9U=fuqEJPkkK2HMYcUiYsjcbkQ='
          },
          method: 'POST',
          data: "1"
          ,
          success(res) {
            console.log(res.data)
            wx.showModal({
              title: '验证成功√',
              content: `相似度为${confidence},数据已发送至Onenet端,欢迎回家！`
            })
          }
        })

      }
      else if (confidence <= 90 && confidence >= 60) {
        wx.request({
          url: 'https://api.heclouds.com/mqtt?topic=lock',
          header: {
            'content-type': 'application/json',
            'api-key': 'C9U=fuqEJPkkK2HMYcUiYsjcbkQ='
          },
          method: 'POST',
          data: "0",
          success(res) {
            console.log(res.data)
            wx.showModal({
              title: '验证失败！',
              content: `相似度为${confidence},小于阈值,请检查照片并重试！`
            })
          }
        })
      }
      else {
        wx.request({
          url: 'https://api.heclouds.com/mqtt?topic=lock',
          header: {
            'content-type': 'application/json',
            'api-key': 'C9U=fuqEJPkkK2HMYcUiYsjcbkQ='
          },
          method: 'POST',
          data: "2",
          success(res) {
            console.log(res.data)
            wx.showModal({
              title: '验证失败！',
              content: `相似度为${confidence},偏离过大！报警信号将被发送至Onenet端！`
            })
          }
        })
      }
    }
    var that = this
    that.setData({
      motto: '等待服务器响应'
    })
  },

  //识别图片
  identifyImage: function () {
    var that = this
    var code = this.data.decode
    var host = this.data.host
    var res = this.data.res
    wx.request({
      url: 'https://api-cn.faceplusplus.com/facepp/v3/search?api_key=WzQDsGmIcIeYYDDdVFcbXlmOe3iIN-zU&api_secret=G1lb8puA1JUjZiILmzXdpqjQ6c9-BnlF',
      method: 'POST',
      data: {
        "faceset_token": "c2f21835722915a67dbe69ca8ca101c2",
        'image_base64': code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        that.setData({
          motto: res.data.results[0].confidence  //返回相似度
        })
        wx.showModal({
          title: '识别成功',
          content: '人脸识别请求成功，请执行下一步',
        })
      },
      complete() {
        wx.showModal({
          title: '识别等待中',
          content: '请求处理中，若等待5秒以上仍未出现成功提示，则请求失败，请检查图片大小以及图片质量并重试',
        })
      }
    })

  }
})