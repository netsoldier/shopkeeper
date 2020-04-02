// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  if (event._id){
    return db.collection('sk_consume').doc(event._id).update({
      data: {
        amount: event.amount,
        is_show: 'true',
        type_name: event.type_name,
        comment: event.comment,
        type_id: event.type_id,
        user_id: event.user_id,
        consume_time: event.consume_time,
        consume_year: event.consume_year,
        consume_month: event.consume_month,
      },
      success: function (res) {
        console.log(res)
      }
    })
  }else{
    return db.collection('sk_consume').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        amount: event.amount,
        create_time: new Date(),
        is_show: 'true',
        type_name: event.type_name,
        comment: event.comment,
        type_id: event.type_id,
        user_id: event.user_id,
        consume_time: event.consume_time,
        consume_year: event.consume_year,
        consume_month: event.consume_month,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res);
      }
    })
  }
}