const socketio = require("socket.io");
const config = require("./config");

const randSign = () => Math.floor(Math.random() * 2) * 2 - 1;

class Game {
  /** @typedef { { score: number, x: number, y: number, down: boolean, up: boolean } } Player */
  /** @type { { players: Array<Player>, ball: { x: number, y: number, vx: number, vy: number } } } */
  gameState = {
    players: [{ score: 0 }, { score: 0 }],
    ball: {},
  };

  /** @type {Array<socketio.Socket>} */
  sockets = [];

  /** @type {socketio.Server} */
  io;

  constructor(io) {
    this.io = io;
    this.#newGame();
  }

  /**
   * adds a player to the game
   * @param {socketio.Socket} socket
   */
  addPlayer(socket) {
    let id = this.sockets.length;
    socket.emit("init", config);
    socket.emit("state", this.gameState);

    socket.on("keydown", (dir) => {
      this.gameState.players[id][dir] = true;
    });
    socket.on("keyup", (dir) => {
      this.gameState.players[id][dir] = false;
    });

    this.sockets.push(socket);

    if (this.sockets.length == 2) {
      console.log("game started!");
      setInterval(() => {
        this.#update();
      }, config.tickspeed);
    }
  }

  #newGame() {
    this.gameState.players[0].x = 3;
    this.gameState.players[0].y = config.height / 2;
    this.gameState.players[1].x = config.width - 4;
    this.gameState.players[1].y = config.height / 2;

    this.gameState.ball.x = config.width / 2;
    this.gameState.ball.y = Math.floor(Math.random() * config.height);
    this.gameState.ball.vx = randSign();
    this.gameState.ball.vy = randSign();
  }

  #update() {
    this.#updatePlayers();
    this.#updateBall();
    this.io.emit("state", this.gameState);
  }

  #updatePlayers() {
    for (let i = 0; i < this.gameState.players.length; i++) {
      let p = this.gameState.players[i];
      if (p.up) p.y--;
      if (p.down) p.y++;

      if (p.y < 0) p.y = 0;
      else if (p.y + config.paddleSize >= config.height)
        p.y = config.height - config.paddleSize;
    }
  }

  #updateBall() {
    let b = this.gameState.ball;
    b.x += b.vx;
    b.y += b.vy;

    let p1 = this.gameState.players[0],
      p2 = this.gameState.players[1];

    let p1Bounce = b.x == p1.x && p1.y <= b.y && b.y < p1.y + config.paddleSize,
      p2Bounce = b.x == p2.x && p2.y <= b.y && b.y < p2.y + config.paddleSize;
    if (p1Bounce || p2Bounce) b.vx = -b.vx;

    if (b.x <= 0) {
      p2.score++;
      this.#newGame();
    }
    if (b.x >= config.width - 1) {
      p1.score++;
      this.#newGame();
    }

    if (b.y <= 0) {
      b.y = 0;
      b.vy = -b.vy;
    } else if (b.y >= config.height - 1) {
      b.y = config.height - 1;
      b.vy = -b.vy;
    }
  }
}

module.exports = Game;
