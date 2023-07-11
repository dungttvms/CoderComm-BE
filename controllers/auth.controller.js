const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};
authController.loginWithEmail = catchAsync(async (req, res, next) => {
  //Step1: Get data from request
  let { email, password } = req.body;

  //Step 2: Business Logic Validation
  const user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  //Step 3: Process
  //3.1 So sánh mật khẩu nhập vào và mật khẩu đã được mã hóa bằng bcrypt (compare)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");

  //3.2. Xử lý dữ liệu
  const accessToken = await user.generateToken();

  //Step 4: Response result
  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});
module.exports = authController;
