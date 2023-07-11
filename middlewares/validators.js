const { sendResponse } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validators = {};
validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  console.log("thông số nhập vào", req.body);
  const errors = validationResult(req);
  // console.log("Errors", errors);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");
  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

//Check Id có đúng chuẩn Id của MongooDB không?
validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

module.exports = validators;
