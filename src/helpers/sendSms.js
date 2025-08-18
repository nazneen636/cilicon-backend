const axios = require("axios");
const { customError } = require("./customError");

exports.sendSms = async (number, message) => {
  try {
    const response = axios.post(process.env.BULK_SMS_URL, {
      api_key: process.env.API_Key,
      senderId: process.env.SENDER_ID,
      number: Array.isArray(number) ? number.join(",") : number,
      message: message,
    });
    return response.data;
  } catch (error) {
    throw new customError("error from sending bulk sms", error);
  }
};
