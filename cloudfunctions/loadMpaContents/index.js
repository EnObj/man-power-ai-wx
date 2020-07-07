// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 求资源库条目总数目
  const {
    total: mpaContentCount
  } = await db.collection('mpa_content').count()

  // 随机抓取
  const result = []
  for(var i = 0; i < 20; i++){
    const mpaContent = await getOneMpaContentRandom(mpaContentCount)
    // 去重
    if(result.every(item=>{
      return item._id != mpaContent._id
    })){
      result.push(mpaContent)
    }
  }

  // 去重

}

const getOneMpaContentRandom = async(range)=>{

  const {
    data: mpaContent
  } = await db.collection('mpa_content').where({}).skip(Math.ceil(Math.random() * range)).limit(1).get()

  return mpaContent
}