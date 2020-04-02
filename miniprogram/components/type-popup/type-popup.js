// components/type-popup/type-popup.js
var app = getApp();

Component({

  options: {
    // styleIsolation: 'shared'
  },

  data: {
    typeArr: [],
  },
  properties: {
    //是否显示弹框
    showPopUp: {
      type: Boolean,
      value: false
    },
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示 获取消费分类
      wx.cloud.callFunction({
        // 云函数名称
        name: 'getConsumeType',
        complete: res => {
          res.result.data.unshift({ _id: '', type_id:'', type_name:'全部'});
          this.setData({
            typeArr: res.result.data
          });
        }
      });
    },
  },

  methods: {
    onClose: function () {
      this.setData({ showPopUp: false });
    },
    onClickType: function (event) {
      let _typeid = event.currentTarget.dataset.typeid;//当前控件上绑定的类型id
      let _typename = event.currentTarget.dataset.typename;//当前控件上绑定的类型名称

      this.triggerEvent('gettypevalue', { typeid: _typeid, typename: _typename });

      this.onClose();

    }
  }


})