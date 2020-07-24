const http = require('http')
const cheerio = require('cheerio');
const mpaUtils = require('./wpa_content_utils.js')

loadGuobiaos()

function loadGuobiaos(page = 1, list = []) {
  // 加载网页
  http.get(`http://std.samr.gov.cn/gb/search/gbQueryPage?searchText=&ics=&state=G_STATE%3A%E7%8E%B0%E8%A1%8C&ISSUE_DATE=&sortOrder=asc&pageSize=50&pageNumber=${page}`, (res) => {
    var html = "";
    res.on("data", function (chunk) {
      html += chunk; //监听数据响应，拼接数据片段
    })
    res.on("end", function () {
      // console.log(html)
      const res = JSON.parse(html)
      res.rows.forEach(item=>{
        // 采集信息
        list.push({
          link: `http://std.samr.gov.cn/gb/search/gbDetailed?id=${item.id}`,
          content: item.C_C_NAME,
          remarks: [item.C_STD_CODE, item.ACT_DATE],
          group: 'guobiao',
          radioOptions: ['了解', '不了解']
        })
      })
      console.log(list.length)
      // 递归
      if (page < 767) {
        loadGuobiaos(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, 'guobiao')
      }
    })
  })
}