//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    //测试视频列表
    videoList:
      [{
        "pid": 1,
        "nickName": "夏子曦",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/iakK5WvR2nH0XxSDibQNxtsB0beNAJzo4A5Dx4mUQ1dwwmYKGEHUibs4iafRcibX6g5dqH1OfRYtBUK1ibMYc5w9qqdA/132",
        "coverImage": "http://1400340488.vod2.myqcloud.com/d64cdb6avodtranscq1400340488/a62970e65285890801263370455/coverBySnapshot/1587444672_1568444854.100_0.jpg",
        "description": "测试视频13333333",
        "playUrl": "http://1400340488.vod2.myqcloud.com/ff62edc2vodcq1400340488/a62970e65285890801263370455/r4AlYLZ5rxUA.mp4",
        "likeCount": 9,
        "commentCount": 10
      },
      {
        "pid": 2,
        "nickName": "夏子曦2",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/iakK5WvR2nH0XxSDibQNxtsB0beNAJzo4A5Dx4mUQ1dwwmYKGEHUibs4iafRcibX6g5dqH1OfRYtBUK1ibMYc5w9qqdA/132",
        "coverImage": "../../images/p002.png",
        "description": "测试视频2",
        "playUrl": "http://www.w3school.com.cn/example/html5/mov_bbb.mp4",
        "likeCount": 19,
        "commentCount": 110
      }
      ],
    playerType: 'video',
    fitType: 'contain'
  },
  //修改视频属性 保证只有一个video被创建
  controlVideoPlayer: function (list, index) {
    if (list.length === 0) {
      return [];
    } else {
      list.forEach((item, i) => {
        if (index === i) {
          item.video_is_player = true;
        } else {
          item.video_is_player = false;
        }
      });
      return list;
    }
  },
  onLoad: function (options) {
    if(this.data.playerType==='video'){
      let videolist = this.controlVideoPlayer(this.data.videoList, 0);
      console.log(videolist)
      this.setData({
        videoList: videolist
      });
    }
  },
  //上滑事件
  swipeUpper: function (e) {
    const {
      newindex
    } = e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({
      videoList: videolist
    });
  },
  //下滑事件
  swipeDown: function (e) {
    const {
      newindex
    } = e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({
      videoList: videolist
    });
  },
  //下滑到最后一条数据
  swipeToEnd: function (e) {
    wx.showLoading({
      title: '加载中',
      duration: 1000
    })
    console.log(e);
    const {
      newindex,
      playerType
    } = e.detail;

    var newdata = [{
      "pid": 122,
      "nickName": "夏子曦" + util.formatTime(new Date()),
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/iakK5WvR2nH0XxSDibQNxtsB0beNAJzo4A5Dx4mUQ1dwwmYKGEHUibs4iafRcibX6g5dqH1OfRYtBUK1ibMYc5w9qqdA/132",
      "coverImage": "http://1400340488.vod2.myqcloud.com/d64cdb6avodtranscq1400340488/a62970e65285890801263370455/coverBySnapshot/1587444672_1568444854.100_0.jpg",
      "description": "测试视频13333333" + util.formatTime(new Date()),
      "playUrl": "http://1400340488.vod2.myqcloud.com/ff62edc2vodcq1400340488/a62970e65285890801263370455/r4AlYLZ5rxUA.mp4",
      "likeCount": 9,
      "commentCount": 10
    }];
    var nowPid = this.data.videoList[newindex].pid

    let res = this.data.videoList;

    var self = this;

    self.setData({
      videoList: self.controlVideoPlayer(res.concat(newdata), newindex),
    });
  },
  //点击左侧按钮
  menuTap: function (e) {

    var self = this;
    const {
      buttontype,
      buttonname,
      itemid,
      index
    } = e.detail;
    console.log(buttontype, buttonname, itemid, index);
    switch (buttontype) {
      case "1":
        self.likeBindTap(itemid, index);
        break;
      case "2":
        console.log(buttonname, '打开发消息弹框或者新页面');
        wx.showToast({
          title: '打开消息框',
          duration: 1500
        })
        break;

      case "3":
        console.log(buttonname, '调用微信分享');
        wx.showToast({
          title: this.data.playerType,
          duration: 1500
        })
        break;
    }
  },
  //上滑到第一条数据
  swipeToStart: function (e) {
    wx.showToast({
      title: '当前第一个视频',
      icon: 'none'
    })
    console.log(e);
  },

  //点赞
  likeBindTap: function (itemPid, index) {
    const self = this;
    var submitTime = util.formatTime(new Date());
    wx.request({
      url: app.serverUrl + 'shortvideo/SubmitLike',
      method: 'POST',
      dataType: 'json',
      data: {
        ShortVideoId: itemPid,
        UserId: app.globalData.userInfo.pid,
        SubmitTime: submitTime
      },
      success: (res) => {
        if (res.data && res.data.body) {
          var status = self.data.videoList[index].userLikeStatus;
          if (status == 1) {
            self.data.videoList[index].userLikeStatus = 0;
            self.data.videoList[index].likeCount = self.data.videoList[index].likeCount - 1;
            wx.showToast({
              title: '取消成功',
              icon: "success"
            })
          } else {
            self.data.videoList[index].userLikeStatus = 1;
            self.data.videoList[index].likeCount = self.data.videoList[index].likeCount + 1;
            wx.showToast({
              title: '点赞成功',
              icon: "success"
            })
          }
          self.setData({
            videoList: self.data.videoList
          })
        }
      }
    })
  },
})