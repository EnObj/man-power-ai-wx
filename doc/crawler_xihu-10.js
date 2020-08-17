const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

mpaUtils.request('https://jingyan.baidu.com/article/76a7e4099d0c1dfc3b6e15a3.html').then(html=>{
  // console.log(html)
  const $ = cheerio.load(html)
  const list = []
  $('#format-exp > div:nth-child(3) > div > ol > li').each((index, item)=>{
    const ps = $(item).find('div.content-list-text > p')
    list.push({
      content: ps.eq(0).text().trim(),
      remarks: [
        ps.eq(1).text().trim()
      ],
      radioOptions: ['去过','想去'],
      group: 'xihu-10',
      sort: list.length + 1
    })
  })

  // 采集完成
  console.log(`采集完成：${list.length}`)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200817/xihu-10')
})