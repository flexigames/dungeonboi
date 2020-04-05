import createGame from "crtrdg-gameloop"
import drawLevel from "./lib/level"
import {animateSprite} from "./lib/sprite"
import drawUI from "./lib/ui"
import Player from './lib/Player'

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const entities = [
  new Player(140, 240)
]


game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  drawEntities(ctx)
  drawUI(ctx)
})

game.start()

function drawEntities(ctx) {
  entities.forEach(it => it.draw(ctx))
}
