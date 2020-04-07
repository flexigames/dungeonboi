import createGame from "crtrdg-gameloop"
import drawLevel from "./lib/level"
import drawUI from "./lib/ui"
import Player from "./entities/Player"
import Enemy from "./entities/Enemy"
import Potion from "./entities/Potion"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities, drawEntities } from "./lib/entities"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(140, 240)
const enemy = new Enemy(340, 240)
const potion = new Potion(340, 270)

createEntity(player)
createEntity(enemy)
createEntity(potion)
initInput(player)

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
