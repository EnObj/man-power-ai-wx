const http = require('https')
const cheerio = require('cheerio');
const mpaUtils = require('./wpa_content_utils.js')

loadItems()

function loadItems(page = 1, list = []) {
  // 加载网页
  http.get(`https://zwfw.mct.gov.cn/scenicspot?currentPage=${page}`, (res) => {
    var html = "";
    res.on("data", function (chunk) {
      html += chunk; //监听数据响应，拼接数据片段
    })
    res.on("end", function () {
      // console.log(html)
      const startPoc = html.indexOf('var scenicspot =') + 16
      const endPoc = html.indexOf(';')
      const res = JSON.parse(html.substring(startPoc, endPoc))
      res.list.forEach(item=>{
        // 采集信息
        list.push({
          content: item.ssName,
          remarks: [`${item.ssYear} ${item.province}`],
          group: 'jingqu-5A',
          radioOptions: ['去过', '想去']
        })
      })
      console.log(list.length)
      // 递归
      if (page < 14) {
        loadItems(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, 'jingqu-5A')
      }
    })
  })
}