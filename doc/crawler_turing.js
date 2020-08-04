const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio')
const zlib = require('zlib')
const url = require('url')

const turingUrl = 'https://amturing.acm.org/byyear.cfm'
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-cn',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate, br',
    'Host': 'amturing.acm.org'
  },
  gzip: true
}
mpaUtils.request(turingUrl, 'binary', options, unGzip).then(html => {
  // console.log(html)
  const $ = cheerio.load(html)
  // 每年的得主
  const promises = $('#content > div > ul > li').map((index, item) => {
    const year = +$(item).find('span').text().replace(/[\(\)]/g,'')
    // 拿到列表
    const listPromise = $(item).find('a').map((index, item) => {
      const programUrl = url.resolve(turingUrl, $(item).attr('href'))
      return mpaUtils.request(programUrl, 'binary', options, unGzip).then(html => {
        const $ = cheerio.load(html)
        const imageUrl = $('#content > div > div.col.col1 > div > a > img').attr('src')
        return {
          content: $(item).text(),
          remarks: [
            `${year}年`,
            '',
            $('#content > div > div.col.col2 > div.citation > p').text().trim()
          ],
          group: 'turing',
          radioOptions: ['了解过', '不了解'],
          link: programUrl, 
          image: url.resolve(programUrl, imageUrl)
        }
      })
    }).get()
    return Promise.all(listPromise).then(list => {
      // console.log(list)
      list.forEach(item=>{
        item.remarks[1] = `Prize share: 1/${list.length}`
      })
      return list
    })
  }).get()

  // console.log(promises)

  Promise.all(promises).then(res=>{
    let list = res.flatMap(item=>{
      return item
    })
    console.log(list.length)
    console.log(list[0])

    mpaUtils.writeToJsonFile(list, 'turing')
  })
})

function unGzip(gzipData) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(Buffer.from(gzipData, 'binary'), (err, result) => {
      resolve(result.toString())
    })
  })
}