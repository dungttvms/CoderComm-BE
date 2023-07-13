const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const commentController = {};
const calculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false,
  });
  await Post.findByIdAndUpdate(postId, { commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  // Check post exists
  const post = Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create new Comment Error");
  //Create New comment
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });
  // Update CommentCount of the post
  await calculateCommentCount(postId);
  comment = await comment.populate("author");
  return sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "Create new comment Successful"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content } = req.body;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { content }, //{content: content}
    { new: true }
  );
  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User is not author",
      "Update Comment Error"
    );
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Update Comment successful"
  );
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: currentUserId,
  });
  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User is not author",
      "Delete Comment Error"
    );
  await calculateCommentCount(comment.post);
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Deleted Comment successful"
  );
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;

  let comment = await Comment.findById(commentId);
  if (!comment)
    throw new AppError(400, "Comment not found", "Get Single Comment Error");

  return sendResponse(res, 200, true, comment, null, "Get Comment successful");
});

module.exports = commentController;
