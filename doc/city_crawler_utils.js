const mpaUtils = require('./wpa_content_utils.js')
const types = [{
    type: "1",
    radioOptions: ['去过', '想去'],
    name: 'jingdian',
    name2: '景点'
  },
  {
    type: "2",
    radioOptions: ['吃过', '想吃'],
    name: 'meishi',
    name2: '美食'
  },
  {
    type: "3",
    radioOptions: ['了解', '感兴趣'],
    name: 'wenhua',
    name2: '文化'
  },
  {
    type: "4",
    radioOptions: ['了解', '感兴趣'],
    name: 'renwu',
    name2: '人物'
  }
]

module.exports = {
  pull: pull
}

function pull(city, cityId, cityName, intypes = types.slice(0)) {
  const type = intypes.pop()
  return mpaUtils.request(`http://baike.baidu.com/city/api/citylemmalist?type=${type.type}&cityId=${cityId}&offset=0&limit=1000&t=1597650135061`).then(html => {
    html = unescape(html.replace(/\\u/g, "%u")).replace(/\\\//g, '/')
    const res = JSON.parse(html)
    // console.log(res)
    const list = res.data.map(item => {
      return {
        content: item.lemmaTitle,
        remarks: [
          item.desc
        ],
        image: item.imgUrl,
        link: `https://baike.baidu.com/item/${item.lemmaTitle}`,
        radioOptions: type.radioOptions,
        group: city + '-' + type.name
      }
    })
    // 采集完成
    console.log(`采集完成${city} ${type.name}：${list.length}`)
    console.log(list[0])
    // 组也自动写
    return mpaUtils.writeToJsonFile([{
      _id: city + '-' + type.name,
      name: cityName + type.name2,
      category: '城市印象',
      count: list.length
    }], `../patch/20200818/groups`, 'a').then(res=>{
      // 之后写词条
      return mpaUtils.writeToJsonFile(list.slice(0), `../patch/20200818/${city}-${type.name}`).then(res => {
        if (intypes.length) {
          return pull(city, cityId, cityName, intypes).then(res=>{
            return list.concat(res)
          })
        } else {
          return Promise.resolve(list)
        }
      })
    })
  })
}