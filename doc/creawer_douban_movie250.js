const https = require('https')
const cheerio = require('cheerio');
const fs = require("fs")

loadMovies()

function loadMovies(start = 0, list = []) {
  // 加载网页
  https.get(`https://movie.douban.com/top250?start=${start}`, (res) => {
    var html = "";
    res.on("data", function (chunk) {
      html += chunk; //监听数据响应，拼接数据片段
    })
    res.on("end", function () {
      // console.log(html)
      const $ = cheerio.load(html)
      $('#content > div > div.article > ol > li').each((index, item) => {
        // 采集信息
        list.push({
          image: $(item).find('img').attr('src'),
          link: $(item).find('a').first().attr('href'),
          content: $(item).find('span.title').first().text().trim(),
          group: 'movie-250',
          radioOptions: ['看过', '想看']
        })
      })
      console.log(list.length)
      // 递归
      if(list.length < 250){
        loadMovies(start + 25, list)
      }else{
        // 采集完成
        console.log('采集完成')
        writeToJsonFile(list)
      }
    })
  })
}

function writeToJsonFile(list){
  // 打开目标文件
  fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/movie-250.json`, 'w', function(err, fd){
    // 一行行写入
    var item = null
    while(item = list.shift(list)){
      console.log(`+++whiting ${list.length} : ${item.content}`)
      fs.writeFileSync(fd, JSON.stringify(item) + '\n', {flag:'a'})
    }
    fs.close(fd,function(){
      console.log('写入文件完成')
    })
  })
}