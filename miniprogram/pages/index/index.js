Page({
  data: {
    posts: [],
    usersMap: {},
    commentsMap: {},
  },

  async onLoad() {
    await this.loadPosts();
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
});