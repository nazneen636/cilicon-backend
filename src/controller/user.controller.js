const { log } = require("console");
const { customError } = require("../helpers/customError");
const user = require("../models/user.model");
const cookieParser = require("cookie-parser");
const {
  registrationTemplate,
  resendOtpTemplate,
  resetPasswordTemplate,
} = require("../template/registration.template");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateUser } = require("../validation/user.validation");
const { mailer } = require("../helpers/nodemailer");
const crypto = require("crypto");
const apiResponse = require("../utils/apiResponse");
// registration
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const userData = await new user({
    name: value.name,
    email: value.email,
    password: value.password,
  }).save();

  const otp = crypto.randomInt(1000, 9999);
  const expireTime = Date.now() + 10 * 60 * 1000;
  const fLink = "https://dummyjson.com/docs/products";
  const template = registrationTemplate(
    userData.name,
    userData.email,
    otp,
    expireTime,
    fLink
  );
  await mailer(template, userData.email);
  userData.resetPasswordOtp = otp;
  userData.resetPasswordExpires = expireTime;
  await userData.save();
  res.status(201).json({ userData });
});

// verify email
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new customError(401, "email or otp missing");
  }

  const findUser = await user.findOne({
    $and: [
      { email: email },
      { resetPasswordOtp: otp },
      { resetPasswordExpires: { $gt: Date.now() } },
    ],
  });
  if (!findUser) {
    throw new customError(401, "user not found");
  }
  findUser.isEmailVerified = true;
  findUser.resetPasswordOtp = null;
  findUser.resetPasswordExpires = null;
  await findUser.save();
  // res.status(201).json({
  //   message: "verify done",
  // });
  apiResponse.sendSuccess(res, "verify done", 200, findUser);
});

// resend otp
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError(401, "email missing");
  }
  const userData = await user.findOne({
    email: email,
  });
  if (!userData) {
    throw new customError(401, "user not found");
  }
  const otp = crypto.randomInt(1000, 9999);
  const expireTime = Date.now() + 10 * 60 * 1000;
  const fLink = "https://dummyjson.com/docs/products";
  const template = resendOtpTemplate(
    userData.name,
    userData.email,
    otp,
    expireTime,
    fLink
  );
  await mailer(template, userData.email);
  userData.resetPasswordOtp = otp;
  userData.resetPasswordExpires = expireTime;
  await userData.save();
  apiResponse.sendSuccess(res, "resend your otp", 200, { name: userData.name });
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError(401, "email missing");
  }
  const userData = await user.findOne({
    email: email,
  });
  if (!userData) {
    throw new customError(401, "user not found");
  }

  const expireTime = Date.now() + 10 * 60 * 1000;
  const fLink = "https://dummyjson.com/docs/products";
  const template = resetPasswordTemplate(
    userData.name,
    userData.email,
    fLink,
    expireTime
  );
  await mailer(template, userData.email, "Reset Password");
  await userData.save();
  apiResponse.sendSuccess(res, "mail send for reset your password", 200, {
    name: userData.name,
  });
});

// reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    throw new customError(401, "email or password missing");
  }
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(newPassword)) {
    throw new customError(
      401,
      "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
  if (newPassword !== confirmPassword) {
    throw new customError(401, "password not matched!!");
  }

  const findUser = await user.findOne({
    email,
  });
  if (!findUser) {
    throw new customError(401, "user not found");
  }

  findUser.password = newPassword;
  await findUser.save();
  apiResponse.sendSuccess(res, "reset your password successfully", 200, {
    name: findUser.name,
  });
});

// login
exports.login = asyncHandler(async (req, res) => {
  const { email, password, phone } = await validateUser(req);
  const findUser = await user.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  if (!findUser) {
    throw new customError(401, "user not found");
  }
  const isMatchedPassword = await findUser.comparePassword(password);
  if (!isMatchedPassword) {
    throw new customError(401, "password not matched");
  }

  // token
  const accessToken = await findUser.generateAccessToken();
  const refreshToken = await findUser.generateRefreshToken();
  // send in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: true, // Only send over HTTPS
    sameSite: "none", // Prevents CSRF
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
  });
  findUser.refreshToken = refreshToken;
  apiResponse.sendSuccess(res, "login successfully", 200, {
    name: findUser.name,
    email: findUser.email,
    accessToken: accessToken,
  });
});
