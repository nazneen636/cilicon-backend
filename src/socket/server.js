let io = null;
const { server, Server } = require("socket.io");
const { customError } = require("../helpers/customError.js");

module.exports = {
  initSocket: (hostServer) => {
    io = new Server(hostServer, {
      cors: {
        origin: "*",
      },
    });
    // connect socket http://localhost:5173
    io.on("connection", (socket) => {
      console.log("client server connect");
      const userId = socket.handshake.query.userId;
      if (userId) {
        socket.join(userId);
      }
      // console.log(userId);
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
