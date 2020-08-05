const mpaUtils = require('./wpa_content_utils.js')

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-cn',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip, deflate, br',
    'Host': 'query.sse.com.cn',
    'Referer':'http://www.sse.com.cn/assortment/stock/list/share/',
    'Cookie': 'VISITED_MENU=%5B%2211727%22%2C%2210948%22%2C%229056%22%2C%229057%22%2C%228542%22%2C%228523%22%2C%228528%22%2C%229062%22%2C%229055%22%5D; yfx_f_l_v_t_10000042=f_t_1596596144446__r_t_1596596144446__v_t_1596596871087__r_c_0; VISITED_COMPANY_CODE=%5B%22600007%22%2C%22600023%22%2C%22600022%22%2C%22605318%22%2C%22605399%22%2C%22600033%22%5D; VISITED_STOCK_CODE=%5B%22600007%22%2C%22600023%22%2C%22600022%22%2C%22605318%22%2C%22605399%22%2C%22600033%22%5D; seecookie=%5B600007%5D%3A%2C%5B600022%5D%3Ase.com.cn/assortment/stock/list/share/%2C%5B605399%5D%3A%u6668%u5149%u65B0%u6750%2C%5B600033%5D%3A%u798F%u5EFA%u9AD8%u901F; yfx_c_g_u_id_10000042=_ck20080510554415531278283530650'
  }
}

loadItems()

function loadItems(page=2, list=[]){
  const callbackFun = `jsonpCallback${Math.ceil(Math.random() * 100000)}`
  mpaUtils.request(`http://query.sse.com.cn/security/stock/getStockListData2.do?&jsonCallBack=${callbackFun}&isPagination=true&stockCode=&csrcCode=&areaName=&stockType=1&pageHelp.cacheSize=1&pageHelp.beginPage=${page}&pageHelp.pageSize=25&pageHelp.pageNo=${page}&pageHelp.endPage=${page}1&_=${Date.now()}`, null, options).then(html=>{

    const jsonStr = html.replace(callbackFun+'(', '').replace(')','')

    const res = JSON.parse(jsonStr)
    res.result.forEach(item => {
      // 采集信息
      list.push({
        content: item.SECURITY_ABBR_A,
        remarks: [
          item.SECURITY_CODE_A, 
          `上市日期：${item.LISTING_DATE}`
        ],
        group: 'gupiao',
        radioOptions: ['了解', '不了解'],
        link: `http://www.sse.com.cn/assortment/stock/list/info/announcement/index.shtml?productId=${item.SECURITY_CODE_A}`
      })
    })
    console.log(list.length)
    // 递归
    if (page < 62) {
      loadItems(++page, list)
    } else {
      // 采集完成
      console.log(`采集完成：${list.length}`)
      console.log(list[0])
      mpaUtils.writeToJsonFile(list, 'gupiao')
    }
  })
}