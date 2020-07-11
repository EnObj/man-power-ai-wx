// 云函数入口文件
const fs = require("fs")
const readline = require('readline')

const rl = readline.createInterface({
  input: fs.createReadStream('/Users/jienhui/github/MorTransformation/dic.txt')
})

const list = []
var allCount = 1
rl.on('line', line => {
  console.log(`---new line(${allCount++}): ${line}`)
  const contents = line.split('')
  list.push({
    "content": contents[0].trim(),
    "prompt": "认识这个单词吗",
    "radioOptions": ["认识", "不认识"],
    "remarks": contents.slice(1).filter(content=>{
      return !!content
    }).map(content=>{
      return content.trim()
    }),
    group: 'English_dict'
  })
})

rl.on('close', () => {
  fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/English_dict.json`, 'w', function(err, fd){
    var item = null
    while(item = list.shift(list)){
      console.log(`+++whiting ${list.length} : ${item.content}`)
      fs.writeFileSync(fd, JSON.stringify(item) + '\n', {flag:'a'})
    }
  })
})