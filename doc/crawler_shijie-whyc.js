const http = require('http')
const mpaUtils = require('./wpa_content_utils.js')

loadItems()

function loadItems(page = 1, list = []) {
  // 加载网页
  const req = http.request('http://gl.ncha.gov.cn:8080/world/find', {
    method: 'POST'
  }, (res) => {
    var html = "";
    res.on("data", function (chunk) {
      html += chunk; //监听数据响应，拼接数据片段
    })
    res.on("end", function () {
      // console.log(html)
      const res = JSON.parse(html)
      res.data.data.forEach(item => {
        // 采集信息
        list.push({
          content: item.heritageName,
          remarks: ["列入年份：" + item.includedYear, "地区：" + item.location, ],
          group: 'shijie-whyc',
          radioOptions: ['去过', '想去'],
          link: 'http://gl.ncha.gov.cn/#/Industry/World-Heritage'
        })
      })
      console.log(list.length)
      // 递归
      if (page < 3) {
        loadItems(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200817/shijie-whyc')
      }
    })
  })

  const data = {
    "pageNation": {
      "currentPage": page,
      "pageSize": 20
    },
    "keyWord": ""
  }

  req.write(JSON.stringify(data))
  req.end()
}