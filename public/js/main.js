const config = {
  tickspeed: 1000 / 24,
  paddleSize: 6,
};

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas"),
  $canvas = $(canvas),
  ctx = canvas.getContext("2d");

let width = canvas.width,
  height = canvas.height,
  aspect = width / height;

function resizeCanvas() {
  let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    windowAspect = windowWidth / windowHeight;

  if (windowAspect > aspect) {
    // make height match
    let scale = windowHeight / height;
    $canvas.css(
      "transform",
      `translate(${(windowWidth - width) / 2}px, ${(windowHeight - height) / 2}px) scale(${scale})`
    );
  } else {
    let scale = windowWidth / width;
    $canvas.css(
      "transform",
      `translate(${(windowWidth - width) / 2}px, ${(windowHeight - height) / 2}px) scale(${scale})`
    );
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/** @type {{[keycode: number]: boolean}} */
let keys = {};
// register key presses
$(document).on("keydown", (e) => {
  keys[e.which] = true;
});
$(document).on("keyup", (e) => {
  keys[e.which] = false;
});
/**
 * @param {number} key key code of the key
 * @returns {boolean}
 */
function isKeyDown(key) {
  return keys[key] || false;
}

const randSign = () => Math.floor(Math.random() * 2) * 2 - 1;

let p1X, p2X, p1Y, p2Y, ballX, ballY, ballVx, ballVy;

let p1Score = 0,
  p2Score = 0;

function init() {
  p1X = 3;
  p2X = width - 4;
  p1Y = height / 2;
  p2Y = height / 2;
  ballX = width / 2;
  ballY = Math.floor(Math.random() * height);
  ballVx = randSign();
  ballVy = randSign();
}
init();

let font3x5 = new Image(30, 5);
font3x5.src = "../img/3x5font.png";

function render() {
  ctx.clearRect(0, 0, width, height);

  ctx.fill = "black";

  ctx.fillRect(p1X, p1Y, 1, config.paddleSize);
  ctx.fillRect(p2X, p2Y, 1, config.paddleSize);

  ctx.fillRect(Math.round(ballX), Math.round(ballY), 1, 1);

  let p1ScoreStr = p1Score.toString(),
    p2ScoreStr = p2Score.toString();

  let cursor = canvas.width / 2 - 2 - 4 * p1ScoreStr.length;
  for (let i = 0; i < p1ScoreStr.length; i++) {
    let digit = Number.parseInt(p1ScoreStr[i]);
    ctx.drawImage(font3x5, 3 * digit, 0, 3, 5, cursor, 1, 3, 5);
    cursor += 4;
  }

  cursor = canvas.width / 2 + 3;
  for (let i = 0; i < p2ScoreStr.length; i++) {
    let digit = Number.parseInt(p2ScoreStr[i]);
    ctx.drawImage(font3x5, 3 * digit, 0, 3, 5, cursor, 1, 3, 5);
    cursor += 4;
  }
}

function update() {
  let p1V = 0;
  if (isKeyDown(87))
    // w
    p1V--;
  if (isKeyDown(83))
    // s
    p1V++;

  p1Y += p1V;
  if (p1Y < 0) {
    p1Y = 0;
    p1V = 0;
  } else if (p1Y + config.paddleSize >= height) {
    p1Y = height - config.paddleSize;
    p1V = 0;
  }

  let p2V = 0;
  if (isKeyDown(73))
    // i
    p2V--;
  if (isKeyDown(75))
    // k
    p2V++;

  p2Y += p2V;
  if (p2Y < 0) {
    p2Y = 0;
    p2V = 0;
  } else if (p2Y + config.paddleSize >= height) {
    p2Y = height - config.paddleSize;
    p2V = 0;
  }

  ballX += ballVx;
  ballY += ballVy;

  if (ballX == p1X && p1Y <= ballY && ballY < p1Y + config.paddleSize) {
    ballVx = -ballVx;
    ballVy += 0.5 * p1V;
  } else if (ballX == p2X && p2Y <= ballY && ballY < p2Y + config.paddleSize) {
    ballVx = -ballVx;
    ballVy += 0.5 * p2V;
  }

  if (ballX <= 0) {
    p2Score++;
    init();
  }
  if (ballX >= width - 1) {
    p1Score++;
    init();
  }

  if (ballY <= 0) {
    ballY = 0;
    ballVy = -ballVy;
  } else if (ballY >= height - 1) {
    ballY = height - 1;
    ballVy = -ballVy;
  }
}

function tick() {
  update();
  render();
}

setInterval(tick, config.tickspeed);
