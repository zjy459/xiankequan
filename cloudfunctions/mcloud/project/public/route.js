module.exports = {
  'post/list': 'PostController@getPosts',
  'user/list': 'UserController@getUsers',
  'comment/list': 'CommentController@getByPost',
  'comment/add': 'CommentController@addComment',
  'post/like': 'LikeController@likePost',
  'comment/like': 'LikeController@likeComment',
};