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
  const {groups} = event
  const where = {}
  if(groups && groups.length > 0){
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
  if(!!allCount){
    for(var i = 0; i < 10; i++){
      // 有一定的几率命中special
      if(Math.ceil(Math.random() * (allCount)) > mpaContentCount){
        const mpaContent = await specialGroupCenter.getOneMpaContentRandom()
        result.push(mpaContent)
        continue
      }
      const mpaContent = await getOneMpaContentRandom(mpaContentCount, where)
      // 去重（关闭）
      if(result.every(item=>{
        // return item._id != mpaContent._id
        return true
      })){
        result.push(mpaContent)
      }
    }
  }

  return result
}

const getOneMpaContentRandom = async(range, where)=>{

  const res = await db.collection('mpa_content').where(where).skip(Math.floor(Math.random() * range)).limit(1).get()

  return res.data[0]
}