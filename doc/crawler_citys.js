const cityCrawler = require('./city_crawler_utils.js')
const mpaUtils = require('./wpa_content_utils.js')

const citys = [{
//   code: 'beijing',
//   name: '北京',
//   id: '3'
// }, {
//   code: 'shanghai',
//   name: '上海',
//   id: '42'
// }, {
//   code: 'tianjin',
//   name: '天津',
//   id: '22'
// }, {
//   code: 'chongqing',
//   name: '重庆',
//   id: '2'
// }, {
//   code: 'hangzhou',
//   name: '杭州',
//   id: '33'
// }, {
//   code: 'chengdu',
//   name: '成都',
//   id: '11'
// }, {
//   code: 'shenzhen',
//   name: '深圳',
//   id: '47'
// }, {
//   code: 'nanjing',
//   name: '南京',
//   id: '26'
// },{
//   code: 'suzhou',
//   name: '苏州',
//   id: '48'
// },{
//   code: 'wuhan',
//   name: '武汉',
//   id: '20'
// },{
//   code: 'changsha',
//   name: '长沙',
//   id: '38'
// },{
//   code: 'guangzhou',
//   name: '广州',
//   id: '36'
// },{
//   code: 'xian',
//   name: '西安',
//   id: '19'
// },{
  code: 'zhengzhou',
  name: '郑州',
  id: '15'
},]

oneByOne(citys).then(res => {
  console.log('所有的均完成')
})

function oneByOne(citys) {
  const city = citys.pop()

  return cityCrawler.pull(city.code, city.id, city.name).then(res => {
    // 城市合集
    return mpaUtils.writeToJsonFile(res, `../patch/20200818/${city.code}-all`).then(res => {
      if (citys.length) {
        return oneByOne(citys)
      }
      return Promise.resolve()
    })
  })
}