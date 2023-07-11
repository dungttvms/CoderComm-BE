const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const postController = require("../controllers/post.controller");

/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */

/**
 * @route POST /posts
 * @description Create a new post
 * @body {content, image}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([body("content", "Missing content").exists().notEmpty()]),
  postController.createNewPost
);

/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */

/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */

/**
 * @route GET /posts/:id
 * @description Get details of a single post
 * @access Login required
 */

/**
 * @route GET /posts/:id/comments
 * @description Get comments of a single post
 * @access Login required
 */

module.exports = router;
