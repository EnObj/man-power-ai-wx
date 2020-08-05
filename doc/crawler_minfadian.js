const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio')

mpaUtils.request('http://www.npc.gov.cn/npc/c30834/202006/75ba6483b8344591abd07917e1d25cc8.shtml').then(html => {
  // console.log(html)
  const $ = cheerio.load(html)

  const list = []

  var indexBuckets = []
  $('#Zoom > p').each((index, item) => {
    if (index >= 148 && index != 2532) {
      const content = $(item).text().trim()
      if(!!content){
        if (/^(第[零一二三四五六七八九十百千]+编)|(附\s+则)/.test(content)) {
          console.log('-' + content)
          indexBuckets = [content]
        } else if (/^第[零一二三四五六七八九十百千]+分编/.test(content)) {
          console.log('--' + content)
          indexBuckets = [indexBuckets[0], content]
        } else if (/^第[零一二三四五六七八九十百千]+章/.test(content)) {
          console.log('---' + content)
          indexBuckets = [indexBuckets[0], indexBuckets[1], content]
        } else if (/^第[零一二三四五六七八九十百千]+节/.test(content)) {
          console.log('----' + content)
          indexBuckets = [indexBuckets[0], indexBuckets[1], indexBuckets[2], content]
        } else if (/^第[零一二三四五六七八九十百千]+条/.test(content)) {
          list.push({
            content: content.substr(0, content.indexOf('条') + 1),
            remarks: indexBuckets.filter(buc => {
              return !!buc
            }).concat([
              content.substr(content.indexOf('条') + 1).trim()
            ]),
            group: 'minfadian',
            radioOptions: ['了解', '不了解'],
            link: 'http://www.npc.gov.cn/npc/c30834/202006/75ba6483b8344591abd07917e1d25cc8.shtml'
          })
          console.log(list.length, list[list.length-1].content)
        } else {
          // 补充段落
          list[list.length - 1].remarks.push(content)
        }
      }
    }
  })

  console.log(list.length)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, '../patch/20200805/minfadian')
})