let io;
exports.IoFactory = ({
  init(server) {
    io = require("socket.io")(server);
    return io;
  },
  get() {
    if (!io) new Error("Socket not init!");
    return io;
  }
})