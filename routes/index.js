var express = require("express");
var router = express.Router();

//Auth API
const authApi = require("./auth.api");
router.use("/auth", authApi);

//User API
const userApi = require("./user.api");
router.use("/users", userApi);

//comment API
const commentApi = require("./comment.api");
router.use("/comments", commentApi);

//friend API
const friendApi = require("./friend.api");
router.use("/friends", friendApi);

//post API
const postApi = require("./post.api");
router.use("/posts", postApi);

//reaction API
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

module.exports = router;
