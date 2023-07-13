const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Friend = require("../models/Friend");
const User = require("../models/User");

const friendController = {};

const calculateFriendCount = async (userId) => {
  const friendCount = await Friend.countDocuments({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  await User.findByIdAndUpdate(userId, { friendCount: friendCount });
};

friendController.sendFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const toUserId = req.body.to;

  const user = await User.findById(toUserId);
  if (!user) {
    throw new AppError(400, "User not found", "Send friend request error");
  }

  let friend = await Friend.findOne({
    $or: [
      { from: currentUserId, to: toUserId },
      { to: currentUserId, from: toUserId },
    ],
  });

  if (!friend) {
    // Create friend request
    friend = await Friend.create({
      from: currentUserId,
      to: toUserId,
      status: "pending",
    });
    return sendResponse(res, 200, true, friend, null, "Friend request sent");
  } else {
    switch (friend.status) {
      case "pending":
        if (friend.from.equals(currentUserId)) {
          throw new AppError(
            400,
            "You have already sent a request to this user",
            "Add friend error"
          );
        } else {
          throw new AppError(
            400,
            "You have received a request from this user",
            "Add friend error"
          );
        }
      case "accepted":
        throw new AppError(
          400,
          "You are already friends with this user",
          "Add friend error"
        );
      case "declined":
        friend.from = currentUserId;
        friend.to = toUserId;
        friend.status = "pending";
        await friend.save();
        return sendResponse(
          res,
          200,
          true,
          friend,
          null,
          "Friend request sent"
        );
      default:
        throw new AppError(400, "Friend status undefined", "Add Friend Error");
    }
  }
});

friendController.getReceivedFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let friendList = await Friend.find({
      to: currentUserId,
      status: "pending",
    });

    const friendIDs = friendList.map((friend) => {
      if (friend.from._id.equals(currentUserId)) return friend.to;
      return friend.from;
    });
    const filterConditions = [{ _id: { $in: friendIDs } }];
    if (filter.name) {
      filterConditions.push({
        ["name"]: { $regex: filter.name, $option: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 1;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);

    const usersWithFriendship = users.map((user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    return sendResponse(
      res,
      200,
      true,
      { users, usersWithFriendship, totalPages, count },
      null,
      null
    );
  }
);

friendController.getSentFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let friendList = await Friend.find({
      from: currentUserId,
      status: "pending",
    });

    const friendIDs = friendList.map((friend) => {
      if (friend.from._id.equals(currentUserId)) return friend.to;
      return friend.from;
    });
    const filterConditions = [{ _id: { $in: friendIDs } }];
    if (filter.name) {
      filterConditions.push({
        ["name"]: { $regex: filter.name, $option: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 1;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);

    const usersWithFriendship = users.map((user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    return sendResponse(
      res,
      200,
      true,
      { users, usersWithFriendship, totalPages, count },
      null,
      null
    );
  }
);
friendController.getFriendList = catchAsync(async (req, res, next) => {
  let { page, limit } = { ...req.query };
  const currentUserId = req.userId;

  let friendList = await Friend.find({
    $or: [{ from: currentUserId }, { to: currentUserId }],
    status: "accepted",
  });

  const friendIDs = friendList.map((friend) => {
    if (friend.from._id.equals(currentUserId)) return friend.to;
    return friend.from;
  });

  const filterConditions = [{ _id: { $in: friendIDs } }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $option: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 1;
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { users, totalPages, count }, null, null);
});

friendController.reactFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId; // To
  const fromUserId = req.params.userId; // From

  const friend = await Friend.findOne({
    to: currentUserId,
    from: fromUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(
      400,
      "Friend request not found",
      "React Friend Request Error"
    );

  await friend.save();
  if (friend.status === "accepted") {
    await calculateFriendCount(currentUserId);
    await calculateFriendCount(fromUserId);
  }
  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "React Friend Request successful"
  );
});

friendController.cancelFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId; //From
  const toUserId = req.params.userId; //To

  const friend = await Friend.findOne({
    from: currentUserId,
    to: toUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(400, "Friend request not found", "Cancel Request Error");
  await friend.deleteOne();

  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "Cancel friend request successful"
  );
});

friendController.removeFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const friendId = req.params.userId;

  const friend = await Friend.findOne({
    $or: [
      { from: currentUserId, to: friendId },
      { from: friendId, to: currentUserId },
    ],
    status: "accepted",
  });
  if (!friend)
    throw new AppError(400, "Friend not Found", "Remove Friend Error");
  await friend.deleteOne();
  await calculateFriendCount(currentUserId);
  await calculateFriendCount(friendId);
  return sendResponse(res, 200, true, friend, null, "Friend has been removed");
});

module.exports = friendController;
