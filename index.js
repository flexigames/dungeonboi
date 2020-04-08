import createGame from "crtrdg-gameloop"
import { populateLevel, drawLevel } from "./lib/level"
import drawUI from "./lib/ui"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities, drawEntities } from "./lib/entities"
import Camera from "./lib/camera"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

const player = new Player(250, 240)

createEntity(player)
initInput(player)
populateLevel()

let camera

game.on("draw", function (ctx) {
  if (!camera) {
    camera = new Camera(ctx)
    camera.zoomTo(512)
    ctx.imageSmoothingEnabled = false
  }

  camera.begin()

  camera.moveTo(player.pos.x, player.pos.y)

  drawLevel(ctx)
  drawEntities(ctx)

  camera.end()

  drawUI(ctx)
})

game.on("update", function (dt) {
  updateEntities(dt)
  controlPlayer(player)
})

game.start()
