//此处定义所有页面公共特性，比如分享
export default function (options = {}) {
  return Page({
    onShareAppMessage: function () {
      return {
        title: '掌柜记账，好记，好用'
      };
    },
    ...options
  });
}