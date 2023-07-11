const { catchAsync, sendResponse } = require("../helpers/utils");
const Post = require("../models/Post");

const postController = {};

postController.createNewPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  console.log("CurrentUSER", currentUserId);
  let { content, image } = req.body;

  let post = await Post.create({ content, image, author: currentUserId });

  return sendResponse(
    res,
    200,
    true,
    post,
    null,
    "Created new Post Successful"
  );
});

module.exports = postController;
