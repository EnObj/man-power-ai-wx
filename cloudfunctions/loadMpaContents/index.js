// 云函数入口文件
const cloud = require('wx-server-sdk')
const specialGroupCenter = require('./specialGroupCenter.js')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)

  // 组范围
  const {
    groups
  } = event
  const where = {}
  if (groups && groups.length > 0) {
    where.group = db.command.in(groups)
  }
  // 求资源库条目总数目
  const {
    total: mpaContentCount
  } = await db.collection('mpa_content').where(where).count()
  // 求特别组条目总数目
  const specialTotal = await specialGroupCenter.count(groups)
  const allCount = mpaContentCount + specialTotal

  // 随机抓取
  const result = []
  if (!!allCount) {
    for (var i = 0; i < 10; i++) {
      // 有一定的几率命中special
      const targetNum = Math.ceil(Math.random() * (allCount))
      if (targetNum > mpaContentCount) {
        // 得到特别词条
        const mpaContent = await specialGroupCenter.getOneMpaContentRandom(groups, targetNum - mpaContentCount)
        result.push(mpaContent)
        continue
      }
      // 得到存档词条
      const mpaContent = await getOneMpaContent(targetNum - 1, where)
      result.push(mpaContent)
    }
  }

  return result
}

const getOneMpaContent = async (skip, where) => {

  const res = await db.collection('mpa_content').where(where).skip(skip).limit(1).get()

  return res.data[0]
}