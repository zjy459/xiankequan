import commentData from '../../../utils/commentData.js';

Component({
  properties: {},
  data: {
    loading: true,
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
    showShare: false,
    options: [
      [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
      ],
      [
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
      ],
    ],
  },
  lifetimes: {
    attached() {
      this.setData({ loading: true });
      setTimeout(async () => {
        await this.refreshData();
        this.setData({ loading: false });
      }, 1500);
    },
  },
  pageLifetimes: {
    show() {
      this.refreshData();
    },
  },
  methods: {
    async refreshData() {
      const posts = await commentData.getPosts();
      const commentsMap = await commentData.getCommentsMap();
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
    onShare(event) {
      this.setData({ showShare: true });
    },

    onClose() {
      this.setData({ showShare: false });
    },

    onSelect(event) {
      Toast(event.detail.name);
      this.onClose();
    },
  },
});