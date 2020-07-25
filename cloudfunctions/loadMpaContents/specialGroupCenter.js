const rememberDay = require('./remeber-day.js')

module.exports = {
  count(groups){
    if(groups.includes(rememberDay.getGroupName())){
      return rememberDay.getCount()
    }
    return Promise.resolve(0)
  },
  getOneMpaContentRandom(){
    return rememberDay.getOneMpaContentRandom()
  }
}