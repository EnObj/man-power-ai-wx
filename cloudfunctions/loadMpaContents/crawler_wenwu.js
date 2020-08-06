const http = require('http')

const COUNT = 2354371
const GROUP_NAME = 'wenwu'

module.exports = {
  // 得到预估数据规模
  getCount() {
    return Promise.resolve(COUNT)
  },
  getOneMpaContentRandom() {
    // 得到随机数
    return loadItems(Math.ceil(Math.random() * COUNT)).then(list => {
      return list[0]
    })
  },
  getGroupName() {
    return GROUP_NAME
  }
}

function loadItems(page = 1) {
  return new Promise(resolve => {
    // 加载网页
    const req = http.request('http://gl.ncha.gov.cn:8080/collection/cr/find', {
      method: 'POST'
    }, (res) => {
      var html = "";
      res.on("data", function (chunk) {
        html += chunk; //监听数据响应，拼接数据片段
      })
      res.on("end", function () {
        console.log(html)
        const res = JSON.parse(html)
        const list = res.data.data.map(item => {
          // 采集信息
          return {
            content: item.crName.trim(),
            remarks: [item.crClassName, item.ccrAgeName, item.collectionName],
            group: 'wenwu',
            radioOptions: ['看过', '想看看'],
            link: 'http://gl.ncha.gov.cn/#/Industry/Collection-Collection'
          }
        })

        resolve(list)

      })
    })

    const data = {
      "sort": {
        "collectionName": "1"
      },
      "pageNation": {
        "currentPage": page,
        "pageSize": 1
      },
      "keyWord": ""
    }

    req.write(JSON.stringify(data))
    req.end()
  })
}