const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Friend = require("../models/Friend");
const bcrypt = require("bcryptjs"); // Thư viện mã hóa password

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  //Step1: Get data from request
  let { name, email, password } = req.body;

  //Step 2: Business Logic Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");

  //Step 3: Process
  //3.1 Mã hóa mật khẩu bằng bcrypt
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  //3.2. Xử lý dữ liệu
  user = await User.create({ name, email, password });
  const accessToken = await user.generateToken();

  //Step 4: Response result
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  //Step 1: Get data
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };

  //Step 2: Business Logic Validator (Lấy danh sách người dùng có phân trang)
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }]; //Chỉ hiển thị người dùng chưa bị xóa

  // query người dùng bằng tên (đã xử lý trường hợp jac - jackie)
  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" },
    });
  }
  // Kết hợp các query với nhau
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit); //Tính tông số trang
  const offset = limit * (page - 1); // Offset: Những user bỏ đi. Lấy 1 (### ### ### # (3 * (4-1)))

  // Lấy toàn bộ người dùng
  let users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);
  // sort : Sắp xếp theo thời gian tạo user mới nhất
  // skip offset
  // limit

  //Kiểm tra mối quan hệ của từng user trong list trả về với current User
  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = await User.findOne({
      $or: [
        { from: currentUserId, to: user._id },
        { to: currentUserId, from: user._id },
      ],
    });
    return temp;
  });
  const userWithFriendship = await Promise.all(promises);

  //Step 4: Send Response
  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count, userWithFriendship },
    null,
    "Get All Users Successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  //Step 1: Get data
  const currentUserId = req.userId;

  //Step 2: Business Logic Validator
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  //Step 3: Process

  //Step 4: Response result
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User Successful"
  );
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  //Step 1: Get data
  const currentUserId = req.userId; //Dùng để trả về mối quan hệ giữa 2 users
  const userId = req.params.id;

  //Step 2: Business Logic Validator
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get Single User Error");

  //Step 3: Process (check isFriend )
  user = user.toJSON();
  user.friendship = await Friend.findOne({
    $or: [
      { from: currentUserId, to: user._id },
      { from: user._id, to: currentUserId },
    ],
  });

  //Step 4: Response result
  return sendResponse(res, 200, true, user, null, "Get Single User Successful");
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  //Step 1: Get data
  const currentUserId = req.userId;
  const userId = req.params.id;

  //Step 2: Business Logic Validator
  //2.1: Chỉ được update profile bản thân, không được update của người khác
  if (currentUserId !== userId)
    throw new AppError(400, "Permission required", "update User Error");
  //2.2. Tìm user
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "update User Error");

  //Step 3: Process
  // 3.1. Tạo 1 array gồm các trường được phép update (VD: Không đươc update Email)
  const allows = [
    "name",
    "avatarUrl",
    "coverUrl",
    "aboutMe",
    "city",
    "country",
    "company",
    "jobTitle",
    "facebookLink",
    "twitterLink",
    "instagramLink",
    "linkedinLink",
  ];
  //3.2. map các trường để cập nhật
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  //3.3. Lưu vào data
  await user.save();

  //Step 4: Response Result
  return sendResponse(res, 200, true, user, null, "Updated User Successful");
});

module.exports = userController;
