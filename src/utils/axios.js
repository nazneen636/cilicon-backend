require("dotenv").config();
const { default: axios } = require("axios");
const { config } = require("dotenv");

const axiosInstance = axios.create({
  baseURL: process.env.STEADFAST_BASE_Url,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.STEADFAST_API_KEY,
    "Secret-Key": process.env.STEADFAST_SECRET_KEY,
  },
});
module.exports = { axiosInstance };
