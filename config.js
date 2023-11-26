const path = require("path");

module.exports = {
  port: 3000,
  publicDir: path.join(__dirname, "public"),

  width: 64,
  height: 32,
  tickspeed: 50,
  paddleSize: 6,
};
