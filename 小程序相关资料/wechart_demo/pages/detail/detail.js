// pages/detail/detail.js
let datas = require('../../datas/list-data');
let appDatas = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},  // 初始化详情页数据
    isCollected: false, // 默认为未收藏
    isMusicPlay: false   // 默认为音乐未播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.id;
    this.setData({
      detailObj: datas.list_data[index],
      index
    });

    // 读取本地收藏的状态数据，根据收藏的状态更新显示
    let collectedObj = wx.getStorageSync('isCollected');
    if (collectedObj[index]){ // 之前为收藏状态
      this.setData({
        isCollected: true
      })
    }


    // 读取全局appData中数据，根据全局状态判断当前页面音乐是否在播放
    let {pageIndex, isPlay} = appDatas.data;
    if(pageIndex === index && isPlay === true){
      this.setData({
        isMusicPlay: true
      })
    }

    // 监听音乐停止
    wx.onBackgroundAudioStop(() => {
      // 更新当前页面的播放状态
      this.setData({
        isMusicPlay: false
      })

      // 修改全局的播放状态
      appDatas.data.isPlay = false;
    })
  },

  // 处理收藏的功能函数
  handleCollection(){
    let isCollected = !this.data.isCollected;
    // 更新是否收藏的状态
    this.setData({
      isCollected
    })
    // 显示提示功能
    let title = isCollected?'收藏成功': '取消收藏';
    wx.showToast({
      title,
    })

    // 将是否收藏的状态存储到本地
    // 1. 获取之前的收藏状态
    let oldCollectedObj = wx.getStorageSync('isCollected');
    // 2. 预处理从未收藏过的状态，获取的本地数据为空串
    oldCollectedObj = oldCollectedObj ? oldCollectedObj: {};
    // 3. 将当前页面收的状态存入对象中
    let index = this.data.index;
    oldCollectedObj[index] = isCollected;
    wx.setStorage({
      key: 'isCollected',
      data: oldCollectedObj,
    })

  },

  // 处理音乐播放的功能函数
  musicControl(){
    let isMusicPlay = !this.data.isMusicPlay;
    let index = this.data.index;
    let { dataUrl, title, coverImgUrl } = this.data.detailObj.music;
    if (isMusicPlay) { // 音乐播放
      wx.playBackgroundAudio({
        dataUrl, title, coverImgUrl
      });

      // 将音乐播放的状态存入全局appData中
      appDatas.data.pageIndex = index;
      appDatas.data.isPlay = true;

    } else { // 音乐停止
      wx.stopBackgroundAudio();
      appDatas.data.isPlay = false;
    }

    // 更新 isMusicPlay 的状态
    this.setData({ isMusicPlay });
  },

  // 点击分享按钮
  handleShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到qq空间', '分享到微信好友'],
      itemColor: '#666'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})