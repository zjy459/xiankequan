const commentData = require('../../../utils/commentData.js');

Component({
  properties: {},
  data: {
    showCommentModal: false,
    modalType: '',
    commentDetailList: [],
    commentDetailCount: 0,
    commentContent: '',
    currentPostId: '',
    inputFocus: false,
    modalAnimation: '',
    posts: [],
    usersMap: {},
    commentsMap: {},
  },
  lifetimes: {
    attached() {
      this.refreshData();
    },
  },
  pageLifetimes: {
    show() {
      this.refreshData();
    },
  },
  methods: {
    refreshData() {
      const posts = commentData.getPosts();
      const commentsMap = commentData.getCommentsMap();
      const usersMap = commentData.getUsersMap();
      this.setData({ posts, commentsMap, usersMap });
    },

    async onLike(e) {
      const postId = e.currentTarget.dataset.id;
      const userId = commentData.CURRENT_USER_ID;
      await wx.cloud.callFunction({
        name: 'mcloud',
        data: { router: 'post/like', postId, userId },
      });
      this.triggerEvent('reload');
    },

    onComment(e) {
      const postId = e.currentTarget.dataset.id; // 获取帖子 ID
      wx.navigateTo({
        url: `./CommentDetail/CommentDetail?postId=${postId}`, // 跳转到 CommentDetail 页面
      });
    },

    closeCommentModal() {
      this.setData({
        showCommentModal: false,
        modalType: '',
        commentDetailList: [],
        commentDetailCount: 0,
        commentContent: '',
        inputFocus: false,
        currentPostId: '',
      });
    },
  },
});