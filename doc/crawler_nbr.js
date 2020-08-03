const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio')

const nbeMap = {
  // 'nbe-wlx': 'physics',
  'nbe-hx': 'chemistry',
  // 'nbe-slx-yx': 'medicine',
  // 'nbe-wx': 'literature',
  // 'nbe-hp': 'peace',
  // 'nbe-jjx': 'economic-sciences'
}

for(var code in nbeMap){
  // mark: 这句要加
  const _code = code
  loadDg(code).then(list=>{
    // 采集完成
    console.log(`采集完成：${list.length}`)
    console.log(list[0])
    mpaUtils.writeToJsonFile(list, _code)
  })
}

function loadDg(channelCode, year=1901, result=[]){
  if(year < 2020){
    return load(year, channelCode).then(list=>{
      return loadDg(channelCode, ++year, result.concat(list||[]))
    })
  }
  return Promise.resolve(result)
}

function load(date, channelCode) {
  const link = `https://www.nobelprize.org/prizes/${nbeMap[channelCode]}/${date}/summary/`
  return mpaUtils.request(link).then(html => {
    const $ = cheerio.load(html)
    // 描述
    const desc = $('#pjax-well > div:nth-child(1) > section.page-section.laureate-facts > article > blockquote').text().trim()
    if (!desc) {
      console.log('nothing founded')
      return
    }
    // 人物列表：list
    const list = []
    $('#pjax-well > div:nth-child(1) > section.page-section.laureate-facts > article > div.list-laureates.border-top > figure').each((index, item) => {
      const imageUrl = $(item).find('source').first().attr('data-srcset')
      list.push({
        content: $(item).find('h3').text().trim(),
        group: channelCode,
        radioOptions: [
          '了解过', '不了解'
        ],
        remarks: [
          `${date}年`,
          $(item).find('p').last().text().trim().replace(/\t/g, ''),
          desc
        ],
        sort: date,
        image: imageUrl,
        link
      })
    })
    return list
  })
}