const wxApiUtils = require('./../../utils/wxApiUtils.js')
const mpaUtils = require('./../../utils/mpaUtils.js')
const db = wx.cloud.database()

// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mpaContents:[],
    currentMpaContentIndex: 0
  },

  // 切换下一个mpaContent
  nextMpaContent(){
    const index = ++this.data.currentMpaContentIndex
    this.setData({
      currentMpaContentIndex: index
    })
    // 存量剩余不足3个了，就加载新的一批
    if(index >= this.data.mpaContents.length - 3){
      mpaUtils.loadBatch(db).then(mpaContents=>{
        this.setData({
          mpaContents: this.data.mpaContents.concat(mpaContents)
        })
      })
    }
  },

  radioChange(event){
    db.collection('mpa_user_history').add({
      data: {
        content: this.data.mpaContents[this.data.currentMpaContentIndex],
        answer: event.detail.value,
        createTime: new Date()
      }
    }).then(res=>{
      this.nextMpaContent()
    })
  },

  // 展示更多菜单：设置范围，我的收藏等
  showMoreMenu(){
    wxApiUtils.showActions([
      {
        name: '我的页签',
        callback(){
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        },
        condition:true
      }
    ])
  },

  // 收藏到我的页签
  collect(){
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    db.collection('mpa_user_collect').add({
      data:{
        content: mpaContent,
        createTime: new Date()
      }
    }).then(res=>{
      mpaContent.isCollect = true
      const updator = {}
      updator['mpaContents[' + this.data.currentMpaContentIndex + ']'] = mpaContent
      this.setData(updator)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    mpaUtils.loadBatch(db, options.contentId).then(mpaContents=>{
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: `成功加载${mpaContents.length}条`,
            icon: 'none'
          })
        },
      })
      this.setData({
        mpaContents: mpaContents
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    return {
      title: mpaContent.content,
      path: '/pages/index/index?contentId=' + mpaContent._id
    }
  }
})