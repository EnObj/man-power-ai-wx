module.exports = {
  loadBatch: async (db)=>{
    // 求资源库条目总数目
    const {
      total: mpaContentCount
    } = await db.collection('mpa_content').count()

    // 随机抓取
    const result = []
    for(var i = 0; i < 5; i++){
      const mpaContent = await getOneMpaContentRandom(mpaContentCount, db)
      // 去重
      if(result.every(item=>{
        return item._id != mpaContent._id
      })){
        result.push(mpaContent)
      }
    }

    return Promise.resolve(result)
  }
}

const getOneMpaContentRandom = async(range, db)=>{

  // 随机查询一个出来
  const res = await db.collection('mpa_content').where({}).skip(Math.floor(Math.random() * range)).limit(1).get()

  return res.data[0]
}