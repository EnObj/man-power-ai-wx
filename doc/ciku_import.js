const fs = require("fs")
const readline = require('readline')

fs.readdir("/Users/jienhui/github/中文词库", function(err, files){
  files.forEach(file=>{
    deal(file.substr(0, file.lastIndexOf('.')))
  })
})

const deal = (group)=>{
  const rl = readline.createInterface({
    input: fs.createReadStream(`/Users/jienhui/github/中文词库/${group}.txt`)
  })
  
  const list = []
  var allCount = 1
  rl.on('line', line => {
    console.log(`---new line(${allCount++}): ${line}`)
    const contents = line.split('\t')
    list.push({
      "content": contents[0].trim(),
      "prompt": "这个词了解吗",
      "radioOptions": ["了解", "不了解"],
      "group": group,
      "remarks": contents.slice(1).filter(content=>{
        return !!content
      }).map(content=>{
        return content.trim()
      })
    })
  })
  
  rl.on('close', () => {
    // 打开目标文件
    fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/${group}.json`, 'w', function(err, fd){
      // 一行行写入
      var item = null
      while(item = list.shift(list)){
        console.log(`+++whiting ${list.length} : ${item.content}`)
        fs.writeFileSync(fd, JSON.stringify(item) + '\n', {flag:'a'})
      }
      fs.close(fd,function(){
        console.log('已完成')
      })
    })
  })
}
