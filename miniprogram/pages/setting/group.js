const db = wx.cloud.database()

// miniprogram/pages/setting/group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: null,
    keyword: '',
    focus: false,
    keywords: []
  },

  startFocusInp(event){
    this.setData({
      focus: true
    })
  },

  unfocus(){
    this.setData({
      focus: false
    })
  },

  cleanKeyword() {
    this.setData({
      keyword: ''
    })
  },

  keywordChange(event) {
    const value = event.detail.value
    this.setData({
      keyword: value
    })
  },

  confirm(event) {
    this.go(event.detail.value)
  },

  go(keyword) {
    keyword = keyword.trim()
    if (!keyword) {
      wx.showToast({
        title: '关键词不能为空',
        icon: 'none'
      })
      return
    }
    this.setData({
      keyword: keyword
    })
    setTimeout(()=>{
      this.addToLocalHistory(keyword)
    }, 1000)
    wx.navigateTo({
      url: '/pages/search/search?keyword=' + encodeURIComponent(keyword) + '&group=' + this.data.group._id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.getMpaContentGroup(options.groupId||'daxue').then(group=>{
      this.setData({
        group: group
      })
      wx.hideNavigationBarLoading()
    })
    // 最近搜索
    this.loadKeywords()
  },

  getMpaContentGroup(id){
    // 先检查上下文
    const mpaContentGroup = getApp().globalData.tappedMpaContentGroup
    if(mpaContentGroup && mpaContentGroup._id == id){
      return Promise.resolve(mpaContentGroup)
    }
    return db.collection('mpa_content_group').doc(id).get().then(res=>{
      return res.data
    })
  },

  loadKeywords(){
    const page = this
    wx.getStorage({
      key: 'searchKeywords',
      success: function(res) {
        page.setData({
          keywords: res.data || []
        })
      },
    })
  },

  addToLocalHistory: function(keyword) {
    const page = this
    var keywords = page.data.keywords
    if (keywords.indexOf(keyword) < 0) {
      keywords.unshift(keyword)
      wx.setStorage({
        key: 'searchKeywords',
        data: keywords,
        success() {
          page.setData({
            keywords: keywords
          })
        }
      })
    }
  },

  searchKeyword: function(event) {
    this.go(event.currentTarget.dataset.keyword)
  },

  cleanKeywords: function() {
    var page = this
    wx.showModal({
      content: '确认清空搜索历史？',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'searchKeywords',
            success: function(res) {
              page.setData({
                keywords: []
              })
            },
          })
        }
      }
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