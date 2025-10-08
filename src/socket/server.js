let io = null;
const { server, Server } = require("socket.io");
const { customError } = require("../helpers/customError.js");

module.exports = {
  initSocket: (hostServer) => {
    io = new Server(hostServer, {
      cors: {
        origin: "http://localhost:5173",
      },
    });
    // connect socket
    io.on("connection", (socket) => {
      console.log("client server connect", socket.id);
    });
    io.on("disconnect", (socket) => {
      console.log("client server disconnected");
    });
  },
  getIo: () => {
    if (!io) throw new customError(401, "Socket.io not initialized");
    return io;
  },
};
