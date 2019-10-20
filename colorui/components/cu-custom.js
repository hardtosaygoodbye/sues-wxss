const app = getApp();

Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的对外属性
     */
    properties: {
        bgColor: {
            type: String,
            default: ''
        },
        isCustom: {
            type: [Boolean, String],
            default: false
        },
        isBack: {
            type: [Boolean, String],
            default: false
        },
        bgImage: {
            type: String,
            default: ''
        },
    },
    /**
     * 组件的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom
    },
    /**
     * 组件所在页面的生命周期
     */
    pageLifetimes: {
        resize: async (size) => {
            // 页面尺寸变化
            this.renew();
        }
    },
    /**
     * 组件的生命周期
     */
    lifetimes: {
        attached: function () {
            this.renew();
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        renew() {
            let that = this;
            // 刷新页面参数
            wx.getSystemInfo({
                success: function (e) {
                    app.globalData.StatusBar = e.statusBarHeight;
                    let custom = wx.getMenuButtonBoundingClientRect();
                    app.globalData.Custom = custom;
                    app.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight + 5;
                    that.setData({
                        StatusBar: app.globalData.StatusBar,
                        CustomBar: app.globalData.CustomBar,
                        Custom: app.globalData.Custom
                    });
                }
            });
        },
        BackPage() {
            wx.navigateBack({
                delta: 1
            });
        },
        toHome() {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        }
    }
});