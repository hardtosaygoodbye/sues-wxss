const app = getApp();
Page({
  data: {
    showTopTips: false,
    btnLoading: false,
    tipes: '错误提示',
    img: ''
  },
  onLoad() {
    const username = wx.getStorageSync('username');
    const password = wx.getStorageSync('password');
    this.setData({
      username: username,
      password: password
    })
  },
  usernameInput: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  onImport(e) {
    const self = this;
    const username = this.data.username;
    const password = this.data.password;
    if (username.length === 0) {
      return
    }
    if (password.length === 0) {
      return
    }
    self.setData({
      btnLoading: true,
      showTopTips: false
    });
    const url = app.globalData.apiServer + 'sues/courses';
    let data = {
      username: username,
      password: password
    };
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: res => {
        wx.setStorageSync('username', username);
        wx.setStorageSync('password', password);
        if (res.statusCode === 200) {
          const resData = res.data;
          self.setData({
            btnLoading: false
          });
          if (resData.hasOwnProperty('detail')) {
            self.setData({
              showTopTips: true,
              tipes: resData.detail + '，请重试'
            });
          } else if (resData.hasOwnProperty('errMsg')) {
            self.setData({
              showTopTips: true,
              tipes: resData.errMsg + '，请重试'
            });
          } else {
            self.setData({
              showTopTips: false
            });
            wx.setStorageSync('updateTime', (new Date()).getTime());
            wx.showToast({
              title: '导入成功',
              complete: () => {
                setTimeout(() => {
                  app.globalData.course = res.data;
                  wx.setStorageSync('course', res.data);
                  wx.navigateBack();
                }, 1500);
              }
            })
          }
        } else {
          self.setData({
            showTopTips: true,
            btnLoading: false,
            tipes: '服务器维护中，请稍后再试'
          });
        }
      }
    })
  }
});