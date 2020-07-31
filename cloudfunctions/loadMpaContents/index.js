// 云函数入口文件
const cloud = require('wx-server-sdk')
const specialGroupCenter = require('./specialGroupCenter.js')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)

  // 随机级别
  event.randomLevel = event.randomLevel || 'group'
  event.groups = event.groups || []

  // 组范围
  const {
    groups,
    randomLevel
  } = event

  // 按随机级别使用不同的策略
  var result = []
  if(randomLevel == 'group'){
    result = await loadOnGroupRandomLevel(groups)
  }else{
    result = await loadOnContentRandomLevel(groups)
  }

  // 剔除空壳
  return result.filter(item=>{
    return !!item
  })
}

const loadOnGroupRandomLevel = async(groups) => {
  // 空组则查库
  if(!groups || !groups.length){
    groups = (await db.collection('mpa_content_group').get()).data.map(group=>{
      return group._id
    })
  }

  const result = []
  for(var i=0;i<10;i++){
    // 随机得到组
    const group = groups[Math.floor(Math.random() * groups.length)]
    // console.log(`摇号结果：${group}`)
    // 特别组是否能处理
    var mpaContent = await specialGroupCenter.getOneMpaContentRandomOnGroup(group)
    // 处理不了找存档
    if(!mpaContent){
      mpaContent = await getOneMpaContentNew({
        group: group
      })
    }
    result.push(mpaContent)
  }

  return result
}

const getOneMpaContentNew = async (where) => {
  const result = await db.collection('mpa_content').aggregate().match(where).sample({
    size: 1
  }).end()

  return result.list[0]
}

const loadOnContentRandomLevel = async(groups)=>{
  const where = {}
  if (groups && groups.length > 0) {
    where.group = db.command.in(groups)
  }
  // 求资源库条目总数目
  const {
    total: mpaContentCount
  } = await db.collection('mpa_content').where(where).count()
  // 求特别组条目总数目
  const specialTotal = await specialGroupCenter.count(groups)
  const allCount = mpaContentCount + specialTotal

  // 随机抓取
  const result = []
  if (!!allCount) {
    for (var i = 0; i < 10; i++) {
      // 有一定的几率命中special
      const targetNum = Math.ceil(Math.random() * (allCount))
      if (targetNum > mpaContentCount) {
        // 得到特别词条
        const mpaContent = await specialGroupCenter.getOneMpaContentRandom(groups, targetNum - mpaContentCount)
        result.push(mpaContent)
        continue
      }
      // 得到存档词条
      const mpaContent = await getOneMpaContent(targetNum - 1, where)
      result.push(mpaContent)
    }
  }

  return result
}

const getOneMpaContent = async (skip, where) => {

  const res = await db.collection('mpa_content').where(where).skip(skip).limit(1).get()

  return res.data[0]
}