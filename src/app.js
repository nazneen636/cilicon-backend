const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const { globalErrorHandler } = require("./helpers/globarErrorHandler");
const http = require("http");
const { initSocket } = require("./socket/server");
// all global middleware
const server = http.createServer(app);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173" }));

// routes
app.use("/api/v1", require("./routes/index.api"));

const io = initSocket(server);
// global error handling middleware
app.use(globalErrorHandler);

module.exports = { server };
