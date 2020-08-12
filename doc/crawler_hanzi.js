const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');
const url = require('url')

const targetUrl = 'https://www.zdic.net/zd/zb/cc1/'
mpaUtils.request(targetUrl).then(html => {
  const $ = cheerio.load(html)
  // console.log(html)
  const list = []
  $('body > main > div.browse_wrapper > div.res_c_center > div > div > div:nth-child(3) > div.bs_index3 > li').each((index, item) => {
    list.push({
      content: $(item).text().trim(),
      group: 'hanzi',
      remarks: [],
      radioOptions: ['了解', '不了解'],
      link: url.resolve(targetUrl, $(item).find('a').attr('href'))
    })
  })
  
  loadRemark(list.slice(0)).then(res => {
    console.log(`采集完成：${list.length}`)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, '../patch/20200812/hanzi')
  })
})

function loadRemark(list) {
  console.log(`进度：${list.length}`)
  const item = list.pop()
  return mpaUtils.request(item.link).then(html => {
    delete item.link
    const $ = cheerio.load(html)
    // 拼音
    const pinyins = $('div.content.definitions.jnr > p > span.dicpy')
    // 释义
    const shiyis = $('div.content.definitions.jnr > ol')
    var remarks = []
    pinyins.each((index, item)=>{
      remarks.push($(item).text().trim())
      remarks = remarks.concat(shiyis.eq(index).find('li').map((index, item)=>{
        return `${++index}：` + $(item).text().trim()
      }).get())
    })
    item.remarks = [
      $('body > main > div.zdict > div.res_c_center > div > div.entry_title > div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td.z_bs2 > p:nth-child(3)').text().trim().replace(' ', '：'),
      ...remarks
    ]
    if (list.length) {
      return loadRemark(list)
    }
    return Promise.resolve()
  })
}