const app = getApp();
Page({
  data: {
    github: app.globalData.github
  },
  copyNUM() {
    wx.setClipboardData({
      data: 'onion_rings'
    })
  }
});