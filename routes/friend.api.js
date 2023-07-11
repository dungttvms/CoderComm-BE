const express = require("express");
const router = express.Router();

/**
 * @route POST /friends/requests
 * @description Send a friend request
 * @body {to: User Id}
 * @access Login required
 */

/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 */

/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of sent pending requests
 * @access Login required
 */

/**
 * @route GET /friends
 * @description Get All Friends
 * @access Login required
 */

/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body {status: "accepted" or "declined"}
 * @access Login required
 */

/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */

/**
 * @route DELETE /friends/:userId
 * @description Remove a friend
 * @access Login required
 */
module.exports = router;
