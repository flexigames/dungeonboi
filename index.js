import createGame from "crtrdg-gameloop"
import Arrows from 'crtrdg-arrows'
import drawLevel from "./lib/level"
import { animateSprite } from "./lib/sprite"
import drawUI from "./lib/ui"
import Player from "./lib/Player"

const game = createGame()
const arrows = new Arrows()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(140, 240)

const entities = [player]

game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  drawEntities(ctx)
  drawUI(ctx)
})

arrows.on("down", function() {
  
})

game.start()

function drawEntities(ctx) {
  entities.forEach(it => it.draw(ctx))
}
