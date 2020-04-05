const createGame = require('crtrdg-gameloop')

const game = createGame()

const image = new Image()

// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

game.on('draw', function (ctx, dt) {
  console.log(dt)
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
})


game.start()
