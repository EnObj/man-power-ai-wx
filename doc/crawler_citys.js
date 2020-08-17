const cityCrawler = require('./city_crawler_utils.js')
const mpaUtils = require('./wpa_content_utils.js')

const citys = [{
  code: 'beijing',
  name: '北京',
  id: '3'
},{
  code: 'shanghai',
  name: '上海',
  id: '42'
},{
  code: 'tianjin',
  name: '天津',
  id: '22'
},{
  code: 'chongqing',
  name: '重庆',
  id: '2'
}]

oneByOne(citys).then(res=>{
  console.log('所有的均完成')
})

function oneByOne(citys){
  const city = citys.pop()

  return cityCrawler.pull(city.code, city.id, city.name).then(res=>{
    // 城市合集
    return mpaUtils.writeToJsonFile(res, `../patch/20200817/${city.code}-all`).then(res=>{
      if(citys.length){
        return oneByOne(citys)
      }
      return Promise.resolve()
    })
  })
}