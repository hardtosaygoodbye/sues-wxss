const app = getApp();
Page({
  data: {
    github: app.globalData.github
  },
  copyNUM() {
    wx.setClipboardData({
      data: '470879821'
    })
  }
});