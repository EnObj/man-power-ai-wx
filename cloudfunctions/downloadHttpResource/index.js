// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const https = require('https')
const zlib = require('zlib')
const URL = require('url')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    urls
  } = event
  
  console.log(urls)

  return downloadOneByOne(urls, [])
}

const downloadOneByOne = function (urls, cloudFiles) {
  if (!urls.length) {
    return Promise.resolve(cloudFiles)
  }
  const url = urls.pop()
  if(url.startsWith('cloud://')){
    cloudFiles.push(url)
    return downloadOneByOne(urls, cloudFiles)
  }
  return download(url).then(result => {
    return cloud.uploadFile({
      fileContent: Buffer.from(result.data, 'binary'),
      cloudPath: 'download/' + getDate() + '/' + Date.now() + urls.length + '.' + result.contentType.split('/')[1]
    }).then(res => {
      cloudFiles.push(res.fileID)
      return downloadOneByOne(urls, cloudFiles)
    })
  })
}

const getDate = ()=>{
  const date = new Date()
  return '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
}

const unGzip = function (gzipData) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(Buffer.from(gzipData, 'binary'), (err, result) => {
      resolve(result)
    })
  })
}

const download = function (url) {
  console.log(url)
  const myURL = new URL.URL(url)
  const proc = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    const options = {
      ...defaultOptions,
      hostname: myURL.host,
      path: myURL.pathname + myURL.search,
      port: myURL.port,
      method: 'GET'
    }
    console.log(options)
    proc.get(options, (res) => {
      console.log(res.headers)
      if (res.statusCode == 302 || res.statusCode == 301) {
        return request(res.headers.location).then(result => {
          resolve(result)
        }, (res) => {
          reject(res)
        })
      }
      const contentLength = res.headers['content-length']
      // 最大10M的文件
      if (contentLength > 10 * 1024 * 1024) {
        return reject('sorry, file too big')
      }
      const contentType = res.headers['content-type'].toLowerCase()
      res.setEncoding('binary')
      var str = "";
      res.on("data", function (chunk) {
        str += chunk; //监听数据响应，拼接数据片段
      })
      const gzip = res.headers["content-encoding"] == 'gzip'
      res.on("end", function () {
        (gzip ? unGzip(str) : Promise.resolve(str)).then(result => {
          resolve({
            data: result,
            contentType
          })
        })
      })
    })
  })
}

const defaultOptions = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-cn',
    'Connection': 'keep-alive',
    'Accept-Encoding': 'gzip'
  }
}