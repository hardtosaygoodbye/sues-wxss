//app.js
App({
    onLaunch: function () {
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    },
    globalData: {
        apiServer: 'https://pineapple.swiftwhale.cn/',
        course: [],
        cookie: null,
        token: null
    }
});