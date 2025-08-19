const { log, error } = require("console");
const { customError } = require("../helpers/customError");
const user = require("../models/user.model");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
const { sendSms } = require("../helpers/sendSms");
// registration
exports.registration = asyncHandler(async (req, res) => {
  const value = await validateUser(req);
  const userData = await new user({
    name: value.name,
    email: value.email || null,
    phone: value.phone || null,
    password: value.password,
  }).save();

  const otp = crypto.randomInt(1000, 9999);
  const expireTime = Date.now() + 10 * 60 * 1000;
  // const fLink = "https://dummyjson.com/docs/products";
  if (value.email) {
    const fLink = `https://www.mern.com/verify-account/:${userData.email}`;
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
  }

  if (value.phone) {
    const fLink = `https://www.mern.com/verify-account/:${userData.phone}`;
    const smsBody = `Your OTP is ${otp}. It will expire in ${expireTime}minutes. Click here to complete your registration: ${fLink}`;
    await sendSms(userData.phone, smsBody);
    userData.resetPasswordOtp = otp;
    userData.resetPasswordExpires = expireTime;
  }

  await userData.save();
  res.status(201).json({ userData });
});

// verify email
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, phone, otp } = req.body;

  if ((!email && !phone) || !otp) {
    throw new customError(401, "email or otp missing");
  }
  const findUser = await user.findOne({
    $and: [
      { $or: [{ email: email }, { phone: req.body.phone }] },
      { resetPasswordOtp: otp },
      { resetPasswordExpires: { $gt: Date.now() } },
    ],
  });
  if (email && findUser.email === email) {
    findUser.isEmailVerified = true;
  } else if (phone && findUser.phone === phone) {
    findUser.isPhoneVerified = true;
  }
  findUser.resetPasswordOtp = null;
  findUser.resetPasswordExpires = null;

  if (!findUser) {
    throw new customError(401, "user not found");
  }

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
  // const findUser = await user.findOne({
  //   $or: [{ email: email }, { phone: phone }],
  // });
  const findUser = await user.findOne({ email, phone });
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
  await findUser.save();
  apiResponse.sendSuccess(res, "login successfully", 200, {
    name: findUser.name,
    email: findUser.email,
    accessToken: accessToken,
  });
});

exports.logOut = asyncHandler(async (req, res) => {
  console.log(req?.headers);

  const token = req?.headers?.authorization || req?.body?.accessToken;
  const decode = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
  const client = await user.findById(decode.id);
  if (!client) {
    throw new customError("user not found", error);
  }
  // clear the refresh token
  client.refreshToken = null;
  await client.save();

  // now clear the cookie in browser
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "development" ? false : true,
    sameSite: "none",
    path: "/",
  });

  const smsRes = await sendSms(
    "01336993890",
    "Logout successfully" + client.name
  );
  apiResponse.sendSuccess(res, "logout successful", 200, client);
  if (smsRes.response_code !== 202) {
    throw new customError(500, "Send sms failed!!");
  }
});

exports.getMe = asyncHandler(async (req, res) => {
  const token = req?.headers?.authorization || req?.body?.accessToken;
  if (!token) {
    throw new customError("token missing");
  }
  let decode;
  try {
    decode = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
  } catch (error) {
    throw new customError("token not match or expired", error);
  }
  // console.log(decode.id);

  const findUser = await user.findById(decode.id);
  if (!findUser) {
    throw new customError("user not found", error);
  }
  apiResponse.sendSuccess(res, "user Exists", 200, {
    id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    phone: findUser.phone,
    isEmailVerified: findUser.isEmailVerified,
    isPhoneVerified: findUser.isPhoneVerified,
  });
});
