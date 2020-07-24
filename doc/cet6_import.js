const fs = require("fs")
const readline = require('readline')
const mpaUtils = require('./wpa_content_utils.js')

const rl = readline.createInterface({
  input: fs.createReadStream(`/Users/jienhui/github/MyDict/result2.json`)
})

const list = []
var allCount = 1
rl.on('line', line => {
  // console.log(`---new line(${allCount++}): ${line}`)
  try{
    const item = JSON.parse(line)
    list.push({
      "content": item.word,
      "radioOptions": ["了解", "不了解"],
      remarks: item.type.split('\n').concat(item.sent.split('\n').filter(remark=>{
        return !!remark
      }).flatMap(remark=>{
        return remark.split("     ")
      })),
      "group": 'cet-6'
    })
  }catch(e){
    console.log(e)
    console.log(line)
  }
})

rl.on('close', () => {
  // 打开目标文件
  console.log(list.length)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list, 'cet-6')
})