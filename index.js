import createGame from 'crtrdg-gameloop'
import level from 'level.txt'

console.log({level})

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const tileset = new Image(512, 512); // Using optional size for image
tileset.src = 'https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png?v=1586091258409'


// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);



game.on('draw', function (ctx, dt) {
  // ctx.drawImage(tileset, 0, 0, 16, 16, 0, 0, 16, 16)
  ctx.fillStyle = "#222"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(tileset, 16, 64, 16, 16, 0, 0, 16, 16)
})


game.start()
