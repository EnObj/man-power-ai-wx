module.exports = {
  loadBatch: (db, mustHaveContentId)=>{
    // 词条组范围
    const selectedGroups = wx.getStorageSync('groups') || []
    return wx.cloud.callFunction({
      name: 'loadMpaContents',
      data: {
        groups: selectedGroups.map(group=>{
          return group._id
        })
      }
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
  },
  loadAllGroup: (db)=>{
    return loadGroupByPage(db)
  }
}

const loadGroupByPage = (db, groups=[])=>{
  return db.collection('mpa_content_group').skip(groups.length).get().then(res=>{
    if(res.data.length){
      return loadGroupByPage(db, groups.concat(res.data))
    }
    return groups
  })
}