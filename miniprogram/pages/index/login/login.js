const API_BASE_URL = 'http://10.120.100.94:8081'; // 根据你的实际后端地址修改

Page({
  onLoginClick() {
    wx.login({
      success: res => {
        if (!res.code) {
          wx.showToast({ title: '微信登录失败', icon: 'none' });
          return;
        }
        console.log("code:",res.code)
        // 请求后端登录接口
        wx.request({
          url: `${API_BASE_URL}/user/user/login`,
          method: 'POST',
          header: { 'Content-Type': 'application/json' },
          data: { code: res.code },
          success: response => {
            const { data } = response;
            if (response.statusCode === 200 && data?.data?.token) {
              // 登录成功，保存 token 和用户信息
              wx.setStorageSync('token', data.data.token);
              wx.setStorageSync('userInfo', {
                id: data.data.id,
                openid: data.data.openid
              });
              wx.showToast({ title: '登录成功', icon: 'success' });
              // 跳转首页页面（如果首页有tabbar，用wx.switchTab，否则用wx.redirectTo）
              wx.switchTab
                ? wx.switchTab({ url: '/pages/index/index' })
                : wx.redirectTo({ url: '/pages/index/index' });
            } else {
              wx.showToast({ title: '登录失败', icon: 'none' });
              console.warn('登录后端接口返回异常', response);
            }
          },
          fail: err => {
            wx.showToast({ title: '服务异常', icon: 'none' });
            console.error('调用登录接口失败:', err);
          }
        });
      },
      fail: err => {
        wx.showToast({ title: '微信授权失败', icon: 'none' });
        console.error('wx.login调用失败:', err);
      }
    })
  }
})