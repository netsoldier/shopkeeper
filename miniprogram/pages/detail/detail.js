import Page from '../common/base.page.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从上一页传递过来的详情对象
    let item = JSON.parse(options.item);
    this.setData({ currentItem: item});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },
  getData:function(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getDetailData',
      //传给云函数的参数
      data: {
        _id: this.data.currentItem._id
      },
      complete: res => {
        this.setData({ currentItem: res.result.data});
      }
    })
  },
  clickDelete: function (){
    Dialog.confirm({
      title: '提示',
      message: '删除后无法恢复，是否删除?'
    }).then(() => {
      // TODO 操作数据删除操作
      //添加数据
      wx.cloud.callFunction({
        // 云函数名称
        name: 'delete',
        //传给云函数的参数
        data: {
          _id: this.data.currentItem._id
        },
        complete: res => {
          console.log('callFunction delete result: ', res.errMsg)
          if (res.errMsg == 'cloud.callFunction:ok') {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          } else {
            wx.showToast({
              title: '请重新尝试',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })

    }).catch(() => {
      
    });
  },

  clickEdit:function() {
    var objItem = JSON.stringify(this.data.currentItem);
    wx.navigateTo({
      url: '/pages/note/note?item=' + objItem,
    })
  }
})