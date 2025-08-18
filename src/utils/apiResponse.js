class apiResponse {
  constructor(message, statusCode, data) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.status =
      this.statusCode >= 200 && this.statusCode < 300 ? "Ok" : "Error";
  }
  static sendSuccess(res, message, statusCode, data) {
    return res
      .status(statusCode)
      .json(new apiResponse(message, statusCode, data));
  }
}

module.exports = apiResponse;
