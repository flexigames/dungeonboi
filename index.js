import { createLevel, populateLevel } from "./lib/level"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities } from "./lib/entities"
import * as PIXI from "pixi.js"
import { Viewport } from "pixi-viewport"
import { createTextures } from "./lib/sprite"
import state from "./lib/state"

const app = createApp()
const viewport = createViewport()

app.loader.add("tileset", "assets/img/dungeon_tileset.png").load(setup)

function setup(loader, resources) {
  const textures = createTextures(resources.tileset.texture)

  state.textures = textures
  state.stage = viewport

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
    updateViewport(player)
    updateEntities(dt)
  }
}

function createApp() {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0x222222,
    antialias: false,
  })

  document.body.appendChild(app.view)

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  return app
}

function createViewport() {
  const viewport = new Viewport({
    interaction: app.renderer.plugins.interaction,
  })

  viewport.sortableChildren = true
  app.stage.addChild(viewport)

  return viewport
}

function updateViewport(player) {
  viewport.x = -player.pos.x + 256
  viewport.y = -player.pos.y + 256
}
