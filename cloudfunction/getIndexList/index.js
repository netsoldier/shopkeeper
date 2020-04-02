// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
const db = cloud.database()
const $ = db.command.aggregate

exports.main = async(event, context) => {
  if (event.type == 'sum') { //统计数量
    if (event.type_id) { //选择类型的情况
      return db.collection('sk_consume')
        .aggregate()
        .match({
          user_id: event.user_id,
          type_id: event.type_id,
          is_show:'true',
          consume_year: event.consume_year,
          consume_month: event.consume_month,
        })
        .group({
          _id:{
            user_id: '$user_id',
            type_id: '$type_id',
            consume_year: '$consume_year',
            consume_month: '$consume_month',
          },
          

          totalConsume: $.sum('$amount')
        })
        .end()
    }else{
      return db.collection('sk_consume')
        .aggregate()
        .match({
          user_id: event.user_id,
          is_show: 'true',
          consume_year: event.consume_year,
          consume_month: event.consume_month,
        })
        .group({
          _id:{
            user_id: '$user_id',
            consume_year: '$consume_year',
            consume_month: '$consume_month',
          },

          totalConsume: $.sum('$amount')
        })
        .end()
    }
  } else {
    //获取列表数据
    const MAX_LIMIT = 10;
    if (event.type_id) {
      return db.collection('sk_consume')
        .aggregate()
        .match({
          user_id: event.user_id,
          type_id: event.type_id,
          is_show: 'true',
          consume_year: event.consume_year,
          consume_month: event.consume_month,
        })
        .skip(event.pageIndex * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .end()
    } else {
      return db.collection('sk_consume')
        .aggregate()
        .match({
          user_id: event.user_id,
          is_show: 'true',
          consume_year: event.consume_year,
          consume_month: event.consume_month,
        })
        .sort({
          consume_time: -1 //倒叙
        })
        .skip(event.pageIndex * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .end()
    }

  }

}