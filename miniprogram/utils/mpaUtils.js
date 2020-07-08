module.exports = {
  loadBatch: async (db, mustHaveContentId)=>{
    // 求资源库条目总数目
    const {
      total: mpaContentCount
    } = await db.collection('mpa_content').count()

    // 随机抓取
    const result = []
    for(var i = 0; i < 10; i++){
      const mpaContent = await getOneMpaContentRandom(mpaContentCount, db)
      // 去重
      if(result.every(item=>{
        return item._id != mpaContent._id
      })){
        result.push(mpaContent)
      }
    }

    // 加载特殊分子
    if(mustHaveContentId){
      const {data:mustHaveContent} = await db.collection('mpa_content').doc(mustHaveContentId).get()
      result.unshift(mustHaveContent)
    }

    return Promise.resolve(result)
  }
}

const getOneMpaContentRandom = async(range, db)=>{

  // 随机查询一个出来
  const res = await db.collection('mpa_content').where({}).skip(Math.floor(Math.random() * range)).limit(1).get()

  return res.data[0]
}