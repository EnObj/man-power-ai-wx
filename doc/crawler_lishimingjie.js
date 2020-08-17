const http = require('http')
const mpaUtils = require('./wpa_content_utils.js')

loadItems()

function loadItems(page = 1, list = []) {
  // 加载网页
  const req = http.request('http://gl.ncha.gov.cn:8080/street/find', {
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
          content: item.streetName,
          remarks: ["批次：" + item.batchNum, "地区：" + item.districtCode, ],
          group: 'lishimingjie',
          radioOptions: ['去过', '想去'],
          link: 'http://gl.ncha.gov.cn/#/Industry/Famous-historical?titleType=CulturalBlock'
        })
      })
      console.log(list.length)
      // 递归
      if (page < 2) {
        loadItems(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200817/lishimingjie')
      }
    })
  })

  const data = {
    "condition": {
      "cityBatch": "",
      "cityName": "",
      "cityProvince": ""
    },
    "districtCode": "",
    "batchNum": "",
    "keyWord": "",
    "pageNation": {
      "currentPage": page,
      "pageSize": 20
    },
    "entityName": "IsHistoryTown"
  }

  req.write(JSON.stringify(data))
  req.end()
}