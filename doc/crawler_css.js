const http = require('http')
const cheerio = require('cheerio')
const mpaUtils = require('./wpa_content_utils.js')

const targetUrl = 'https://www.runoob.com/cssref/css-reference.html'

mpaUtils.request(targetUrl).then(html => {
  // console.log(html)
  const $ = cheerio.load(html)
  const list = []
  $('#content > table').each((index, item) => {
    if (index) { // 跳过第一个表格
      const category = $(item).prev().text().trim()
      $(item).find('tr').each((index, item) => {
        if (index) { // 跳过第一个tr
          // 采集信息
          const tds = $(item).find('td')
          // console.log(tds.length)
          if(index == 1){
            console.log(category, tds.eq(0).text().trim())
          }
          list.push({
            content: tds.eq(0).text().trim(),
            remarks: [
              tds.eq(1).text().trim(),
              'CSS' + tds.eq(2).text().trim(),
            ],
            group: 'css',
            radioOptions: ['了解', '不了解']
          })
        }
      })
    }
  })
  console.log(list.length)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, 'css')
})