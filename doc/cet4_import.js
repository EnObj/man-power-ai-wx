const fs = require("fs")
const mpaUtils = require('./wpa_content_utils.js')

fs.readFile('/Users/jienhui/github/CET4words/cet4.json', (err, data)=>{
  const list = JSON.parse(data)
  console.log(list.length)
  console.log(list[0])
  mpaUtils.writeToJsonFile(list.map(item=>{
    return {
      content: item.word,
      group: 'cet-4',
      radioOptions: ['认识', '不认识'],
      remarks: [item.translate]
    }
  }), 'cet-4')
})