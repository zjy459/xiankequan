// pages/index/CommentDetail/CommentDetail.js
const commentData = require('../../../utils/commentData.js');

Page({
  data: {
    loadingDetail: true,
    postId: '',
    comment_list: [],
    comment_list2: [],
    focus: false,
    placeholder: '说点什么...',
    placeholder2: '说点什么，让ta也认识看笔记的你',
    value: '',
    comment_text: '',
    now_reply_name: null,
    now_reply_type: 0,
    now_parent_id: 0,
    now_reply: 0,
    usersMap: {},
    currentUserId: commentData.CURRENT_USER_ID
  },

  onLoad(options = {}) {
    const initialPostId = options.postId || this.resolveDefaultPostId();
    this.setData({
      loadingDetail: true, // 页面加载时显示骨架屏
      postId: initialPostId,
      usersMap: commentData.getUsersMap()
    });
    // 模拟异步加载
    setTimeout(() => {
      this.loadCommentData(initialPostId);
      this.setData({ loadingDetail: false });
    }, 1200); // 1.2秒后关闭骨架屏
  },

  onShow() {
    if (this.data.postId) {
      this.setData({ usersMap: commentData.getUsersMap() });
      setTimeout(() => {
        this.loadCommentData(this.data.postId);
        this.setData({ loadingDetail: false });
      }, 600); // 返回页面时也短暂显示骨架屏
    }
  },

  resolveDefaultPostId() {
    const posts = commentData.getPosts();
    return posts.length ? posts[0].id : '';
  },

  async loadCommentData(postId) {
    if (!postId) return;
    const { comment_list, comment_list2 } = await commentData.getCommentDetailData(postId);
    this.setData({
      comment_list: comment_list || [],
      comment_list2: comment_list2 || []
    });
  },

  replyComment(e) {
    const cid = e.currentTarget.dataset.cid;
    const name = e.currentTarget.dataset.name;
    const pid = e.currentTarget.dataset.pid;
    const type = Number(e.currentTarget.dataset.type || 0);
    this.setData({
      focus: true,
      placeholder: `回复${name}：`,
      now_reply: cid,
      now_reply_name: name,
      now_parent_id: pid,
      now_reply_type: type
    });
  },

  confirm(e) {
    const content = (e.detail.value || '').trim();
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    const { postId, now_reply, now_reply_type, now_parent_id } = this.data;
    let parentId = 0;
    let replyId = 0;

    if (now_reply) {
      replyId = now_reply;
      parentId = now_reply_type === 1 ? now_reply : now_parent_id;
    }

    // 提交评论时可短暂显示骨架屏
    this.setData({ loadingDetail: true });
    commentData.addComment({
      postId,
      content,
      parentId,
      replyId
    });

    setTimeout(() => {
      this.loadCommentData(postId);
      this.setData({
        comment_text: '',
        now_reply: 0,
        now_reply_name: null,
        now_reply_type: 0,
        now_parent_id: 0,
        placeholder: '说点什么...',
        focus: false,
        loadingDetail: false
      });
    }, 800);
  },

  bindconfirm(e) {
    const content = (e.detail.value || '').trim();
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    const { postId } = this.data;
    commentData.addComment({
      postId,
      content,
      parentId: 0,
      replyId: 0
    });

    setTimeout(() => {
      this.loadCommentData(postId);
      this.setData({
        value: '',
        placeholder2: '说点什么，让ta也认识看笔记的你',
        loadingDetail: false
      });
    }, 800);
  },

  blur(e) {
    const text = (e.detail.value || '').trim();
    if (!text) {
      this.setData({
        now_reply: 0,
        now_reply_name: null,
        now_reply_type: 0,
        now_parent_id: 0,
        placeholder: '说点什么呢，万一火了呢',
        focus: false
      });
    }
  }
});