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
    buttonSize: 35,
    groupMap: {},
    keyboardHeight: 0
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
    if(!reverse){
      const currentMpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
      // 可以配置不可跳过
      if(currentMpaContent && currentMpaContent.disableSkip && !currentMpaContent.answer){
        wx.showToast({
          title: '当前条目不可跳过',
          icon: 'none'
        })
        return
      }
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
    // 超出了范围，自动形成环
    if(index >= this.data.mpaContents.length){
      index = 0
    }
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

    // 当前content
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]

    // 如果禁止分享了，那么禁止分享
    if(mpaContent.disableShare){
      wx.hideShareMenu()
    }else{
      wx.showShareMenu()
    }
  },

  radioChange(event) {
    this.answer(event.detail.value)
  },

  answer(answerValue){
    const currentMapContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    const answer = {
      content: currentMapContent,
      answer: answerValue,
      createTime: new Date()
    }
    return db.collection('mpa_answer').add({
      data: answer
    }).then(res=>{
      return db.collection('mpa_user_history').add({
        data: answer
      }).then(res => {
        currentMapContent.answer = answerValue
        const updator  ={}
        updator[`mpaContents[${this.data.currentMpaContentIndex}]`] = currentMapContent
        this.setData(updator)
        // 如果存在自动播放，等待自动翻页即可
        if(!this.data.autoPlayId){
          this.nextMpaContent()
        }
      })
    })
  },

  inputChange(event){
    this.answer(event.detail.value)
  },

  // 展示更多菜单：设置范围，我的收藏等
  showMoreMenu() {
    // 当前content
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]

    const page = this

    wxApiUtils.showActions([{
      name: '我的收藏',
      callback() {
        wx.navigateTo({
          url: '/pages/mine/mine',
        })
      },
      condition: true
    },
    {
      name: '播放',
      callback() {
        page.setData({
          autoPlayId: setInterval(page.nextMpaContent.bind(page), 3000)
        })
        wx.showToast({
          title: '已启动播放',
          icon:'none'
        })
      },
      condition: true
    },
    {
      name: '设置',
      callback() {
        wx.navigateTo({
          url: '/pages/setting/setting',
        })
      },
      condition: true
    },{
      name: '关于',
      callback() {
        wx.navigateTo({
          url: '/pages/about/about',
        })
      },
      condition: true
    }])
  },

  tapImage(){
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    wx.previewImage({
      urls: [mpaContent.image],
    })
  },

  tapLink(){
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    wx.showModal({
      content: '小程序不支持访问网页，请使用浏览器打开此网址（点击“确认”将自动拷贝原文网址到粘贴板）。',
      confirmColor: '#07c160',
      success(res){
        if(res.confirm){
          wx.setClipboardData({
            data: mpaContent.link,
          })
        }
      }
    })
  },

  stopAutoPlay(){
    clearInterval(this.data.autoPlayId)
    this.setData({
      autoPlayId: null
    })
  },

  // 收藏到我的页签
  collect() {
    const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
    // 先显示
    mpaContent.isCollect = true
    const updator = {}
    updator['mpaContents[' + this.data.currentMpaContentIndex + ']'] = mpaContent
    this.setData(updator)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.group){
      wx.setStorageSync('groups', [{_id:options.group}])
    }
    this.loadMpaContents(options.contentId).then(res=>{
      this.nextMpaContent()
    })
    this.loadGroups()
    // 监听键盘高度变化
    wx.onKeyboardHeightChange(res => {
      this.setData({
        keyboardHeight: res.height
      })
    })
  },

  loadGroups(){
    mpaUtils.loadAllGroup(db).then(groups=>{
      this.setData({
        groupMap: groups.reduce((map,group)=>{
          map[group._id] = group
          return map
        }, {})
      })
    })
  },

  loadMpaContents(contentId){
    wx.showLoading({
      title: '加载中',
    })
    return mpaUtils.loadBatch(db, contentId).then(mpaContents => {
      if(!mpaContents.length){
        mpaContents.push({
          content: '空空如也',
          remarks: ['什么也没有加载到，请点击“更多-设置”重新配置单词本。'],
          disableSkip: true,
          disableCollect: true,
          disableShare: true
        })
      }
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
    // 自动播放时不能滑动切换
    if(this.data.autoPlayId){
      return
    }
    const startTouchEvent = this.startTouchEvent
    // console.log(event, startTouchEvent)
    // 触摸需在1秒内完成，且起始点x坐标大于20避免过于灵敏
    if(event.timeStamp - startTouchEvent.timeStamp < 1000
      && startTouchEvent.changedTouches[0].clientX > 20){
      const changed = startTouchEvent.changedTouches[0].clientY - event.changedTouches[0].clientY
      if(Math.abs(changed) > 50){
        this.nextMpaContent(changed < 0)
      }
    }
  },

  tapContent(event){
    // 检测双击事件
    if(this.lastTapContentTime){
      if(event.timeStamp-this.lastTapContentTime < 300){
        const mpaContent = this.data.mpaContents[this.data.currentMpaContentIndex]
        // 存档的跳转到详情页
        if(mpaContent._id){
          // 缓存这个词条
          getApp().globalData.tappedMpaContent = mpaContent
          wx.navigateTo({
            url: '/pages/index/content?contentId=' + mpaContent._id,
          })
        }else{
          wx.showToast({
            title: `“${mpaContent.content}”未存档`,
            icon: 'none'
          })
        }
      }
    }
    this.lastTapContentTime = event.timeStamp
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
      // 重新加载group
      this.loadGroups()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.stopAutoPlay()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.stopAutoPlay()
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
    var title = mpaContent.content
    if(mpaContent.group && this.data.groupMap[mpaContent.group]){
      title = '@' + this.data.groupMap[mpaContent.group].name
    }
    return {
      title: title,
      path: '/pages/index/index?contentId=' + mpaContent._id + '&group=' + mpaContent.group
    }
  }
})