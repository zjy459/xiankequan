// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-6gnvuufm846fe059',   // 推荐填写环境ID，云开发控制台可查看
        traceUser: true
      })
    }
  }
})