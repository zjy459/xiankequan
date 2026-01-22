App({
  globalData: {
    token: '',
    userInfo: null
  },
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-6gnvuufm846fe059',   // 推荐填写环境ID，云开发控制台可查看
        traceUser: true
      })
    }

    // ---------------检测navbar高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    console.log("小程序胶囊信息", menuButtonObject)
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight", navHeight);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

})