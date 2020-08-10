const mpaUtils = require('./wpa_content_utils.js')
const cheerio = require('cheerio');

loadItems()

function loadItems(page = 1, list = []) {
  mpaUtils.request(`https://sj.enterdesk.com/woman/${page}.html`).then(html => {
    const $ = cheerio.load(html)
    // console.log(html)
    $('div.egeli_pic_m.center > div').each((index, item) => {
      const content = $(item).find('dl > dt > div:nth-child(1) > a').text().trim()
      if(index && !!content){
        list.push({
          content: content,
          group: 'meinv-part3',
          radioOptions: ['好看', '收藏了'],
          image: $(item).find('dl > dd > a > img').attr('src'),
          link: $(item).find('dl > dd > a').attr('href'),
        })
      }
    })
    console.log(list.length)
    // 递归
    if (page < 69) {
      loadItems(++page, list)
    } else {
      // 加载套图
      loadImage(list.slice(0)).then(res=>{
        // 采集完成
        console.log(`采集完成：${list.length}`)
        console.log(list[0])
        mpaUtils.writeToJsonFile(list, '../patch/20200810/meinv-part3')
      })
    }
  })
}

function loadImage(list) {
  console.log('进度：' + list.length)
  const item = list.pop()
  console.log(item)
  return mpaUtils.request(item.link).then(html => {
    // 清除原始地址
    delete item.link
    const $ = cheerio.load(html)
    // 大图
    item.image = $('div.fleft.arc_pic > div.arc_main_pic > img').attr('src')
    if (list.length) {
      return loadImage(list)
    }
    return Promise.resolve()
  })
}