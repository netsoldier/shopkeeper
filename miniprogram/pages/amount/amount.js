import Page from '../common/base.page.js';

//获取应用实例
const app = getApp()

Page({
  data: {
    totalConsume: 0,
    showPopUp: false, // 时间选择
    consumeTypeId: '', //消费类型id
    currentDate: new Date().getTime(), // 时间组件设置-当前时间
    currentYear: "", // 年份
    currentMonth: "", // 月份
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
    listArr: [],
  },
  onLoad: function() {
    // 日期选择初始赋值
    this.setData({
      currentYear: new Date().getFullYear().toString(),
      currentMonth: (new Date().getMonth() + 1).toString(),
    });

  },
  onShow: function() {
    if (!app.globalData.openID) {
      app.openIDReadyCallback = res => {
        app.globalData.openID = res.result.openId;
        this.getNewData();
      }
    } else {
      this.getNewData();
    }
  },

 onPullDownRefresh:function(){
   // 显示顶部刷新图标
   wx.showNavigationBarLoading();
   this.data.listArr=[];
   this.getNewData();
 },

  getNewData: function() {
    this.data.listArr = [];
    //获得列表的总金额
    this.getListMoney();
    //获得列表的数据
    this.getListData();
  },

  getListMoney: function() {
    //获取列表数据总金额
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAmountList',
      data: {
        type: 'sum', //表示计算金额
        user_id: app.globalData.openID, //用户id
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        console.log('callFunction index-amount result: ', res);
        if (res.result.list.length > 0) {
          this.setData({
            totalConsume: res.result.list[0].totalConsume
          })
        } else {
          this.setData({
            totalConsume: 0
          })
        }
      }
    });
  },

  getListData: function() {
    wx.cloud.callFunction({
      name: 'getAmountList',
      data: {
        user_id: app.globalData.openID, //用户id
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        console.log('callFunction list-amount result: ', res);
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // 隐藏加载框
        wx.hideLoading();
        let consumeList = res.result.list;
        if (consumeList.length > 0) {
          this.setData({
            listArr: this.data.listArr.concat(res.result.list)
          });
        } else {
          this.setData({
            listArr: []
          });
        }
      }
    });
  },
  // 显示时间选择控件
  showDatePicker: function(e) {
    this.setData({
      showPopUp: true
    });
  },
  // 隐藏时间选择控件
  onCloseDatePicker: function() {
    this.setData({
      showPopUp: false
    });
  },
  // 显示时间选择器
  onConfirmDatePicker: function(option) {
    if (!option.detail) return;
    console.log('amount option===>', option);
    let _pickerDate = new Date(option.detail);
    this.setData({
      currentYear: _pickerDate.getFullYear().toString(),
      currentMonth: (_pickerDate.getMonth() + 1).toString()
    });

    this.data.listArr = [];
    this.onCloseDatePicker();
    this.getListMoney();
    this.getListData()
  },

  clickType: function(e) {
    wx.navigateTo({
      url: '../amount/list?year=' + this.data.currentYear + "&month=" + this.data.currentMonth + "&type_id=" + e.currentTarget.dataset.item._id.type_id
    })
  },
})