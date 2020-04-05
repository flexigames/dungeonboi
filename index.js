const createGame = require('crtrdg-gameloop')

const game = createGame()

game.on('draw', function (renderer, dt) {
  console.log(dt)
})

