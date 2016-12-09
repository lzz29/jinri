Page({
  'is_load':1,  //是否能加载文章
  'firstLoad':1, //判断是否首次添加
  data: {
    articles: [],
    fload:true, //是否显示load
    nocont:true,
    bnum: 0,    //出发底部事件
    lastid: 0,  //文章的最后id
  },


  //加载页面
  onLoad: function() {
    this.loadArticle()
  },

  //加载文章
  loadArticle:function()
  {
    this.is_load = 1; //下拉加载内容

    var that = this
    if(this.firstLoad == 1) {
      
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 10000
      })
    };
    
    //异步加载文章内容
    wx.request({
      url: 'https://www.omlzz.com/index.php/toupiao/api/get',
      method: 'GET',
      data: {},
      success: function(res) {
          wx.hideToast()
          var mydata = res.data.msg
          that.setData({
            articles: mydata
          });

          wx.stopPullDownRefresh(); //收起下拉

          //获取数组的最后一个数据的id
          var lastdata = mydata[mydata.length-1]
          //console.log(lastdata)
          that.data.lastid = lastdata.id
        }
      })

  },
  //上拉加载
  onPullDownRefresh:function() {
    this.firstLoad = 0;
    this.loadArticle();
  },
  //底部上拉加载
  onReachBottom:function(){

    if(this.is_load == 0) {
      return
    }

    var num = this.data.bnum;
    this.data.bnum = num + 1;
    
    if(num < 1) {
      return
    }
    
    this.setData({
      fload:false,
    })
    
    var that = this
    //加载更多文章
    wx.request({
      url: 'https://www.omlzz.com/index.php/toupiao/api/more',
      method: 'GET',
      data: {id:this.data.lastid},
      success: function(res) {
          
          var mydata = res.data.msg

          if(res.data.count == 0) {
            that.is_load = 0; //下拉不能继续加载内容
            that.setData({
              fload:true,
              nocont:false,
            })

            return
          }

          //设置最后文章最后的id
          var lastdata = mydata[mydata.length-1]
          that.data.lastid = lastdata.id

          var ndata = that.data.articles.concat(mydata)
          
          that.setData({
              articles:ndata
          })
        }
      })

  }
})
