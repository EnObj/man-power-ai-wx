const db = wx.cloud.database()
const mpaUtils = require('./../../utils/mpaUtils.js')

// miniprogram/pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups: [],
    categorys: []
  },

  // 用户打开/关闭某个词条组
  groupSelect(event){
    const targetGroup = event.currentTarget.dataset.group

    const groups = wx.getStorageSync('groups') || []
    // 去掉当前操作的group
    const newGroups = groups.filter(group=>{
      return group._id != targetGroup._id
    })

    if(event.detail.value){
      newGroups.push(targetGroup)
    }

    if(!newGroups.length){
      wx.showToast({
        title: '至少选中一个单词本',
        icon:'none'
      })
      newGroups.push(targetGroup)
      this.setData({
        groups: this.data.groups.map(group=>{
          group.checked = false
          if(group._id == targetGroup._id){
            group.checked = true
          }
          return group
        })
      })
    }

    wx.setStorageSync('groups', newGroups)
    wx.setStorageSync('groupsChanged', true)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载选中的组
    var selectedGroups = wx.getStorageSync('groups') || []
    // 加载所有组
    mpaUtils.loadAllGroup(db).then(groups=>{
      if(!selectedGroups.length){
        selectedGroups = groups
        wx.setStorageSync('groups', selectedGroups)
      }
      this.setData({
        groups: groups.map(group=>{
          group.checked = selectedGroups.some(selectedGroup=>{
            return group._id == selectedGroup._id
          })
          group.category = group.category || '其他'
          return group
        }),
        categorys: groups.reduce((categorys, group)=>{
          const category = group.category
          if(!categorys.includes(category)){
            if(category == '其他'){
              categorys.push(category)
            }else{
              categorys.unshift(category)
            }
          }
          return categorys
        },[])
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

  }
})