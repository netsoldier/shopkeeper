// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const MAX_LIMIT = 10;

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('sk_consume')
    .aggregate()
    .match({
      user_id: event.user_id,
      type_id: event.type_id,
      consume_year: event.consume_year,
      consume_month: event.consume_month,
    })
    .skip(event.pageIndex * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .end()
}