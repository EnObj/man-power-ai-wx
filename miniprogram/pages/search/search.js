const db = wx.cloud.database()
const pageSize = 20

// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mpaContents: [],
    count: 0,
    loaded: false,
    keyword: '',
    group: '',
    more: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const keyword = decodeURIComponent(options.keyword || '大学')
    wx.setNavigationBarTitle({
      title: '搜索“' + keyword + "”",
    })
    this.setData({
      keyword: keyword,
      group: options.group
    })
    this.query = db.collection('mpa_content').where({
      group: options.group || 'daxue',
      content: db.RegExp({
        regexp: keyword,
        options: 'i',
      })
    })
    // 查询数目
    this.query.count().then(res => {
      this.setData({
        count: res.total
      })
    })
    this.loadMpaContents()
  },

  loadMpaContents(mpaContents=[]){
    wx.showNavigationBarLoading()
    // 查询前20条
    this.query.orderBy('sort', 'asc').skip(mpaContents.length).limit(pageSize).get().then(res => {
      this.setData({
        mpaContents: mpaContents.concat(res.data.map(mpaContent=>{
          mpaContent.contents = mpaContent.content.split(this.data.keyword)
          return mpaContent
        })),
        loaded: true,
        more: res.data.length == pageSize,
      })
      wx.hideNavigationBarLoading()
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
    if(this.data.more){
      this.loadMpaContents(this.data.mpaContents)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '搜索“' + this.data.keyword + "”",
      path: '/pages/search/search?keyword=' + encodeURIComponent(this.data.keyword) + '&group=' + this.data.group
    }
  }
})