const http = require('https')
const cheerio = require('cheerio')
const url = require('url')
const mpaUtils = require('./wpa_content_utils.js')

const targetUrl = 'https://xing.911cha.com'

mpaUtils.request(targetUrl).then(html => {
  // console.log(html)
  const $ = cheerio.load(html)
  const list = []
  $('body > div.mainbox > div.leftbox > div:nth-child(3) > div.mcon.noi.center > div > p > a').each((index, item) => {
    // 采集信息
    list.push({
      content: $(item).text().trim(),
      group: 'baijiaxing',
      link: url.resolve(targetUrl, $(item).attr('href')),
      radioOptions: ['见过', '没见过']
    })
  })
  loadRemark(list.slice(0)).then(res => {
    console.log(list.length)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, 'baijiaxing')
  })
})

function loadRemark(list) {
  const item = list.pop()
  return mpaUtils.request(item.link).then(html => {
    const $ = cheerio.load(html)
    const remarks = $('body > div.mainbox > div.leftbox > div:nth-child(2) > div.mcon.f14 > p.l200.noi').text().trim()
    console.log(remarks)
    item.remarks = [
      remarks.substring(remarks.indexOf('拼音') + 2, remarks.indexOf('人口')),
      remarks.substring(remarks.indexOf('人口'), remarks.indexOf('〔', remarks.indexOf('人口'))).replace(/\s/g, '')
    ]
    if (list.length) {
      return loadRemark(list)
    }
    return Promise.resolve()
  })
}