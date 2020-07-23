const https = require('https')
const cheerio = require('cheerio')
const url = require('url')
const fs = require("fs")

const targetUrl = 'https://emojipedia.org/emoji-1.0/'
https.get(targetUrl, (res) => {
  var html = "";
  res.on("data", function (chunk) {
    html += chunk; //监听数据响应，拼接数据片段
  })
  res.on("end", function () {
    console.log(html)
    const $ = cheerio.load(html)
    const list = []
    $('body > div.container > div.content > article > ul:nth-child(4) > li').each((index, item) => {
      // 采集信息
      const emoji = $(item).text().trim().split(' ')
      list.push({
        link: url.resolve(targetUrl, $(item).find('a').first().attr('href')),
        content: emoji[0],
        remarks: [emoji.slice(1).join(' ')],
        group: 'emoji',
        radioOptions: ['喜欢', '不喜欢']
      })
    })
    console.log(list.length)
    console.log(list[0])
    writeToJsonFile(list)
  })
})

function writeToJsonFile(list) {
  // 打开目标文件
  fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/emoji.json`, 'w', function (err, fd) {
    // 一行行写入
    var item = null
    while (item = list.shift(list)) {
      console.log(`+++whiting ${list.length} : ${item.content}`)
      fs.writeFileSync(fd, JSON.stringify(item) + '\n', {
        flag: 'a'
      })
    }
    fs.close(fd, function () {
      console.log('写入文件完成')
    })
  })
}