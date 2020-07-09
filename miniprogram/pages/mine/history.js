const db = wx.cloud.database()
const pageSize = 20

// miniprogram/pages/mine/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historys: [],
    more: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.loadHistory()
  },

  loadHistory(historys = []) {
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('mpa_user_history').where({}).orderBy('createTime', 'desc').skip(historys.length).limit(pageSize).get().then(res => {
      this.setData({
        historys: historys.concat(res.data.map(history=>{
          history.createTime = history.createTime.getTime()
          return history
        })),
        more: res.data.length == pageSize
      })
      wx.hideLoading()
    })
  },

  deleteHistory(event){
    const historyId = event.currentTarget.dataset.historyId
    db.collection('mpa_user_history').doc(historyId).remove().then(res=>{
      const index = +event.currentTarget.dataset.historyIndex
      this.data.historys.splice(index, 1)
      this.setData({
        historys: this.data.historys
      })
    }).then(res=>{
      if(this.data.historys.length < pageSize && this.data.more){
        this.loadHistory(this.data.historys)
      }
    })
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
    if(this.data.more){
      this.loadHistory(this.data.historys)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})