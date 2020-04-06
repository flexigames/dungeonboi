import createGame from "crtrdg-gameloop"
import Arrows from "crtrdg-arrows"
import drawLevel from "./lib/level"
import { animateSprite } from "./lib/sprite"
import drawUI from "./lib/ui"
import Player from "./entities/Player"

const game = createGame()
const arrows = new Arrows()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(140, 240)

const entities = [player]

game.on("draw", function (ctx, dt) {
  drawLevel(ctx)
  drawEntities(ctx)
  drawUI(ctx)
})

game.on("update", function (dt) {
  let horizontal = 0
  let vertical = 0
  if (arrows.isDown("left")) {
    horizontal -= 1
  }
  if (arrows.isDown("right")) {
    horizontal += 1
  }
  if (arrows.isDown("up")) {
    vertical -= 1
  }
  if (arrows.isDown("down")) {
    vertical += 1
  }

  player.setDirection(horizontal, vertical)
  updateEntities(dt)
})

window.onclick = () => {
  player.flip()
}

game.start()

function drawEntities(ctx) {
  entities.forEach((it) => it.draw(ctx))
}

function updateEntities(dt) {
  entities.forEach((it) => it.update(dt))
}
