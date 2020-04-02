import Page from '../common/base.page.js';

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    showTypePopup: false, // 类型弹框是否显示
    showDatePopup: false, // 日期弹框是否显示
    currentTypeId: "", // 类型ID
    currentTypeName: "类型", // 类型名称
    currentYear: "", // 年份
    currentMonth: "", // 月份
    currentDate: new Date().getTime(), // 时间组件设置-当前时间
    minDate: new Date(2019, 0, 1).getTime(), // 时间组件设置-最小时间
    maxDate: new Date().getTime(), // 时间组件设置-最大时间
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    userInfo: {},
    hasUserInfo: false,
    listArr: [],
    pageIndex: 0,
    money: 0
  },
  onLoad: function() {
    // 日期选择初始赋值
    this.setData({
      currentYear: new Date().getFullYear().toString(),
      currentMonth: (new Date().getMonth() + 1).toString()
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.openID) {
      app.openIDReadyCallback = res => {
        app.globalData.openID = res.result.openId;
        this.refreshData();
      }
    } else {
      this.refreshData();
    }
  },

  refreshData: function() {
    this.data.pageIndex = 0;
    this.data.listArr = [];
    //获得列表的总金额
    this.getListMoney();
    //获得列表的数据
    this.getListData();
  },

  //获取列表数据
  getListData: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getIndexList',
      data: {
        pageIndex: this.data.pageIndex,
        user_id: app.globalData.openID, //用户id
        type_id: this.data.currentTypeId,
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        console.log('callFunction index——list result: ', res)
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // 隐藏加载框
        wx.hideLoading();
        // console.log(res[0]);
        if (res.result.list.length <= 0 && this.data.pageIndex > 0) {
          this.data.pageIndex--
            return;
        }
        this.setData({
          listArr: this.data.listArr.concat(res.result.list)
        });
      }
    });
  },

  //获得总金额
  getListMoney: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getIndexList',
      data: {
        type: 'sum', //表示计算金额
        user_id: app.globalData.openID, //用户id
        type_id: this.data.currentTypeId, //消费类型
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        console.log('callFunction index-account result: ', res);
        if (res.result.list.length > 0) {
          this.setData({
            money: res.result.list[0].totalConsume
          })
        } else {
          this.setData({
            money: 0
          })
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.data.pageIndex = 0;
    this.data.listArr = [];
    this.refreshData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    this.data.pageIndex = ++this.data.pageIndex;
    this.getListData();
  },

  // 弹出类型选择弹框
  doShowTypePopup: function() {
    this.setData({
      showTypePopup: true
    });
  },
  // 选择类型并赋值
  onSelectType: function(e) {
    // console.log(e);
    this.setData({
      currentTypeName: e.detail.typename,
      currentTypeId: e.detail.typeid
    });
    this.data.listArr = [];
    this.refreshData();
  },

  // 显示时间选择控件
  showDatePicker: function(e) {
    this.setData({
      showDatePopup: true
    });
  },
  // 隐藏时间选择控件
  onCloseDatePicker: function() {
    this.setData({
      showDatePopup: false
    });
  },
  // 显示时间选择器
  onConfirmDatePicker: function(option) {
    if (!option.detail) return;
    let _pickerDate = new Date(option.detail);
    this.setData({
      currentYear: _pickerDate.getFullYear().toString(),
      currentMonth: (_pickerDate.getMonth() + 1).toString()
    });
    this.data.listArr = [];
    this.refreshData();
    this.onCloseDatePicker();
  },

  // 跳转详情页
  goItemDetail: function(e) {
    var objItem = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/detail/detail?item=' + objItem,
    })
  },

})