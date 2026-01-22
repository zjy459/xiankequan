import config from '../../../config'
const API_BASE_URL = config.BASE_URL;
Page({
  data: {
    user_id: '',
    title: '',
    content: '',
    fileList: [],
    create_time: '',
    like_count: 0
  },
  onLoad() {
    // 初始化时间
    this.setData({
      create_time: this.formatDate(new Date()),
      like_count: 0
    });
  },
  // 处理图片上传
  afterRead(event) {
    const { file } = event.detail;
    let newFileList = this.data.fileList.concat(file instanceof Array ? file : [file]);
    this.setData({ fileList: newFileList });
  },
  // 表单提交
  formSubmit(e) {
    const {  title, content, create_time, like_count } = this.data;
    if (!title || !content) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发布中...' });
    wx.request({
      url: `${API_BASE_URL}/user/posts/create`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token') // 登录后保存的token
      },
      data: {
        title: title,
        content: content,
        createTime: create_time,
        likeCount: like_count
      },
      success: res => {
        wx.hideLoading();
        const body = res.data;
  
        if (
          res.statusCode === 200 &&
          body &&
          body.code === 1 &&
          body.data // 后端返回的 PostsVO
        ) {
          wx.showToast({ title: '发布成功', icon: 'success' });
  
          // 根据需要，你可以用 body.data 更新本地列表或做别的事
  
          this.setData({
            user_id:'',
            title: '',
            content: '',
            create_time: this.formatDate(new Date()),
            like_count: 0
          });
  
          setTimeout(() => {
            wx.navigateBack();
          }, 800);
        } else {
          wx.showToast({
            title: (body && body.msg) || '发布失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },
  // 时间格式化
  formatDate(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },
  // 表单输入
  onUserIdInput(e) {
    this.setData({ user_id: e.detail });
  },
  onTitleInput(e) {
    this.setData({ title: e.detail });
  },
  onContentInput(e) {
    this.setData({ content: e.detail });
  },
});