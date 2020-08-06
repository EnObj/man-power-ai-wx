const db = wx.cloud.database()
const mpaUtils = require('./../../utils/mpaUtils.js')

// miniprogram/pages/index/content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mpaContent: null,
    group: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('mpa_content').doc(options.contentId).get().then(res=>{
      this.setData({
        mpaContent: res.data
      })
      // 加载组信息
      mpaUtils.getOneGroupById(db, res.data.group).then(group=>{
        this.setData({
          group: group
        })
      })
    })
  },

  // 收藏到我的页签
  collect() {
    const mpaContent = this.data.mpaContent
    // 先显示
    mpaContent.isCollect = true
    this.setData({
      mpaContent: mpaContent
    })
    // 后提交
    db.collection('mpa_user_collect').add({
      data: {
        content: mpaContent,
        createTime: new Date()
      }
    }).then(res=>{
      wx.showToast({
        title: `已收藏`
      })
    })
  },

  tapLink(){
    const page = this
    wx.showModal({
      content: '小程序不支持访问网页，请使用浏览器打开此网址（点击“确认”将自动拷贝原文网址到粘贴板）。',
      confirmColor: '#07c160',
      success(res){
        if(res.confirm){
          wx.setClipboardData({
            data: page.data.mpaContent.link,
          })
        }
      }
    })
    
  },

  tapImage(){
    wx.previewImage({
      urls: [this.data.mpaContent.image],
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

  }
})