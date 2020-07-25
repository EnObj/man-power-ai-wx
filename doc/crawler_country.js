const http = require('http')
const cheerio = require('cheerio')
const url = require('url')
const mpaUtils = require('./wpa_content_utils.js')

const targetUrl = 'http://www.afforange.com/546.html'
http.get(targetUrl, (res) => {
  var html = "";
  res.on("data", function (chunk) {
    html += chunk; //监听数据响应，拼接数据片段
  })
  res.on("end", function () {
    // console.log(html)
    const $ = cheerio.load(html)
    const list = []
    $('#tablepress-31 > tbody > tr').each((index, item) => {
      // 采集信息
      const tds = $(item).find('td')
      list.push({
        content: tds.eq(3).text().trim(),
        remarks: [tds.eq(2).text().trim(), tds.eq(4).text().trim() + '万人'],
        group: 'country',
        radioOptions: ['去过', '想去']
      })
    })
    console.log(list.length)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, 'country')
  })
})