Component({
  properties: {
    posts: Array,
    usersMap: Object,
    commentsMap: Object,
  },
  data: {
    showCommentModal: false,
    modalType: '',
    commentDetailList: [],
    commentDetailCount: 0,
    commentContent: '',
    currentPostId: '',
    inputFocus: false,
    modalAnimation: '',
  },
  methods: {
    async onLike(e) {
      const postId = e.currentTarget.dataset.id;
      const userId = 'currentUserId'; // 假设有登录用户
      await wx.cloud.callFunction({
        name: 'mcloud',
        data: { router: 'post/like', postId, userId }
      });
      this.triggerEvent('reload');
    },

    onComment(e) {
      this.setData({
        showCommentModal: true,
        modalType: 'input',
        currentPostId: e.currentTarget.dataset.id,
        commentContent: '',
        inputFocus: true
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
        currentPostId: ''
      });
    },
  

    async onCommentDetail(e) {
      const postId = e.currentTarget.dataset.id;
      const commentsRes = await wx.cloud.callFunction({
        name: 'mcloud',
        data: { router: 'comment/list', postId }
      });
      this.setData({
        showCommentModal: true,
        modalType: 'detail',
        commentDetailList: commentsRes.result.data || [],
        commentDetailCount: (commentsRes.result.data || []).length,
        currentPostId: postId,
        commentContent: '',
        inputFocus: false
      });
    },
  },
});