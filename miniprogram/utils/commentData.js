import config from "../config"
const API_BASE_URL = config.BASE_URL; // 根据你的实际后端地址修改
const CURRENT_USER_ID = "user4";

const usersMap = {
  user1: { nickname: "用户一", avatarUrl: "../../images/comment/ruonan1.png" },
  user2: { nickname: "用户二", avatarUrl: "../../images/comment/ruonan2.png" },
  user3: { nickname: "用户三", avatarUrl: "../../images/comment/ruonan1.png" },
  [CURRENT_USER_ID]: { nickname: "当前用户", avatarUrl: "../../images/comment/ruonan2.png" }
};

// 获取所有帖子
function getPosts() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/user/posts/list`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') // 登录后保存的token
      },
      success: res => {
        const body = res.data;        // Result 对象
        const posts = body && body.data; // 真正的帖子数组

        if (
          res.statusCode === 200 &&
          body &&
          body.code === 1 &&
          Array.isArray(posts)
        ) {
          resolve(posts);
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
      url: `${API_BASE_URL}/user/posts/${postId}/comments`,
      method: 'GET',
       header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') // 登录后保存的token
      },
      success: res => {
        const body = res.data;          // Result 对象
        const comments = body && body.data; // 真正的评论数组

        if (
          res.statusCode === 200 &&
          body &&
          body.code === 1 &&
          Array.isArray(comments)
        ) {
          resolve(comments);
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
    const total = comments.filter((comment) => comment.postId === post.id).length;
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
    const comments = await getCommentsByPostId(post.id);
    // console.log("comments", comments)
    map[post.id] = comments.map(comment => ({
      id: `comment-${comment.id}`,
      userId: comment.userId,
      content: comment.content,
      parentId: comment.parentId,
      replyId: comment.replyId
    }));
  }
  return map;
}

function mapCommentForDetail(comment, comments) {
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
  const comment_list = comments.filter(comment => comment.parentId === 0).map(comment => mapCommentForDetail(comment, comments));
  const comment_list2 = comments.filter(comment => comment.parentId !== 0).map(comment => mapCommentForDetail(comment, comments));
  return {
    comment_list,
    comment_list2
  };
}


function addComment({ postId, content, parentId = 0, replyId = 0 }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/user/posts/${postId}/comments/add`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data: { content, parentId, replyId },
      success: res => {
        const body = res.data;          // Result 对象
        const comment = body && body.data; // 后端返回的 CommentsVO

        if (
          res.statusCode === 200 &&
          body &&
          body.code === 1 &&
          comment &&
          comment.id &&
          comment.content
        ) {
          resolve(comment); // 直接把评论对象返回给调用方
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
