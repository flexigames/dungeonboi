import createGame from "crtrdg-gameloop"
import Arrows from "crtrdg-arrows"
import drawLevel from "./lib/level"
import drawUI from "./lib/ui"
import Player from "./entities/Player"
import Enemy from "./entities/Enemy"
import { createEntity, updateEntities, drawEntities } from "./lib/entities"

const game = createGame()
const arrows = new Arrows()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(140, 240)
const enemy = new Enemy(340, 240)

createEntity(player)
createEntity(enemy)

game.on("draw", function (ctx) {
  drawLevel(ctx)
  drawEntities(ctx)
  drawUI(ctx)
})

game.on("update", function (dt) {
  updateEntities(dt)
  controlPlayer()
})

window.onclick = () => {
  player.attack()
}

export function controlPlayer() {
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
}

game.start()
