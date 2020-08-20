const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');
const url = require('url')

loadItems()

function loadItems(page = 1, list = []) {
  const targetUrl = `https://www.zxzj.me/list/4-${page}.html`
  mpaUtils.request(targetUrl).then(html => {
    const $ = cheerio.load(html)
    // console.log(html)
    $('body > div.container > div > div > div.stui-pannel__bd.clearfix > ul > li').each((index, item) => {
      const playLink = $(item).find('div > a')
      const link = $(item).find('div > div > h4 > a')
      list.push({
        content: link.text().trim(),
        group: 'riju-c1',
        radioOptions: ['看过', '想看'],
        link: url.resolve(targetUrl, link.attr('href')),
        playLink: url.resolve(targetUrl, playLink.attr('href'))
      })
    })
    console.log(list.length)
    // 递归 15
    if (page < 15) {
      loadItems(++page, list)
    } else {
      // 加载套图
      loadRemarks(list.slice(0)).then(res => {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200820/riju-c1')
      })
    }
  })
}

function loadRemarks(list) {
  const item = list.pop()
  console.log(`进度：${list.length}`)
  return mpaUtils.request(item.link).then(html => {
    // console.log(html)
    // 清除原始地址
    delete item.link
    const $ = cheerio.load(html)
    // 获取封面
    item.image = $('div.stui-content > div.stui-content__thumb > a > img').attr('data-original')
    // 获取备注
    item.remarks = $('div.stui-content > div.stui-content__detail > p').map((index, item) => {
      return $(item).text().trim().replace('。详情', '。')
    }).get()
    item.remarks.splice(-2, 1)
    if (list.length) {
      return loadRemarks(list)
    }
    return Promise.resolve()
  })
}