const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const { globalErrorHandler } = require("./helpers/globarErrorHandler");

// all global middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1", require("./routes/index.api"));

// global error handling middleware
app.use(globalErrorHandler);

module.exports = { app };
