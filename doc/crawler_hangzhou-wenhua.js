const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

mpaUtils.request('http://baike.baidu.com/city/api/citylemmalist?type=3&cityId=33&offset=0&limit=100&t=1597650135061').then(html=>{
  html = unescape(html.replace(/\\u/g, "%u")).replace(/\\\//g, '/')
  const res = JSON.parse(html)
  // console.log(res)
  const list = res.data.map(item=>{
    return {
      content: item.lemmaTitle,
      remarks: [
        item.desc
      ],
      image: item.imgUrl,
      link: `https://baike.baidu.com/item/${item.lemmaTitle}`,
      radioOptions: ['了解','感兴趣'],
      group: 'hangzhou-wenhua'
    }
  })

  // 采集完成
  console.log(`采集完成：${list.length}`)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200817/hangzhou-wenhua')
})