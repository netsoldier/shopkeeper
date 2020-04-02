
/*
*创建指定开始时间到当前到 月份 选择
*
*/
Component({

  /**
   * 页面的初始数据
   */
  data: {
  },

  properties: {
    //是否显示弹框
    showPopUp: {
      type:Boolean,
      value:false
    },
  },

  methods: {
    onClose: function () {
      this.setData({ showPopUp: false });
    },
    onClickMonth: function(event) {
      let _year =  event.currentTarget.dataset.year;//当前控件上绑定到年份
      let _month = event.currentTarget.dataset.month.toString();//当前控件上绑定到月份

      this.triggerEvent('getyearandmonth', { year: _year,month:_month });

      this.onClose();

    }
  }

})