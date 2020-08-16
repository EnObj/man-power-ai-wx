const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

const targetUrl = 'http://www.hotelaah.com/dijishi.html'
mpaUtils.request(targetUrl, 'binary', null, mpaUtils.iconvDecode('gb2312')).then(html => {
  const $ = cheerio.load(html)
  // console.log(html)
  const list = []
  $('table > tbody > tr').each((index, item) => {
    const tds = $(item).find('td')
    if (tds.length == 3) {
      list.push({
        content: tds.eq(1).text().trim(),
        group: 'dijishi',
        remarks: [
          tds.eq(2).text().trim()
        ],
        radioOptions: ['了解', '不了解']
      })
    }
  })

  list.shift()

  console.log(`采集完成：${list.length}`)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200813/dijishi')
})