const controller = require("./data/controller");
const io = require("socket.io")(3001);

const users = {};

io.on("connection", socket => {
  
  socket.on("new-user", name => {
    controller.createUser(name).then(data => {
      console.log("user created: ", data);
      socket.emit("user-data", data);
      users[socket.id] = data.name;
      socket.broadcast.emit("user-connected", data.name);
    });

    controller.getUsers().then(data => {
      socket.emit("users-available", data);

      console.log("users", data);
    });
  });

  socket.on("login-user", name => {
    users[socket.id] = name;
    console.log("login: ", name);
  });

  socket.on("send-chat-message", data => {
    console.log('data-message',data);
    
    console.log(data.message);

    socket.broadcast.emit("chat-message", {
      message: data.message,
      name: users[socket.id]
    });
  });

  socket.on("new-conversation", data => {

    console.log('new conversation', data)
    
    controller.createConversation(data).then(data => {
      console.log("conversation created: ", data);
      socket.emit("conversation-data", data);
      /*
      users[socket.id] = data.name;
      socket.broadcast.emit("user-connected", data.name);
      */
    });

    

    /*
    controller.getUsers().then(data => {
      socket.emit("users-available", data);

      console.log("users", data);
    });
    */
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
