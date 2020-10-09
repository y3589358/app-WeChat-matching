// test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    flag:false,
    imgH:0,//图片高度
    x:0,
    y:0,
    data:[
      {index:1,imgSrc:'../image/Mercury.png'},
      {index:2,imgSrc:'../image/Mars.png'},
      {index:3,imgSrc:'../image/Venus.png'},
      {index:4,imgSrc:'../image/earth.png'}
    ],
    disabled: true,
    elements:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var query = wx.createSelectorQuery();
      var nodesRef = query.selectAll(".item");
      nodesRef.fields({
        dataset: true,
        rect:true
    },(result)=>{
        this.setData({
          elements: result
        })
        }).exec()
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

  },


  //长按
  _longtap:function(e){
    const detail = e.detail;
    this.setData({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
    this.setData({
      hidden: false,
      flag:true
    })

  },
  //触摸开始
  touchs:function(e){
    this.setData({
      beginIndex:e.currentTarget.dataset.index
    })
  },
  //触摸结束
  touchend:function(e){
    if (!this.data.flag) {
      return;
    }
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    const list = this.data.elements;
    let data = this.data.data
    for(var j = 0; j<list.length; j++){
      const item = list[j];
      if(x>item.left && x<item.right && y>item.top && y<item.bottom){
        const endIndex = item.dataset.index;
        const beginIndex = this.data.beginIndex;
        //向后移动
        if (beginIndex < endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i < endIndex; i++) {
            data[i] = data[i + 1]
          }
          data[endIndex] = tem;
        }
        //向前移动
        if (beginIndex > endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i > endIndex; i--) {
            data[i] = data[i - 1]
          }
          data[endIndex] = tem;
        }

        this.setData({
          data: data
        })
      }
    }
    this.setData({
      hidden: true,
      flag: false
    })
  },
  //滑动
  touchm:function(e){
    if(this.data.flag){
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      this.setData({
        // x: x - 75,
        y: y - this.data.imgH*0.8
      })
    }
  },
  //页面跳转
  goNextPage:function(){
    wx.navigateTo({
      url: '/pages/scientist/index',  
    })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let query = wx.createSelectorQuery();
    query.select('.item').boundingClientRect(rect=>{
      this.data.imgH = rect.height;
      console.log('imgH',this.data.imgH);
    }).exec();
  },
})