const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Game = require("./game");

const config = require("./config");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

const game = new Game(io);

app.use((req, res, next) => {
  console.log(`GET ${req.url}`);
  next();
});
app.use(express.static(config.publicDir));

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  game.addPlayer(socket);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(config.port, function () {
  console.log(`server running at port ${config.port}`);
});
