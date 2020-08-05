const cheerio = require('cheerio')
const url = require('url')
const mpaUtils = require('./wpa_content_utils.js')

const targetUrl = 'https://www.gushiwen.org/gushi/tangshi.aspx'

mpaUtils.request(targetUrl).then(html => {
  // console.log(html)
  const $ = cheerio.load(html)
  // 风格分类
  const listPromise = $('body > div.main3 > div.left > div.sons > div').map((index, item) => {
    const category = $(item).find('div.bookMl').text().trim()
    // 每个风格下有一组诗
    const categoryList = $(item).find('a').map((index, item) => {
      // 每首诗都需要再访问详情页得到诗句
      return mpaUtils.request($(item).attr('href')).then(html => {
        const $ = cheerio.load(html)
        // 从详情页获得整首诗的内容
        return {
          content: $('body > div.main3 > div.left > div:nth-child(2) > div.cont > h1').text().trim(),
          group: 'tangshi-300',
          remarks: [
            category,
            $('body > div.main3 > div.left > div:nth-child(2) > div.cont > p').text().trim(),
            $('body > div.main3 > div.left > div:nth-child(2) > div.cont > div.contson').text().trim().replace(/。\s*/g, '。\n')
          ],
          radioOptions: ['读过', '想读']
        }
      })
    }).get()
    return Promise.all(categoryList)
  }).get()
  // 每个风格都处理完成了
  Promise.all(listPromise).then(res=>{
    const list = res.flatMap(categoryList=>{
      return categoryList
    })
    console.log(list.length)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, '../patch/20200805/tangshi-300')
  })
})