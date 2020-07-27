const COUNT = 7200000000
const GROUP_NAME = 'earth-people'

module.exports={
  // 得到预估数据规模
  getCount(){
    return Promise.resolve(COUNT)
  },
  getOneMpaContentRandom(){
    // 得到随机数
    return Promise.resolve({
      content: '' + Math.ceil(Math.random() * COUNT) + '号公民',
      group: GROUP_NAME,
      prompt: '想对TA说？',
      radioOptions: ['你是谁', '你在哪', '你在干什么']
    })
  },
  getGroupName(){
    return GROUP_NAME
  }
}