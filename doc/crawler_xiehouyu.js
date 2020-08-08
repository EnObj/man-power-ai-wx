const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

loadItems()

function loadItems(page = 1, list = []) {
  mpaUtils.request(`http://xhy.5156edu.com/html2/xhy${page==1?'':('_'+page)}.html`, 'binary', null, mpaUtils.iconvDecode('gb2312')).then(html => {
    const $ = cheerio.load(html)
    $('body > div:nth-child(3) > center > table:nth-child(2) > tbody > tr').each((index, item) => {
      if (index) {
        const tds = $(item).find('td')
        list.push({
          content: tds.eq(0).text().trim(),
          remarks: [
            tds.eq(1).text().trim(),
          ],
          group: 'xiehouyu',
          radioOptions: ['了解', '不了解']
        })
      }
    })
    console.log(list.length)
    // 递归
    if (page < 281) {
      loadItems(++page, list)
    } else {
      // 采集完成
      console.log(`采集完成：${list.length}`)
      console.log(list[0])
      mpaUtils.writeToJsonFile(list, '../patch/20200808/xiehouyu')
    }
  })
}