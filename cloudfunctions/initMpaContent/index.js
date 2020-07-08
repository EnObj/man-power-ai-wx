// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require("fs")
const readline = require('readline')

cloud.init({
  env: 'mc-dev-4x5dg',
  // env: 'ma-release-koccz'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: fs.createReadStream('/Users/jienhui/github/MorTransformation/dic.txt')
      // input: fs.createReadStream('./example.txt')
    })

    const list = []
    var allCount = 1
    const whitors = []
    rl.on('line', line => {
      console.log(`---new line(${allCount++}): ${line}`)
      // 10000条生成一批
      if(list.length == 1000000){
        whitors.push(whiteOneByOne(list.splice(0), `mpa_content-dict-${whitors.length+1}`))
      }
      const contents = line.split('')
      list.push({
        "content": contents[0].trim(),
        "prompt": "认识这个单词吗",
        "radioOptions": ["认识", "不认识"],
        "remarks": contents.slice(1).filter(content=>{
          return !!content
        }).map(content=>{
          return content.trim()
        })
      })
    })

    rl.on('close', () => {
      // console.log(list[0], list[1], list[2])
      whitors.push(whiteOneByOne(list, `mpa_content-dict-${whitors.length+1}`))
      Promise.all(whitors).then(resolve)
    })
  })
}

// 一个一个写进库
const whiteOneByOne = (list, name)=>{
  // if(!list.length){
  //   return Promise.resolve()
  // }
  var item = null
  while(item = list.shift(list)){
    console.log(`+++${name} whiting ${list.length} : ${item.content}`)
    fs.writeFileSync(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/table/dict/${name}.json`, JSON.stringify(item) + '\n', {flag:'a'})
  }

  return Promise.resolve()

  // return db.collection('mpa_content').add({
  //   data: item
  // }).then(res=>{
  //   return whiteOneByOne(list, name)
  // })
}