module.exports = {
  showActions: function(actions) {
    var itemList = actions.filter(action => {
      return typeof action.condition == "function" ? action.condition() : !!action.condition
    }).map(action => {
      return action.name
    })
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        console.log(res)
        var action = actions.find(action => {
          return action.name == itemList[res.tapIndex]
        })
        action.callback();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
}