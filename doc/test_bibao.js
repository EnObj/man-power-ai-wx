const map = {a:1,b:2,c:3,d:4,e:5}

for(const code in map){
  // 调用异步函数
  // const _code = code
  doSomething(code).then(res=>{
    // 输出
    console.log(`doSomething('${code}') = ${res}`)
  })
}

// 异步处理
function doSomething(code){
  return new Promise(resolve=>{
    // 模拟异步处理
    setTimeout(()=>{
      resolve(Math.pow(map[code], 2))
    }, 1000 * Math.random())
  })
}

// 请问上面这段JS代码运行后控制台会输出什么？