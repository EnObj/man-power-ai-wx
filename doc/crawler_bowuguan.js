const http = require('http')
const mpaUtils = require('./wpa_content_utils.js')

loadItems()

function loadItems(page = 1, list = []) {
  // 加载网页
  const req = http.request('http://gl.ncha.gov.cn:8080/collection/find', {
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
          content: item.collectionName,
          remarks: [item.address, item.openTime, item.summarize],
          group: 'bowuguan',
          radioOptions: ['去看过', '想去看看'],
          link: 'http://gl.ncha.gov.cn/#/Industry/Collection-unit'
        })
      })
      console.log(list.length)
      // 递归
      if (page < 268) {
        loadItems(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, 'bowuguan')
      }
    })
  })

  const data = {
    "keyWord": "",
    "condition": {
      "unitBatch": "",
      "managerUnit": "",
      "unitTheme": "",
      "unitProvince": "",
      "unitStatus": "",
      "keyword": ""
    },
    "pageNation": {
      "currentPage": page,
      "pageSize": 20
    },
    "districtCode": ""
  }

  req.write(JSON.stringify(data))
  req.end()
}