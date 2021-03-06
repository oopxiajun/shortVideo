// components/scroll-video.js

const app = getApp();
const util = require('../utils/util')

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //父组件传入的视频列表
    videoList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          videoSize: newVal.length
        });
      }
    },
    //视频或者直播适配页面方式
    fitType: {
      type: String,
      value: 'contain',
    },
    //滑动距离的设置 超过该距离回出现页面下滑或者上滑的情况
    thresholdValue: {
      type: Number,
      value: 50,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal);
      }
    },
    //播放器类型
    playerType: {
      type: String,
      value: 'video',
      observer: function (newVal, oldVal) { }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    startY: 0, //开始y点
    screenHeight: 0, //获取当前屏幕高度
    screenWidth: 0,
    scrollAnimate: 0,
    videoidx: 0, //保存切换下标
    videoSize: 0, //视频列表的长度
  },
  ready: function () {
    this.animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear',
    });
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        })
      }
    })
    console.log(this.properties.videoList.length);
    this.setData({
      videoSize: this.properties.videoList.length
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //视频开始播放时调用函数
    bindplay: function (params) {
      //播放时修改播放量    
      var enterTime = util.formatTime(new Date());

      wx.request({
        url: app.serverUrl + 'shortvideo/play?pid=' + params.target.dataset.pid + "&upid=" + app.globalData.userInfo.pid + "&enterTime=" + enterTime,
      })
    },


    buttonhandle: function (e) {
      const {
        buttontype,
        buttonname,
        itemid,
        index
      } = e.detail;
      this.triggerEvent('menuTap', {
        buttontype,
        buttonname,
        itemid,
        index
      });
    },
    onTouchStart: function (e) {
      const {
        pageY
      } = e.changedTouches[0]; //记录手指位置
      this.setData({
        startY: pageY
      });
    },
    onTouchEnd: function (e) {
      let {
        videoidx
      } = e.currentTarget.dataset;
      videoidx = parseInt(videoidx)
      console.log(videoidx);
      let thresholdValue = this.properties.thresholdValue;


      const {
        startY
      } = this.data;
      let movey = e.changedTouches[0].pageY;
      let changeY = movey - startY;
      if (changeY > 0) {
        if (changeY >= thresholdValue) {
          if (videoidx === 0) {

            this.triggerEvent('swipeToStart', {
              oldindex: 0,
              newindex: videoidx,
              playerType: this.properties.playerType
            });
            return false;
          }
          let top_height = -((videoidx - 1) * this.data.screenHeight);
          console.log('手指向下滑动,往上切换视频');
          this.triggerEvent('swipeDown', {
            oldindex: videoidx,
            newindex: videoidx - 1,
            playerType: this.properties.playerType
          });
          this.animation.translateY(top_height).step();
          this.setData({
            scrollAnimate: this.animation.export(),
            videoidx: videoidx,
          });
        }
      } else {
        let abschangeY = Math.abs(changeY);
        if (abschangeY >= thresholdValue) {

          let btm_height = -((videoidx + 1) * this.data.screenHeight);
          this.animation.translateY(btm_height).step();

          if (videoidx + 1 === this.data.videoSize) {
            var self = this;
            console.log("newindex-------------1:" + videoidx);
            this.triggerEvent('swipeToEnd', {
              oldindex: videoidx + 1,
              newindex: videoidx,
              playerType: this.properties.playerType,
              callback: function () {
                console.log("callback:"+(videoidx + 1))
                self.triggerEvent('swipeUpper', {
                  oldindex: videoidx,
                  newindex: videoidx + 1,
                  playerType: self.properties.playerType
                });
                console.log('向上滑动,往下切换视频');
                self.setData({
                  scrollAnimate: self.animation.export(),
                  videoidx: videoidx,
                });
              }
            });
            return false;
          }
          this.triggerEvent('swipeUpper', {
            oldindex: videoidx,
            newindex: videoidx + 1,
            playerType: this.properties.playerType
          });
          console.log('向上滑动,往下切换视频');
          this.setData({
            scrollAnimate: this.animation.export(),
            videoidx: videoidx,
          });
        }
      }
    },
  }
})