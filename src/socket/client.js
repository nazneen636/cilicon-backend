const chalk = require("chalk");
const { io } = require("socket.io-client");
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  query: { userId: "123" },
});

// client-side
socket.on("connect", () => {
  console.log("connected to server with id", socket.id); // x8WIv7-mJelg7on_ALbx
});

// addtocart event listener from client
socket.on("cart", (data) => {
  console.log(chalk.bgGreenBright(data));
});

socket.emit("hello", {
  message: "Add to cart successfully",
  data: "d",
});

socket.on("disconnect", () => {
  console.log("Disconnected from server", socket.connected); // false
});

socket.on("connect_error", (error) => {
  console.log("Connection Error:", error.message);
});
