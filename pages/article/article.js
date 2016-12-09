var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    content:"",
  },
  onPullDownRefresh:function() {
    wx.stopPullDownRefresh(); //收起下拉  
  },
  //加载文章
  onLoad: function(options) {
    var id = options.id
    var that = this
    wx.request({
      url: "https://www.omlzz.com/index.php/toupiao/api/article?id="+id,
      method: 'GET',
      data: {},
      success: function(res) {
        WxParse.wxParse('article', 'html', res.data.content, that, 20);
        
        that.setData({
          title:res.data.title,
          time:res.data.date,
          author:res.data.author,
        })
          
      }
    })

  }    
})
