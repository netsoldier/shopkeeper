import Page from '../common/base.page.js';

//获取应用实例
const app = getApp();

// 显示某年某月某类型 下的所有消费明细
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    currentYear: "", // 对应年份
    currentMonth: "", // 对应月份
    currentTypeId: "", // 对应分类
    userId: "", //用户id
    pageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 日期选择初始赋值
    this.setData({
      currentYear: new Date().getFullYear().toString(),
      currentMonth: (new Date().getMonth() + 1).toString(),

      currentYear: options.year,
      currentMonth: options.month,
      currentTypeId: options.type_id,
      userId: app.globalData.openID,
    });
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.data.listArr = [];
    if (!app.globalData.openID) {
      app.openIDReadyCallback = res => {
        app.globalData.openID = res.result.openId;
        this.getListData();
      }
    } else {
      this.getListData();
    }
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
  //获取列表数据
  getListData: function() {
    //获取列表数据
    wx.cloud.callFunction({
      name: 'consumeList',
      data: {
        pageIndex: this.data.pageIndex,
        user_id: this.data.userId, //用户id
        type_id: this.data.currentTypeId, 
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        console.log('callFunction list result: ', res)
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // 隐藏加载框
        wx.hideLoading();
        if (res.result.list.length <= 0 && this.data.pageIndex > 0) {
          this.data.pageIndex--
          return;
        }
        this.setData({
          listArr: this.data.listArr.concat(res.result.list)
        });
      }
    })
  },

  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.data.listArr = [];
    this.getListData();
  },

  // // 跳转详情页
  // goItemDetail: function(e) {
  //   var objItem = JSON.stringify(e.currentTarget.dataset.item);
  //   wx.navigateTo({
  //     url: '/pages/detail/detail?item=' + objItem,
  //   })
  // },


})