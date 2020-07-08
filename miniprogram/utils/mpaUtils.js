module.exports = {
  loadBatch: async (db, mustHaveContentId)=>{
    // 求资源库条目总数目
    return wx.cloud.callFunction({
      name: 'loadMpaContents',
      data: {}
    }).then(res=>{
      const result = res.result
      // 加载特殊分子
      if(!mustHaveContentId){
        return Promise.resolve(result)
      }
      return db.collection('mpa_content').doc(mustHaveContentId).get().then(res=>{
        result.unshift(res.data)
        return result
      })
    })
  }
}