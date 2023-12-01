(function () {
  const socket = io();

  socket.on("init", init);
  socket.on("state", render);

  setInterval(() => {
    let start = Date.now();
    socket.emit("ping");
    socket.once("pong", function () {
      console.log(Date.now() - start);
    });
  }, 5000);

  let config, width, height;

  function init(data) {
    config = data;

    width = config.width;
    height = config.height;
    let aspect = width / height;

    function resizeCanvas() {
      let windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        windowAspect = windowWidth / windowHeight;

      if (windowAspect > aspect) {
        // make height match
        let scale = windowHeight / height;
        $canvas.css(
          "transform",
          `translate(${(windowWidth - width) / 2}px, ${
            (windowHeight - height) / 2
          }px) scale(${scale})`
        );
      } else {
        let scale = windowWidth / width;
        $canvas.css(
          "transform",
          `translate(${(windowWidth - width) / 2}px, ${
            (windowHeight - height) / 2
          }px) scale(${scale})`
        );
      }
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let keyEvent of ["keydown", "keyup"])
      $(document).on(keyEvent, (e) => {
        if (e.which === 87) {
          // w
          socket.emit(keyEvent, "up");
        }
        if (e.which === 83) {
          // s
          socket.emit(keyEvent, "down");
        }
      });
  }

  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas"),
    $canvas = $(canvas),
    ctx = canvas.getContext("2d");

  let font3x5 = new Image(30, 5);
  font3x5.src = "../img/3x5font.png";

  function render(state) {
    let p1 = state.players[0],
      p2 = state.players[1],
      b = state.ball;

    ctx.clearRect(0, 0, config.width, config.height);

    ctx.fill = "black";

    ctx.fillRect(p1.x, p1.y, 1, config.paddleSize);
    ctx.fillRect(p2.x, p2.y, 1, config.paddleSize);

    ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 1);

    let p1ScoreStr = p1.score.toString(),
      p2ScoreStr = p2.score.toString();

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
})();
