const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

mpaUtils.request(`http://www.fortunechina.com/fortune500/c/2020-08/10/content_372148.htm`).then(html => {
  const $ = cheerio.load(html)
  // console.log(html)
  const list = []
  $('#table1 > tbody > tr').each((index, item) => {
    const tds = $(item).find('td')
    list.push({
      content: tds.eq(1).text().trim(),
      group: 'world-inc-500',
      remarks: [
        '排名：' + tds.eq(0).text().trim(),
        '营业收入（百万美元）：' + tds.eq(2).text().trim(),
        '利润（百万美元）：' + tds.eq(3).text().trim(),
        '来自：' + tds.eq(4).text().trim()
      ],
      radioOptions: ['了解', '不了解']
    })
  })
  console.log(`采集完成：${list.length}`)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200812/world-inc-500')
})