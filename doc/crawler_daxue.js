const http = require('http')
const cheerio = require('cheerio')
const url = require('url')
const mpaUtils = require('./wpa_content_utils.js')

const targetUrl = 'http://docpe.com/Download/072613374370/072613374370.html'
http.get(targetUrl, (res) => {
  var html = "";
  res.on("data", function (chunk) {
    html += chunk; //监听数据响应，拼接数据片段
  })
  res.on("end", function () {
    // console.log(html)
    const $ = cheerio.load(html)
    const list = []
    for(var i = 4; i < 2774; i++){
      // 采集信息
      const tds = $(`#r${i}`).find('td')
      // console.log(tds.length)
      if(tds.length > 1){
        console.log(tds.eq(1).text().trim())
        list.push({
          content: tds.eq(1).text().trim(),
          remarks: [
            tds.eq(3).text().trim() + ' ' + tds.eq(4).text().trim(), 
            tds.eq(5).text().trim() + ' ' + (tds.eq(6).text().trim() || '公办')],
          group: 'daxue',
          radioOptions: ['了解', '不了解']
        })
      }
    }
    console.log(list.length)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, 'daxue')
  })
})