// 过去十年
const COUNT = 3652
const GROUP_NAME = 'remember-day'
const WEEK = ['日','一','二','三','四','五','六','日']

module.exports={
  // 得到预估数据规模
  getCount(){
    return Promise.resolve(COUNT)
  },
  getOneMpaContentRandom(){
    // 得到随机日
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() - Math.ceil(Math.random() * COUNT))
    return Promise.resolve({
      content: `${targetDate.getFullYear()}年${targetDate.getMonth()+1}月${targetDate.getDate()}日`,
      remarks: [`星期${WEEK[targetDate.getDay()]}`],
      group: GROUP_NAME,
      prompt: '还记得这一天过的怎么样吗？',
      radioOptions: ['记得', '实在想不起来']
    })
  },
  getGroupName(){
    return GROUP_NAME
  }
}