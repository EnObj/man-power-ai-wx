const wxApiUtils = require('./../../utils/wxApiUtils.js')
const mpaUtils = require('./../../utils/mpaUtils.js')
const db = wx.cloud.database()

// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mpaContents: [],
    currentMpaContentIndex: -1,
    buttonSize: 30
  },

  nextMpaContentBtnTap(){
    this.nextMpaContent()
  },

  // 切换下一个mpaContent
  nextMpaContent(reverse) {
    const windowHeight = Math.ceil(wx.getSystemInfoSync().windowHeight)
    if(reverse && !this.data.currentMpaContentIndex){
      wx.showToast({
        title: `到顶了`,
        icon: 'none'
      })
      return
    }
    const outLocation = reverse ? windowHeight : -windowHeight
    // 出场动画
    this.animate('.mpa-content', [{
      translateY: 0, ease: 'ease-out'
    },{
      translateY: outLocation, ease: 'ease-out'
    }], 300, function () {
      // 切换索引
      this.updateIndex(this.data.currentMpaContentIndex - outLocation / windowHeight)
      // 入场动画
      this.animate('.mpa-content', [{
        translateY: -outLocation, ease: 'ease-out'
      },{
        translateY: 0, ease: 'ease-out'
      }], 400, function(){
        // this.clearAnimation('.mpa-content')
      }.bind(this))
    }.bind(this))
  },

  updateIndex(index){
    this.setData({
      currentMpaContentIndex: index
    })
    // 存量剩余不足3个了，就加载新的一批
    if (index >= this.data.mpaContents.length - 3) {
      mpaUtils.loadBatch(db).then(mpaContents => {
        this.setData({
          mpaContents: this.data.mpaContents.concat(mpaContents)
        })
      })
    }
  },

  radioChange(event) {
    const currentMapContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    db.collection('mpa_user_history').add({
      data: {
        content: currentMapContent,
        answer: event.detail.value,
        createTime: new Date()
      }
    }).then(res => {
      currentMapContent.answer = event.detail.value
      const updator  ={}
      updator[`mpaContents[${this.data.currentMpaContentIndex}]`] = currentMapContent
      this.setData(updator)
      this.nextMpaContent()
    })
  },

  // 展示更多菜单：设置范围，我的收藏等
  showMoreMenu() {
    wxApiUtils.showActions([{
      name: '我的收藏',
      callback() {
        wx.navigateTo({
          url: '/pages/mine/mine',
        })
      },
      condition: true
    },{
      name: '历史记录',
      callback() {
        wx.navigateTo({
          url: '/pages/mine/history',
        })
      },
      condition: true
    },{
      name: '设置',
      callback() {
        wx.navigateTo({
          url: '/pages/setting/setting',
        })
      },
      condition: true
    }])
  },

  // 收藏到我的页签
  collect() {
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    db.collection('mpa_user_collect').add({
      data: {
        content: mpaContent,
        createTime: new Date()
      }
    }).then(res => {
      mpaContent.isCollect = true
      const updator = {}
      updator['mpaContents[' + this.data.currentMpaContentIndex + ']'] = mpaContent
      this.setData(updator)
      wx.showToast({
        title: `已收藏`
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMpaContents(options.contentId).then(res=>{
      this.nextMpaContent()
    })
  },

  loadMpaContents(contentId){
    wx.showLoading({
      title: '加载中',
    })
    return mpaUtils.loadBatch(db, contentId).then(mpaContents => {
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

  startTouch(event){
    this.startTouchEvent = event
  },

  endTouch(event){
    const startTouchEvent = this.startTouchEvent
    // console.log(event, startTouchEvent)
    if(event.timeStamp - startTouchEvent.timeStamp < 1000){
      const changed = startTouchEvent.changedTouches[0].clientY - event.changedTouches[0].clientY
      if(Math.abs(changed) > 50){
        this.nextMpaContent(changed < 0)
      }
    }
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
    const groupsChanged = wx.getStorageSync('groupsChanged')
    if(groupsChanged){
      this.setData({
        currentMpaContentIndex: -1,
      })
      // 重新加载
      this.loadMpaContents().then(res=>{
        wx.removeStorageSync('groupsChanged')
        this.nextMpaContent()
      })
    }
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