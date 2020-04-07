import createGame from "crtrdg-gameloop"
import { populateLevel, drawLevel } from "./lib/level"
import drawUI from "./lib/ui"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities, drawEntities } from "./lib/entities"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(140, 240)

createEntity(player)
initInput(player)
populateLevel()

game.on("draw", function (ctx) {
  drawLevel(ctx)
  drawEntities(ctx)
  drawUI(ctx)
})

game.on("update", function (dt) {
  updateEntities(dt)
  controlPlayer(player)
})

game.start()
