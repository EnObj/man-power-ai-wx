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
    const cache = wx.getStorageSync('all_groups')
    if(cache){
      // 如果过期了，重新异步加载一次
      if(Date.now() - cache.time > 15 * 60000){
        loadGroupByPage(db).then(groups=>{
          saveGroupsToCache(groups)
        })
      }
      return Promise.resolve(cache.list)
    }
    // 没有缓存的情况：加载到缓存并返回
    return loadGroupByPage(db).then(groups=>{
      saveGroupsToCache(groups)
      return groups
    })
  }
}

const saveGroupsToCache = (groups)=>{
  wx.setStorage({
    data: {
      list: groups,
      time: Date.now()
    },
    key: 'all_groups',
  })
}

const loadGroupByPage = (db, groups=[])=>{
  return db.collection('mpa_content_group').skip(groups.length).get().then(res=>{
    if(res.data.length){
      return loadGroupByPage(db, groups.concat(res.data))
    }
    return groups
  })
}