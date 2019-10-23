const app = getApp();
const dayArrStr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const defaultBg = '/res/default_bg.jpg'
const palette = ['#1abc9c7f', '#3498db7f', '#9b59b67f', '#f1c40f7f', '#e67e227f', '#e74c3c7f'];
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

    courseScrollHeight: 0,
    title: [],
    weekIndex: 0,
    weekArr: [],
    month: 0,
    colWidth: 60,
    courses: [],
    bgImg: defaultBg,
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
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
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onLoad() {
    // 壁纸
    let bgImg = wx.getStorageSync('bgImg')
    if (!bgImg) {
      bgImg = defaultBg;
    }
    this.setData({
      bgImg: bgImg
    });
    // 课程scrollview高度
    this.setData({
      courseScrollHeight: wx.getSystemInfoSync().windowHeight - 70 - app.globalData.CustomBar
    });
    wx.showShareMenu();
    const course = wx.getStorageSync('course');
    app.globalData.course = course ? course : [];
    const startDate = new Date(dateNow.getFullYear() - 1, 8, 1).getTime();
    const endDate = new Date(dateNow.getFullYear() + 1, 7, 1).getTime();
    let weekArr = [];
    for (let i = startDate; i <= endDate; i += 7 * 24 * 60 * 60 * 1000) {
      weekArr.push(this.calTimeInterval(new Date(i)));
    }
    dateNow = new Date();
    const weekIndex = weekArr.indexOf(this.calTimeInterval(dateNow));
    this.setData({
      weekArr: weekArr,
      weekIndex: weekIndex
    });
  },
  onShow() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function() {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    });
    const bg = wx.getStorageSync('bg');
    this.setData({
      bg: bg
    });
    this.renderData(this, dateNow);
  },
  bindPreWeek() {
    dateNow = new Date(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.renderData(this, dateNow);
  },
  bindNextWeek() {
    dateNow = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.renderData(this, dateNow);
  },
  renderData(that, date) {
    const colWidth = (wx.getSystemInfoSync().windowWidth - 20) / 7 - 6;
    const ts = date.getTime();
    const month = date.getMonth() + 1;
    let day = date.getDay();
    if (day === 0) day = 7;
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
    let title = [];
    for (let i = 0; i < 7; i++) {
      title.push({
        week: dayArrStr[i],
        date: weekIndex[i]
      })
    }

    that.setData({
      weekIndex: that.data.weekArr.indexOf(that.calTimeInterval(date)),
      colWidth: colWidth,
      month: month,
      title: title
    });
    if (app.globalData.course.length > 0) {
      // 有数据，加载课表
      that.renderCourses(app.globalData.course, date);
    } else {
      // 没有数据，提示登录
      wx.showModal({
        title: '提示',
        content: '无课程数据，从教学系统获取？',
        confirmText: '是',
        cancelText: '否',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/loginSchool/loginSchool'
            });
          }
        }
      });
    }
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
  getWeekOfYear: (date) => {
    var firstDay = new Date(date.getFullYear(), 0, 1);
    var dayOfWeek = firstDay.getDay();
    var spendDay = 1;
    if (dayOfWeek !== 0) {
      spendDay = 7 - dayOfWeek + 1;
    }
    firstDay = new Date(date.getFullYear(), 0, 1 + spendDay);
    var d = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000);
    var result = Math.ceil(d / 7);
    return result + 1;
  },
  renderCourses: function(res, date) {
    const weekNumNow = this.getWeekOfYear(date);
    let courses = [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ];
    for (let i = 0, l = res.length; i < l; i++) {
      const r = res[i];
      const week = r.week;
      if (week.substr(weekNumNow - 1, 1) === '1') {
        courses[r.index].push({
          name: r.name,
          teacher: r.teacher,
          address: r.address,
          time: r.time,
          bg: palette[(parseInt(r.time.split(',')[0]) + parseInt(r.index)) % 6]
        })
      }
    }
    // 上下位置参数
    for (let i = 0, l = courses.length; i < l; i++) {
      const dayCourses = courses[i];
      let timeSet = [];
      let dataSet = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ];
      for (let m = 0, n = dayCourses.length; m < n; m++) {
        const course = dayCourses[m];
        const time = course.time.split(',');
        for (let j = 0, k = time.length; j < k; j++) {
          timeSet.push(parseInt(time[j]));
          dataSet[parseInt(time[j])] = course;
        }
      }
      let newCourses = [];
      for (let m = 0, n = 14; m < n; m++) {
        if (this.isInArray(timeSet, m)) {
          newCourses.push(dataSet[m]);
        } else {
          newCourses.push({});
        }
      }
      // 得到包含14个元素的数组（newCourses），没课则空，有课则有数据
      // 判断是否要合并，并提供相关CSS参数
      let lastCourse = newCourses[0];
      let lastTime = [];
      let sameNum = 0;
      let newDayCourses = [];
      let ifFirst = 1;
      for (let m = 0, n = 14; m < n; m++) {
        const course = newCourses[m];
        if (course.name === lastCourse.name && m !== 13) {
          sameNum++;
          if (course.hasOwnProperty('time')) {
            lastTime = lastTime.concat(course.time.split(','));
          }
        } else {
          if (m === 13)
            sameNum++;
          const height = 60 * (1 + sameNum) - 6 - 60 * ifFirst;
          // 结算上一段一样的课
          if (lastCourse.hasOwnProperty('name')) {
            if (lastTime.length === 0) {
              lastTime = ["12", "13"]
            }
            const time = this.distinctArr(lastTime);
            let name = lastCourse.name;
            if (name.length > 12) {
              name = name.substr(0, 11) + '…'
            }
            // 有课
            newDayCourses.push({
              week: dayArrStr[i],
              name: name,
              teacher: lastCourse.teacher,
              address: lastCourse.address.replace('(中外教室）', ''),
              timeorg: time,
              bg: lastCourse.bg,
              height: height
            })
          } else {
            // 没课
            newDayCourses.push({
              name: '',
              teacher: '',
              address: '',
              bg: '#ffffff00',
              height: height
            })
          }
          lastCourse = course;
          lastTime = [];
          sameNum = 0;
          ifFirst = 0;
        }
      }
      courses[i] = newDayCourses;
    }
    this.setData({
      courses: courses
    });
  },
  showDetail: e => {
    const course = e.currentTarget.dataset;
    if (course.name !== '') {
      wx.showModal({
        title: course.name,
        content: course.address + ' ' + course.teacher,
        confirmText: '好',
        showCancel: false
      });
    }
  },
  rnd: (n, m) => {
    return Math.floor(Math.random() * (m - n + 1) + n);
  },
  isInArray: (arr, value) => {
      for (let i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    }

    // 数组去重
    ,
  distinctArr: (arr) => {
    let len = arr.length;
    arr.sort(function(a, b) { //对数组进行排序才能方便比较
      return a - b;
    });
    function loop(index) {
      if (index >= 1) {
        if (arr[index] === arr[index - 1]) {
          arr.splice(index, 1);
        }
        loop(index - 1); //递归loop函数进行去重
      }
    }
    loop(len - 1);
    return arr;
  },
  bindWeekChange(e) {
    const weekIndex = e.detail.value;
    this.setData({
      weekIndex: weekIndex
    });
    const a = this.data.weekArr[weekIndex].split('年');
    const year = parseInt(a[0]);
    const b = a[1].split('月');
    const month = parseInt(b[0]) - 1;
    const c = b[1].split('日');
    const date = parseInt(c[0]);
    dateNow = new Date(year, month, date);
    this.renderData(this, dateNow);
  },
  bindUpdateCourse() {
    this.hideModal();
    wx.navigateTo({
      url: '/pages/loginSchool/loginSchool',
    });
  },
  bindFeedback() {
    this.hideModal();
    wx.navigateTo({
      url: '/pages/tk/tk',
    })
  },
  bindSetBg() {
    this.hideModal();
    const self = this;
    wx.showActionSheet({
      itemList: ['不使用', '使用系统自带', '从相册中选择'],
      success: (e) => {
        switch (e.tapIndex) {
          case 0:
            self.setBgImg('');
            break;
          case 1:
            self.setBgImg(defaultBg);
            break;
          case 2:
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              sourceType: ['album', 'camera'],
              success(res) {
                const imgPath = res.tempFilePaths[0];
                self.setBgImg(imgPath);
              }
            });
            break;
        }
      }
    });
  },
  setBgImg(bgImg) {
    wx.setStorageSync('bgImg', bgImg);
    this.setData({
      bgImg: bgImg
    });
    wx.showToast({
      title: '壁纸更换成功！'
    });
  }
})