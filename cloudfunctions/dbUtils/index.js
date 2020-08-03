// 云函数入口文件
const cloud = require('wx-server-sdk')
const mpaUtils = require('./../../doc/wpa_content_utils.js')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const groups = event.groups || ['nbe-wlx','nbe-hx','nbe-slx-yx','nbe-wx','nbe-hp','nbe-jjx']

  const res = await db.collection('mpa_content_group').where({
    _id: db.command.in(groups)
  }).get()

  mpaUtils.writeToJsonFile(res.data, 'groups')
}