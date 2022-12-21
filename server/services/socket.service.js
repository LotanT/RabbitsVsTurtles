const chatService = require("../api/chat/chat.service");

let gIo = null;
let onlineUsers = [];

function connectSockets(http) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log("New socket", socket.id);

    socket.on("join_chainId", (network) => {
      if (socket.network === network) return;
      if (socket.network) {
        onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
        socket.to(socket.network).emit(
          "online_users",
          onlineUsers.filter((data) => data.network === socket.network)
        );
        socket.leave(socket.network);
      }
      socket.join(network);
      socket.network = network;
      console.log(`User ${socket.id} joined network ${network}`);
    });

    socket.on("join_room", (room) => {
      if (socket.room === room) return;
      if (socket.room) {
        socket.leave(socket.room);
      }
      socket.join(room);
      socket.room = room;
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("online_user", (userData) => {
      onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
      onlineUsers.push({ userData, id: socket.id, network: socket.network });
      socket.emit(
        "online_users",
        onlineUsers.filter((data) => data.network === socket.network)
      );
      socket.to(socket.network).emit(
        "online_users",
        onlineUsers.filter((data) => data.network === socket.network)
      );
    });

    socket.on("send_message", (data) => {
      chatService.add(socket.network, data);
      socket.to(socket.network).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
      socket.to(socket.network).emit(
        "online_users",
        onlineUsers.filter((data) => data.network === socket.network)
      );
      console.log("user diconnected", socket.id);
    });
  });
}

module.exports = {
  connectSockets,
};
