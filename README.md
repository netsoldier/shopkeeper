# 掌柜记账

便捷好用的生活记账本，适用于旅游记账，旅行记账，生意记账，学生记账，学生账本，亲子账本，人情记账，日常记账，家庭账本，随手记账等。

再也不担心钱花哪儿了，简洁的记账流程，清晰的图表展示， 让你随时随地掌握资金流向，及时调整支出，是您满意的记账小程序！

本小程序是一款基于原生小程序及云开发模式的记账类小程序

小程序使用了 [Vant Weapp](https://youzan.github.io/vant-weapp/#/intro) 组件库

欢迎已经扫码使用的你，通过「产品建议」给作者反馈信息

![](gh_af02fb142490_430.jpg)


## 云函数

- add 添加一笔记账
- consumeList 统计页面，用于统计汇总信息
- delete 删除一笔记账
- getAmountList 获取统计列表数据总金额
- getConsumeType 获取记账分类
- getDetailData 获取单笔记账详情信息
- getIndexList 获取首页数据列表
- getOpenID 获取当前用户openid
  
## 数据库
- sk_consume 记账表 ([可参见docs/sk_consume.md](./docs/sk_consume.md))
- sk_consume_type 记账类型表 ([可参见 docs/sk_consume_type.json](./docs/sk_consume_type.json))

