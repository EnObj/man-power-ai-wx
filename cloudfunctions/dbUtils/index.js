// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require("fs")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const groups = event.groups || ['turing']

  const res = await db.collection('mpa_content_group').where({
    _id: db.command.in(groups)
  }).get()

  writeToJsonFile(res.data, 'patch/20200804/groups')
}

function writeToJsonFile(list, fileName) {
  // 打开目标文件
  fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/${fileName}.json`, 'w', function (err, fd) {
    // 一行行写入
    var item = null
    const listLength = list.length
    while (item = list.shift()) {
      if(list.length == 0 || list.length == listLength - 1){
        console.log(`+++whiting ${list.length} : ${item.content}`)
      }
      fs.writeFileSync(fd, JSON.stringify(item) + '\n', {
        flag: 'a'
      })
    }

    fs.close(fd, function () {
      console.log('写入文件完成')
    })
  })
}