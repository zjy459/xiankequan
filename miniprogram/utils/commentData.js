const CURRENT_USER_ID = "user4";

const usersMap = {
  user1: { nickname: "用户一", avatarUrl: "../../images/comment/ruonan1.png" },
  user2: { nickname: "用户二", avatarUrl: "../../images/comment/ruonan2.png" },
  user3: { nickname: "用户三", avatarUrl: "../../images/comment/ruonan1.png" },
  [CURRENT_USER_ID]: { nickname: "当前用户", avatarUrl: "../../images/comment/ruonan2.png" }
};
const API_BASE_URL = 'http://10.120.100.94:8081'; // 根据实际后端地址修改

// 获取所有帖子
function getPosts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/posts`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') // 登录后保存的token
      },
      success: res => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          console.log(res.data);
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: err => reject(err)
    });
  });
}

// 获取某个帖子的评论
function getCommentsByPostId(postId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/posts/${postId}/comments`,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: err => reject(err)
    });
  });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function computeCommentCount() {
  posts.forEach((post) => {
    const total = comments.filter((comment) => comment.postId === post._id).length;
    post.commentCount = total;
  });
}

function getUsersMap() {
  return clone(usersMap);
}


// 兼容原有导出结构，getPosts/getCommentsMap等方法需异步调用


async function getCommentsMap() {
  const posts = await getPosts();
  const map = {};
  for (const post of posts) {
    const comments = await getCommentsByPostId(post._id);
    map[post._id] = comments.filter(c => c.parentId === 0).map(comment => ({
      _id: `comment-${comment.id}`,
      userId: comment.userId,
      content: comment.content
    }));
  }
  return map;
}

function mapCommentForDetail(comment) {
  const author = usersMap[comment.userId] || {};
  const replyTarget = comments.find((item) => item.id === comment.replyId);
  const parent = comments.find((item) => item.id === comment.parentId);
  const replyName = parent ? (usersMap[parent.userId]?.nickname || "") : "";
  const replyDisplayName = replyTarget ? (usersMap[replyTarget.userId]?.nickname || "") : replyName;

  return {
    comment_id: comment.id,
    comment_pr_id: comment.postId,
    comment_user_avatar: author.avatarUrl || "",
    comment_user_name: author.nickname || "匿名用户",
    comment_text: comment.content,
    comment_time: comment.time,
    reply_id: comment.replyId || 0,
    parent_id: comment.parentId || 0,
    reply_name: replyDisplayName
  };
}


async function getCommentDetailData(postId) {
  const comments = await getCommentsByPostId(postId);
  const comment_list = comments.filter(comment => comment.parentId === 0).map(mapCommentForDetail);
  const comment_list2 = comments.filter(comment => comment.parentId !== 0).map(mapCommentForDetail);
  return {
    comment_list,
    comment_list2
  };
}


function addComment({ postId, userId, content, parentId = 0, replyId = 0 }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/api/posts/${postId}/comments`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { userId, content, parentId, replyId },
      success: res => {
        if (res.statusCode === 200 && res.data && res.data.id) {
          resolve(res.data.id);
        } else {
          reject(res);
        }
      },
      fail: err => reject(err)
    });
  });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
}

module.exports = {
  getUsersMap,
  getPosts,
  getCommentsMap,
  getCommentDetailData,
  addComment,
  getCommentsByPostId,
  CURRENT_USER_ID
};
