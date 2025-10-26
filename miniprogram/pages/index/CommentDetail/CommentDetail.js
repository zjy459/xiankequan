// pages/index/CommentDetail/CommentDetail.js
const commentData = require('../../../utils/commentData.js');

Page({
  data: {
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
      postId: initialPostId,
      usersMap: commentData.getUsersMap()
    });
    this.loadCommentData(initialPostId);
  },

  onShow() {
    if (this.data.postId) {
      this.setData({ usersMap: commentData.getUsersMap() });
      this.loadCommentData(this.data.postId);
    }
  },

  resolveDefaultPostId() {
    const posts = commentData.getPosts();
    return posts.length ? posts[0]._id : '';
  },

  loadCommentData(postId) {
    if (!postId) {
      return;
    }
    const { comment_list, comment_list2 } = commentData.getCommentDetailData(postId);
    this.setData({ comment_list, comment_list2 });
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

    const { postId, now_reply, now_reply_type, now_parent_id, currentUserId } = this.data;
    let parentId = 0;
    let replyId = 0;

    if (now_reply) {
      replyId = now_reply;
      parentId = now_reply_type === 1 ? now_reply : now_parent_id;
    }

    commentData.addComment({
      postId,
      userId: currentUserId,
      content,
      parentId,
      replyId
    });

    this.loadCommentData(postId);
    this.setData({
      comment_text: '',
      now_reply: 0,
      now_reply_name: null,
      now_reply_type: 0,
      now_parent_id: 0,
      placeholder: '说点什么...',
      focus: false
    });
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

    const { postId, currentUserId } = this.data;
    commentData.addComment({
      postId,
      userId: currentUserId,
      content,
      parentId: 0,
      replyId: 0
    });

    this.loadCommentData(postId);
    this.setData({
      value: '',
      placeholder2: '说点什么，让ta也认识看笔记的你'
    });
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