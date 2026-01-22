import config from "../../config"
const API_BASE_URL = config.BASE_URL; // 根据你的实际后端地址修改
const APP = getApp()
Page({
  data: {
    categories: [
      { id: 1, name: '数码', icon: '../../images/icons/oldshopping/computer.png' },
      { id: 2, name: '家电', icon: '../../images/icons/oldshopping/appliance.png' },
      { id: 3, name: '手机', icon: '../../images/icons/oldshopping/phone.png' },
      { id: 4, name: '图书', icon: '../../images/icons/oldshopping/book.png' },
      { id: 5, name: '运动', icon: '../../images/icons/oldshopping/sport.png' }
    ],
    goodsRecommend: [],
    pingtuanList: [],
    goods: [],
    loadingMoreHidden: false,
    loading: true
  },
  toDetailsTap: function (e) {
    console.log(e);
    const id = e.currentTarget.dataset.id
    const supplytype = e.currentTarget.dataset.supplytype
    const yyId = e.currentTarget.dataset.yyid
    if (true) {
      wx.navigateTo({
        url: `/pages/oldshoppings/goods-details/goods-details?id=${id}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadGoodsData()
  },
  loadGoodsData() {
    this.setData({ loading: true })
    Promise.all([
      this.fetchGoodsList('/goods/recommend'),
      this.fetchGoodsList('/goods/pingtuan'),
      this.fetchGoodsList('/goods/normal')
    ])
      .then(([recommendList, rawPingtuanList, normalList]) => {
        const goodsRecommend = this.normalizeRecommendGoods(recommendList)
        const pingtuanList = this.normalizePingtuanGoods(rawPingtuanList)
        const goods = this.normalizeNormalGoods(normalList)

        this.setData({
          goodsRecommend,
          pingtuanList,
          goods,
          loading: false
        });

        // 存到全局变量
        const app = getApp()
        app.globalData.goodsRecommend = goodsRecommend
        app.globalData.pingtuanList = pingtuanList
        app.globalData.goods = goods
        console.log('全局变量更新成功', app.globalData)
      })
      .catch((error) => {
        console.error('加载商品数据失败', error)
        wx.showToast({ title: '加载失败', icon: 'none' })
        this.setData({ loading: false })
      })
  },
  fetchGoodsList(path) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${API_BASE_URL}${path}`,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('token')
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.data) {
            resolve(res.data.data)
          } else {
            reject(new Error(`接口返回异常: ${path}`))
          }
        },
        fail: reject
      })
    })
  },
  normalizeRecommendGoods(list = []) {
    return list.map(this.mapBaseGoods)
  },
  normalizePingtuanGoods(list = []) {
    return list.map((item) => ({
      ...this.mapBaseGoods(item),
      pingtuanPrice: item.price,
      tags: item.tags || '拼团价'
    }))
  },
  normalizeNormalGoods(list = []) {
    return list.map(this.mapBaseGoods)
  },
  mapBaseGoods(item = {}) {
    return {
      id: item.id,
      name: item.name,
      pic: item.pic,
      minPrice: item.price,
      originalPrice: item.originalPrice,
      characteristic: item.characteristic,
      supplyType: item.supplyType,
      yyId: item.yyId,
      image: item.image
    }
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

  },

})