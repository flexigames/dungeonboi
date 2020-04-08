import { createLevel, populateLevel } from "./lib/level"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities } from "./lib/entities"
import * as PIXI from "pixi.js"
import { createTextures } from "./lib/sprite"
import state from "./lib/state"

const app = createGame()

app.loader.add("tileset", "assets/img/dungeon_tileset.png").load(setup)

function setup(loader, resources) {
  const textures = createTextures(resources.tileset.texture)

  state.textures = textures
  state.app = app

  createLevel()
  populateLevel()

  const player = new Player(250, 240)
  createEntity(player)
  initInput(player)

  app.ticker.add(createGameLoop(player))
}

function createGameLoop(player) {
  return function gameLoop(dt) {
    controlPlayer(player)
    updateEntities(dt)
  }
}

function createGame() {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0x222222,
    antialias: false,
  })

  document.body.appendChild(app.view)

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  app.stage.sortableChildren = true

  return app
}
