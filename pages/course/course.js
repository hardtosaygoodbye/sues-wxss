//index.js
//获取应用实例
const app = getApp();
const dayArrStr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
let dateNow = new Date();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,

    weekIndex: 0,
    weekArr: [],

    month: 0,
    colWidth: 60,
    dayArr: [],
  },
  onShow() {
    this.refreshData();
  },
  preWeek() {
    dateNow = new Date(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.refreshData();
  },
  nextWeek() {
    dateNow = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.refreshData();
  },
  refreshData() {
    this.loadDateControl();
    this.loadDayHint();
    this.loadCourse();
  },
  loadCourse() {
    let dateNow 
    const course = wx.getStorageSync('course') ? wx.getStorageSync('course'): [];
  },
  loadDayHint() {
    const colWidth = (wx.getSystemInfoSync().windowWidth - 20) / 7 - 6;
    const ts = dateNow.getTime();
    const month = dateNow.getMonth() + 1;
    let day = dateNow.getDay();
    if (day === 0)
      day = 7;
    const tsStart = ts - (day - 1) * 24 * 60 * 60 * 1000;
    const tsEnd = ts + (7 - day) * 24 * 60 * 60 * 1000;
    const dateS = new Date(tsStart);
    const dateE = new Date(tsEnd);
    const dateStart = dateS.getDate();
    const dateEnd = dateE.getDate();
    let weekIndex = [];
    if (dateEnd > 6) {
      for (let i = 0, l = 7; i < l; i++) {
        weekIndex.push((dateStart + i) + '日');
      }
    } else {
      for (let i = 0, l = 7 - dateEnd; i < l; i++) {
        weekIndex.push((dateStart + i) + '日');
      }
      for (let i = 0, l = dateEnd; i < l; i++) {
        weekIndex.push((i + 1) + '日');
      }
    }
    let dayArr = [];
    for (let i = 0; i < 7; i++) {
      dayArr.push({
        week: dayArrStr[i],
        date: weekIndex[i]
      });
    }
    this.setData({
      weekIndex: this.data.weekArr.indexOf(this.calTimeInterval(dateNow)),
      colWidth: colWidth,
      month: month,
      dayArr: dayArr
    });
  },
  loadDateControl() {
    const startDate = new Date(dateNow.getFullYear() - 1, 8, 1).getTime();
    const endDate = new Date(dateNow.getFullYear() + 1, 7, 1).getTime();
    let weekArr = [];
    for (let i = startDate; i <= endDate; i += 7 * 24 * 60 * 60 * 1000) {
      weekArr.push(this.calTimeInterval(new Date(i)));
    }
    const weekIndex = weekArr.indexOf(this.calTimeInterval(dateNow));
    this.setData({
      weekArr: weekArr,
      weekIndex: weekIndex
    });
  },
  calTimeInterval(date) {
    const ts = date.getTime();
    const month = date.getMonth() + 1;
    let day = date.getDay();
    if (day === 0)
      day = 7;
    const tsStart = ts - (day - 1) * 24 * 60 * 60 * 1000;
    const tsEnd = ts + (7 - day) * 24 * 60 * 60 * 1000;
    const dateS = new Date(tsStart);
    const dateE = new Date(tsEnd);
    const dateStartStr = dateS.getFullYear() + '年' + (dateS.getMonth() + 1) + '月' + dateS.getDate() + '日';
    const dateEndStr = dateE.getFullYear() + '年' + (dateE.getMonth() + 1) + '月' + dateE.getDate() + '日';
    return dateStartStr + ' ~ ' + dateEndStr;
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})
