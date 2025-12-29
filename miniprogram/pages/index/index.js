Page({
  data: {
    posts: [],
    usersMap: {},
    commentsMap: {},
    active: 0,
  },

  async onLoad() {
    await this.loadPosts();
  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: "未登录",
        content: "请先登录",
        showCancel: false,
        success:()=>{
          wx.navigateTo({
            url: '/pages/index/login/login'
          });
        }
      })
      return;
    }
    // ... 有 token 时的正常业务
  },
  // 加载帖子列表以及用户和评论数据
  async loadPosts() {
    // 获取帖子列表
    const postsRes = await wx.cloud.callFunction({
      name: 'mcloud',
      data: { router: 'post/list' }
    });
    const posts = postsRes.result.data;

    // 收集所有用户ID
    const userIds = [...new Set(posts.map(p => p.userId))];

    // 批量获取用户信息
    const usersRes = await wx.cloud.callFunction({
      name: 'mcloud',
      data: { router: 'user/list', userIds }
    });
    const usersMap = {};
    for (const u of usersRes.result.data) usersMap[u._id] = u;

    // 批量获取评论
    const commentsMap = {};
    for (const post of posts) {
      const commentsRes = await wx.cloud.callFunction({
        name: 'mcloud',
        data: { router: 'comment/list', postId: post._id, limit: 4 }
      });
      commentsMap[post._id] = commentsRes.result.data || [];
    }

    this.setData({ posts, usersMap, commentsMap });
  },

  //跳转到某个页面
  goToTargetPage() {
    wx.navigateTo({
      url: './Post/Post' // 这里写目标页面的路径
    });
  },
  //图标切换
  onChange(event) {
    this.setData({ active: event.detail });
  },

});