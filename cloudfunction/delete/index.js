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

  return db.collection('sk_consume').doc(event._id).update({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 is_show 字段置为 false
      is_show: 'false'
    },
    success: function (res) {
      console.log(res.data)
    }
  })
}