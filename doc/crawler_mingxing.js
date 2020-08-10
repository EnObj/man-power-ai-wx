const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

loadItems()

function loadItems(page = 1, list = []) {
  mpaUtils.request(`http://www.win4000.com/mobile_2338_0_0_${page}.html`).then(html => {
    const $ = cheerio.load(html)
    // console.log(html)
    $('body > div.main > div > div.w1180.clearfix > div.Left_bar > div.list_cont.Left_list_cont.Left_list_cont2 > div > div > div > ul > li').each((index, item) => {
      list.push({
        content: $(item).find('p').text().trim(),
        group: 'mingxing',
        radioOptions: ['好看', '收藏了'],
        image: $(item).find('img').attr('data-original'),
        link: $(item).find('a').attr('href'),
      })
    })
    console.log(list.length)
    // 递归
    if (page < 5) {
      loadItems(++page, list)
    } else {
      // 加载套图
      loadImages(list.slice(0)).then(res=>{
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200810/mingxing')
      })
    }
  })
}

function loadImages(list) {
  const item = list.pop()
  return mpaUtils.request(item.link).then(html => {
    // 清除原始地址
    delete item.link
    const $ = cheerio.load(html)
    // 套图
    const imgList = $('#scroll > li').map((index, ele)=>{
      return $(ele).find('a').attr('href')
    }).get()
    // 获取高清封面
    item.image = $('#pic-meinv > a > img').attr('src')
    return loadImage(imgList).then(images=>{
      item.images = images
      if (list.length) {
        return loadImages(list)
      }
      return Promise.resolve()
    })
  })
}

function loadImage(list, result=[]){
  const item = list.pop()
  return mpaUtils.request(item).then(html => {
    const $ = cheerio.load(html)
    result.push($('#pic-meinv > a > img').attr('src'))

    if (list.length) {
      return loadImage(list, result)
    }
    return Promise.resolve(result)
  })
}