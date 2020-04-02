import Page from '../common/base.page.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    money: null, //金额
    remark: '', //备注
    consume_time: '', //用户消费时间

    currentItem: {}, // 编辑模式下，传递过来的详情信息
    currentYear: "", // 年（编辑模式下，为传递过来信息）
    currentMonth: "", // 月（编辑模式下，为传递过来信息）
    currentDay: "", // 日（编辑模式下，为传递过来信息）
    currentSelectType: "", // 选中类型id
    currentSelectName: '', // 选中类型名字

    showPopUp: false, // 时间选择
    currentDate: new Date().getTime(), // 时间组件设置-当前时间
    minDate: new Date(2019, 0, 1).getTime(), // 时间组件设置-最小时间
    maxDate: new Date().getTime(), // 时间组件设置-最大时间
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },

    listArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 页面被展示 获取消费分类
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getConsumeType',
      complete: res => {
        this.setData({
          listArr: res.result.data
        });
        if (options.item) {
          let item = JSON.parse(options.item);
          // 编辑模式下，初始化页面信息
          this.showEditModeInfo(item);
        } else {
          // 日期选择初始赋值
          this.setData({
            currentYear: new Date().getFullYear().toString(),
            currentMonth: (new Date().getMonth() + 1).toString(),
            currentDay: new Date().getDate().toString()
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //编辑模式下，初始化页面信息
  showEditModeInfo: function(item) {
    // 正则替换，用于解决iOS系统中，不识别yyyy-mm-dd 和 yyyy.mm.dd
    // iOS 系统识别 yyyy/mm/dd
    let preDate = new Date(item.consume_time.replace(/\.|\-/g, '/'));
    this.setData({
      _id: item._id,
      consume_time: item.consume_time,
      currentYear: preDate.getFullYear().toString(), // 年月日
      currentMonth: (preDate.getMonth() + 1).toString(),
      currentDay: preDate.getDate().toString(),
      money: item.amount, // 消费金额
      remark: item.comment, // 备注
      currentSelectType: item.type_id, // 选中类型
      currentSelectName: item.type_name,
      currentDate: new Date(item.consume_time).getTime(), // 时间组件设置-上次保存时间
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
    let nowDate = new Date();
    let _pickerDate = new Date(option.detail);
    let year = _pickerDate.getFullYear();
    let month = _pickerDate.getMonth() + 1;
    let day = _pickerDate.getDate();
    this.setData({
      currentYear: year.toString(),
      currentMonth: month.toString(),
      currentDay: day.toString(),
      consume_time: year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours()) + ':' + (nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes()) + ':' + (nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds())
    });
    console.log(this.data.consume_time);
    this.onCloseDatePicker();
  },

  // 输入消费金额
  getInputMoney: function(e) {
    this.setData({
      money: e.detail.value
    });
  },
  // 输入备注
  getInputRemark: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  // 选中类型 -- 修改选中状态
  doSelectType: function(e) {
    if (e.currentTarget.dataset.item) {
      this.setData({
        currentSelectType: e.currentTarget.dataset.item.type_id,
        currentSelectName: e.currentTarget.dataset.item.type_name
      });
    }
  },

  /**
   * 用户点击方法
   */
  clickSure() {
    if (this.data.money <= 0) {
      wx.showToast({
        title: '请输入消费金额',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.currentSelectType) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.consume_time) {
      let nowDate = new Date();
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let day = nowDate.getDate();
      this.data.consume_time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours()) + ':' + (nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : nowDate.getMinutes()) + ':' + (nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : nowDate.getSeconds())
    }

    //添加数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      //传给云函数的参数
      data: {
        _id: this.data._id,
        amount: Number(this.data.money),
        type_name: this.data.currentSelectName,
        comment: this.data.remark,
        type_id: this.data.currentSelectType,
        user_id: app.globalData.openID,
        consume_time: this.data.consume_time.toString(),
        consume_year: this.data.currentYear,
        consume_month: this.data.currentMonth
      },
      complete: res => {
        if (res.errMsg == 'cloud.callFunction:ok') {
          wx.showToast({
            title: '',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
        } else {
          wx.showToast({
            title: '请重新尝试',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
})