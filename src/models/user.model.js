const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { string, required } = require("joi");
require("dotenv").config();
const { Schema, Types } = mongoose;
const slugify = require("slugify");

const userSchema = new Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    unique: [true, "email must be unique"],
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  image: {},
  isEmailVerified: { type: Boolean },
  isPhoneVerified: { type: Boolean },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
    default: "Bangladesh",
  },
  state: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: Number,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    trim: true,
    enum: ["Male", "Female", "Custom"],
  },
  lastLogin: Date,
  lastLogOut: Date,
  cart: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  wishlist: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  newsLatterSubscribe: Boolean,
  role: [
    {
      type: Types.ObjectId,
      ref: "Role",
    },
  ],
  permission: [
    {
      permissionId: {
        type: Types.ObjectId,
        ref: "Permission",
      },
      action: {
        type: String,
        enum: ["create", "edit", "update", "delete"],
      },
    },
  ],
  resetPasswordOtp: Number,
  resetPasswordExpires: Date,
  twoFactorEnabled: Boolean,
  isBlocked: Boolean,
  isActive: Boolean,
  refreshToken: {
    type: String,
    trim: true,
  },
});

// make a hash password with mongoose middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
  }
  next();
});

// check user email and phone already exists or not
userSchema.pre("save", async function (next) {
  const isExists = await this.constructor.findOne({
    $or: [{ email: this.email }],
  });
  if (isExists && isExists._id.toString() !== this.id.toString()) {
    throw new Error("Email already exists");
  }
  next();
});

// compare password methods
userSchema.methods.comparePassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
      email: this.email,
      phone: this.phone,
      role: this.role,
    },
    process.env.ACCESSTOKEN_SECRET,
    { expiresIn: process.env.ACCESSTOKEN_EXPIRES }
  );
};

// generate refresh token
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    { expiresIn: process.env.REFRESHTOKEN_EXPIRES }
  );
};

// verify access token
userSchema.methods.verifyAccessToken = async function (token) {
  return await jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
};

// verify refresh token
userSchema.methods.verifyRefreshToken = async function (token) {
  return await jwt.verify(token, process.env.REFRESHTOKEN_SECRET);
};

module.exports = mongoose.model("user", userSchema);
