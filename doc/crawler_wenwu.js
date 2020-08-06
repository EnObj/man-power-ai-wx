const http = require('http')
const mpaUtils = require('./wpa_content_utils.js')

loadItems()

function loadItems(page = 5801, list = []) {
  // 加载网页
  const req = http.request('http://gl.ncha.gov.cn:8080/collection/cr/find', {
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
          content: item.crName.trim(),
          remarks: [item.crClassName, item.ccrAgeName, item.collectionName],
          group: 'wenwu',
          radioOptions: ['看过', '想看看'],
          link: 'http://gl.ncha.gov.cn/#/Industry/Collection-Collection'
        })
      })
      console.log(list.length)

      // 每50万记录写一次文件
      if(list.length >= 10000){
        mpaUtils.writeToJsonFile(list.splice(0, 10000), '../patch/20200805/wenwu_p_' + page)
      }

      // 递归
      if (page < 23543) {
        loadItems(++page, list)
      } else {
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200805/wenwu_p_end')
      }
    })
  })

  const data = {
    "sort": {
      "crName": "1"
    },
    "pageNation": {
      "currentPage": page,
      "pageSize": 100
    },
    "keyWord": ""
  }

  req.write(JSON.stringify(data))
  req.end()
}