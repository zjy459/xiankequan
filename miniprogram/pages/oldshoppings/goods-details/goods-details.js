import config from "../../../config"
const API_BASE_URL = config.BASE_URL; // 根据你的实际后端地址修改
Page({
  data: {
    imgList: [
      '../../images/comment/ruonan1.png',
      '../../images/comment/ruonan2.png',],
    dishList: [],
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    console.log(app.globalData);
    const { id } = options || {};
    let allGoods = [];

    const goodsRecommend = app.globalData.goodsRecommend || [];
    const pingtuanList = app.globalData.pingtuanList || [];
    const goods = app.globalData.goods || [];
    allGoods = allGoods.concat(goodsRecommend, pingtuanList, goods);

    if (!allGoods.length) {
      const cacheRecommend = wx.getStorageSync('goodsRecommend') || [];
      const cachePingtuan = wx.getStorageSync('pingtuanList') || [];
      const cacheGoods = wx.getStorageSync('goods') || [];
      allGoods = allGoods.concat(cacheRecommend, cachePingtuan, cacheGoods);
    }

    if (!id) {
      wx.showToast({ title: '缺少商品ID', icon: 'none' });
      return;
    }

    const detail = allGoods.find(item => String(item.id) === String(id));
    if (detail) {
      this.setData({ detail });
    } else {
      wx.showToast({ title: '商品未找到', icon: 'none' });
    }
  },


  addToCart: function () {
    wx.request({
      url: `${API_BASE_URL}/user/shoppingCart/add`, // 替换为你的后端接口地址
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') // 登录后保存的token
      },
      data: {
        dishId: 7,              // 固定为6
        setmealId: 7,          // 固定为27
        dishFlavor: "番茄味2903"     // 固定为"番茄味"
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'error'
          });
          console.error('添加购物车失败', res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败',
          icon: 'error'
        });
        console.error('请求失败', err);
      }
    });
  },
  goShopCar: function () {
    wx.reLaunch({
      url: "pages/oldshoppings/shop-cart/shop-cart"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})