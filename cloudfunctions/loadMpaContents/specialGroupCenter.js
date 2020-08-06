const rememberDay = require('./remeber-day.js')
const earthPeople = require('./earth-people.js')
const crawlerWenwu = require('./crawler_wenwu.js')

module.exports = {
  count(groups) {
    const providers = getProviders(groups)
    return Promise.all(providers.map(provider => {
      return provider.getCount()
    })).then(counts => {
      return counts.reduce((res, count) => {
        return res + count
      }, 0)
    })
  },
  getOneMpaContentRandom(groups, targetNum) {
    const providers = getProviders(groups)
    return Promise.all(providers.map(provider => {
      return provider.getCount().then(count=>{
        return {
          count: count,
          provider: provider
        }
      })
    })).then(countedProviders=>{
      var count = 0
      //  寻找中标的实例
      for (var i = 0; i < countedProviders.length; i++) {
        const countedProvider = countedProviders[i]
        count += countedProvider.count
        if (count >= targetNum) {
          return countedProvider.provider.getOneMpaContentRandom()
        }
      }
    })
  },
  getOneMpaContentRandomOnGroup(group){
    const provider = getProviders([group])[0]
    if(provider){
      return provider.getOneMpaContentRandom()
    }
    return Promise.resolve()
  }
}

// 得到有资格参与摇号的组
function getProviders(groups) {
  const allGroups = [rememberDay, earthPeople, crawlerWenwu]
  if(groups && groups.length){
    return allGroups.filter(provider => {
      return groups.includes(provider.getGroupName())
    })
  }
  return allGroups
}