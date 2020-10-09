var my_canvas = null,//canvas对象

strat_x_arr = [],strat_y_arr = [],end_x_arr = [],end_y_arr = [];//存放连线起始点和结束点的数组

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    flag:false,
    x:0,
    y:0,
    imgH:0,//图片高度
    canvasHeight:0,//画布高度
    data_scientist:[
      {index:1,imgSrc:'../image/qian.png'},
      {index:2,imgSrc:'../image/ai.png'},
      {index:3,imgSrc:'../image/huojin.jpg'},
    ],
    data_achievement:[
      {index:1,imgSrc:'../image/atomicBomb.png'},
      {index:2,imgSrc:'../image/HistoryTime.png'},
      {index:3,imgSrc:'../image/relativity.png'},
    ],
    disabled: true,
    elements:[]
  },

  /**
   * 手指触摸事件
   */
  EventHandleStart:function(e){
    //如果连线数大于左列图片数，不再渲染当前线条，划线功能失效
    if(end_y_arr.length<this.data.data_scientist.length){
      my_canvas = wx.createCanvasContext("myCanvas")
      my_canvas.save(); // 保存默认的状态
      var strat_x  = e.touches[0].x; // 手指开始触摸时的x轴 x轴--->相对于画布左边的距离
      var strat_y  = e.touches[0].y;// 手指开始触摸时的y轴 y轴--->相对于画布顶部的距离
      //判断触摸的起始位的纵坐标,强制定位起始点到图片的中间位置
      var rate = Math.floor(strat_y / this.data.imgH);  //向下取整
      strat_y = this.data.imgH * rate + this.data.imgH/2 + rate * 5
       if(strat_x > 1){
         strat_x = 5; //开始横坐标保持在紧挨图片的位置
       }
      strat_x_arr.push(strat_x);  //每次开始触摸的X轴坐标都存到数组里，画多条线时，需要多次调用lineTo和moveTo方法
      strat_y_arr.push(strat_y);
    }
 },

   /**
   * 手指触摸结束时的事件
   */
 EventHandleEnd: function (e) {
    //如果连线数大于左列图片数，不再渲染当前线条
    if(end_y_arr.length<this.data.data_scientist.length){
      var end_x =  e.changedTouches[0].x; // 手指结束触摸时的x轴 x轴--->相对于画布左边的距离
      var end_y =  e.changedTouches[0].y;// 手指结束触摸时的y轴 y轴--->相对于画布顶部的距离
      var rate = Math.floor(end_y / this.data.imgH);  //向下取整
      end_y = this.data.imgH * rate + this.data.imgH/2 + rate * 5
      end_x = this.data.imgH-5; //结束横坐标保持在紧挨图片的位置
       //为了禁止一对多的连线操作，循环并判断当前纵坐标数组，是否有和当前纵坐标相同的数据
       if(strat_y_arr.length>1){
        for(var i=0;i<strat_y_arr.length-1;i++){
          if(strat_y_arr[strat_y_arr.length-1] == strat_y_arr[i] ){
            wx.showToast({
              title: '只可一对一连线，请重新操作',
              icon: 'none',
              duration: 2000
            })
            this.clearLine();
            // strat_x_arr.splice(i,1);
            // strat_y_arr.splice(i,1);
            return;
          }
         }
       }

      end_x_arr.push(end_x);  //每次结束触摸的X轴坐标都存到数组里，画多条线时，需要多次调用lineTo和moveTo方法
      end_y_arr.push(end_y);

      if(end_y_arr.length>1){
        for(var i=0;i<end_y_arr.length-1;i++){
            if(end_y_arr[end_y_arr.length-1] == end_y_arr[i] ){
            //   strat_x_arr.splice(i,1);
            //   strat_y_arr.splice(i,1);
            //   end_x_arr.splice(i,1);
            //   end_y_arr.splice(i,1);
            // 重复连线（一对多）的处理逻辑是弹窗一个错误提示，然后清空之前操作，引导用户重新操作
            wx.showToast({
              title: '只可一对一连线，请重新操作',
              icon: 'none',
              duration: 2000
            })
            this.clearLine();
            return;
            }
        }
      }

        for(var i=0;i<end_x_arr.length;i++){
          this.drawLineArrow(strat_x_arr[i],strat_y_arr[i],end_x_arr[i],end_y_arr[i],'#7189EB')
        }
        my_canvas.draw() //将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
    }
 },

  /**
  * 绘制带有箭头的直线
  * @param cavParam canvas画布变量
  * @param fromX/fromY 起点坐标
  * @param toX/toY 终点坐标
  * @param color 线与箭头颜色
  **/
  drawLineArrow: function( fromX, fromY, toX, toY, color) {
  var headlen = 5;//自定义箭头线的长度
  var theta = 45;//自定义箭头线与直线的夹角，个人觉得45°刚刚好
  var arrowX, arrowY;//箭头线终点坐标
  // 计算各角度和对应的箭头终点坐标
  var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
  var angle1 = (angle + theta) * Math.PI / 180;
  var angle2 = (angle - theta) * Math.PI / 180;
  var topX = headlen * Math.cos(angle1);
  var topY = headlen * Math.sin(angle1);
  var botX = headlen * Math.cos(angle2);
  var botY = headlen * Math.sin(angle2);
  my_canvas.lineWidth = 2; //自定义线的宽度
  my_canvas.beginPath();
  //画直线
  my_canvas.moveTo(fromX, fromY);
  my_canvas.lineTo(toX, toY);
  my_canvas.closePath();
  arrowX = toX + topX;
  arrowY = toY + topY;
  //画上边箭头线
  my_canvas.moveTo(arrowX, arrowY);
  my_canvas.lineTo(toX, toY);

  arrowX = toX + botX;
  arrowY = toY + botY;
  //画下边箭头线
  my_canvas.lineTo(arrowX, arrowY);
  my_canvas.fillStyle = color;
  my_canvas.strokeStyle = color;
  
  my_canvas.fill();
  my_canvas.stroke() //画出当前路径的边框
},

  /**
   * 点击空白处清除画布，隐藏所有连线
   */
  clearLine:function(e){
    strat_x_arr = [];strat_y_arr = [];end_x_arr = [];end_y_arr = [];
    my_canvas.clearRect(0, 0, 75, 240)
    my_canvas.draw()
  },
  
  /**
   * 上一题
   */
  goPre:function(){
    wx.navigateBack({
      delta: 1
    })
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
    let query = wx.createSelectorQuery();
    query.select('.item').boundingClientRect(rect=>{
      this.data.imgH = rect.height;
       // 根据图片多少来赋值canvas高度
      var myCanvasHeight = this.data.data_scientist.length * this.data.imgH
      this.setData({
        canvasHeight: myCanvasHeight + (this.data.data_scientist.length-1) * 5 
      })
    }).exec();
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
})