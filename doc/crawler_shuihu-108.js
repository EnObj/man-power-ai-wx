const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

const targetUrl = 'http://www.qulishi.com/news/201508/43566.html'
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-cn',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate, br',
    'Host': 'www.qulishi.com',
    'Referer': 'https://www.baidu.com/link?url=GiSEoHxMm2BZ1F8xQwVOPNSjYJWHueUjxh4fA3XxaanOqKdxgMUoWXKdiC4IGwoEckaMUmoQUGEBUctMdNNxE_&wd=&eqid=a21f1ef60003b7a9000000045f338491',
  },
  gzip: true
}
mpaUtils.request(targetUrl, 'binary', options, mpaUtils.unGzip).then(html => {
  const $ = cheerio.load(html)
  // console.log(html)
  const list = []
  $('body > div.w1170 > div.w1000.n18_body > div.clearfix > div.n18_left > div.n18_art > div.n18_art_content > div.n18_art_con > p').each((index, item) => {
    if (index >= 2 && index < 117 && index != 41) {
      const remarks = $(item).text().trim().split(' ')
      if (remarks.length && remarks[3]) {
        list.push({
          content: remarks[3],
          group: 'shuihu-108',
          remarks: [
            remarks[2],
            '排名' + remarks[0] + ' ' + remarks[1]
          ],
          radioOptions: ['了解', '不了解'],
          sort: +remarks[0]
        })
      }
    }
  })

  console.log(`采集完成：${list.length}`)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200812/shuihu-108')
})