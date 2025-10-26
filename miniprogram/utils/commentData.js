const CURRENT_USER_ID = "user4";

const usersMap = {
  user1: { nickname: "用户一", avatarUrl: "/images/avatar1.png" },
  user2: { nickname: "用户二", avatarUrl: "/images/avatar2.png" },
  user3: { nickname: "用户三", avatarUrl: "/images/avatar3.png" },
  [CURRENT_USER_ID]: { nickname: "当前用户", avatarUrl: "/images/avatar4.png" }
};

const posts = [
  {
    _id: "post1",
    userId: "user1",
    title: "第一篇文章标题",
    createTime: "2025-10-20 14:30",
    likeCount: 5
  },
  {
    _id: "post2",
    userId: "user2",
    title: "第二篇文章标题",
    createTime: "2025-10-19 10:00",
    likeCount: 2
  }
];

const comments = [
  {
    id: 1,
    postId: "post1",
    userId: "user2",
    content: "这是一条评论内容",
    time: "2025年10月18日 09:20",
    parentId: 0,
    replyId: 0
  },
  {
    id: 2,
    postId: "post1",
    userId: "user1",
    content: "这是另一条评论内容",
    time: "2025年10月18日 11:05",
    parentId: 0,
    replyId: 0
  },
  {
    id: 3,
    postId: "post1",
    userId: "user2",
    content: "还有一条评论内容",
    time: "2025年10月18日 15:42",
    parentId: 0,
    replyId: 0
  },
  {
    id: 4,
    postId: "post1",
    userId: "user2",
    content: "大家快去办理吧!!!",
    time: "2025年10月18日 16:03",
    parentId: 3,
    replyId: 3
  },
  {
    id: 5,
    postId: "post1",
    userId: "user3",
    content: "办理优待证大概需要多长时间呢会不会需要特别长时间",
    time: "2025年10月18日 17:26",
    parentId: 3,
    replyId: 4
  }
];

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

function getPosts() {
  computeCommentCount();
  return clone(posts);
}

function getCommentsMap() {
  computeCommentCount();
  const map = {};
  comments.forEach((comment) => {
    if (comment.parentId !== 0) {
      return;
    }
    if (!map[comment.postId]) {
      map[comment.postId] = [];
    }
    map[comment.postId].push({
      _id: `comment-${comment.id}`,
      userId: comment.userId,
      content: comment.content
    });
  });
  posts.forEach((post) => {
    if (!map[post._id]) {
      map[post._id] = [];
    }
  });
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

function getCommentDetailData(postId) {
  const related = comments.filter((comment) => comment.postId === postId);
  const comment_list = related
    .filter((comment) => comment.parentId === 0)
    .map((comment) => mapCommentForDetail(comment));
  const comment_list2 = related
    .filter((comment) => comment.parentId !== 0)
    .map((comment) => mapCommentForDetail(comment));

  return {
    comment_list,
    comment_list2
  };
}

function addComment({ postId, userId, content, parentId = 0, replyId = 0 }) {
  const time = formatDate(new Date());
  const nextId = comments.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  comments.unshift({
    id: nextId,
    postId,
    userId,
    content,
    time,
    parentId,
    replyId
  });
  computeCommentCount();
  return nextId;
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
  CURRENT_USER_ID
};
