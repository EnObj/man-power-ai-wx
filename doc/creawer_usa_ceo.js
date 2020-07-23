const http = require('http')
const https = require('https')
const cheerio = require('cheerio');
const fs = require("fs")
const iconv = require('iconv-lite')

request('http://114.xixik.com/potus/#anchor3', 'binary', null, iconvDecode('GBK')).then(html => {
  const $ = cheerio.load(html)
  const list = []
  $('body > div.body > div:nth-child(9) > div.custom_content > div > table > tbody > tr').each((index, item) => {
    if(index){
      const tds = $(item).find('td')
      list.push({
        image: tds.eq(2).find('img').first().attr('src'),
        content: tds.eq(3).text().trim().replace('\n\t\t\t\t', ''),
        remarks: [
          '第' + tds.eq(0).text().trim()+ '任' + ' ' + tds.eq(1).text().trim(),
          tds.eq(4).text().trim(), 
          tds.eq(5).text().trim()],
        sort: +tds.eq(0).text().trim(),
        group: 'usa-ceo',
        radioOptions: ['了解', '不了解']
      })
    }
  })
  console.log(`finished ${list.length}`)
  console.log(list[0])
  writeToJsonFile(list)
})


function request(url, encoding, options = {}, pipe) {
  console.log(url)
  const proc = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    proc.get(url, options, function (res) {
      if (encoding) {
        res.setEncoding(encoding)
      }
      var str = "";
      res.on("data", function (chunk) {
        str += chunk; //监听数据响应，拼接数据片段
      })
      res.on("end", function () {
        if (pipe) {
          pipe(str).then(result => {
            resolve(result)
          })
        } else {
          resolve(str)
        }
      })
    })
  })
}

function iconvDecode(type) {
  return function (gzipData) {
    return Promise.resolve(iconv.decode(Buffer.from(gzipData, 'binary'), type))
  }
}

function writeToJsonFile(list) {
  // 打开目标文件
  fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/usa-ceo.json`, 'w', function (err, fd) {
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