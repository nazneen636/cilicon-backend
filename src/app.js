const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const { globalErrorHandler } = require("./helpers/globarErrorHandler");

// all global middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short"));
}
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1", require("./routes/index.api"));

// global error handling middleware
app.use(globalErrorHandler);

module.exports = { app };
