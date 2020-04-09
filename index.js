import { createLevel, populateLevel, createWalkableLevelMap } from "./lib/level"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, updateEntities } from "./lib/entities"
import * as PIXI from "pixi.js"
import { Viewport } from "pixi-viewport"
import { createTextures } from "./lib/sprite"
import state from "./lib/state"
import HUD from "./lib/hud"
import generateDungeon from "./lib/dungeon"

const VIEWPORT_DEBUG = false

const app = createApp()
const viewport = createViewport()

app.loader
  .add("tileset", "assets/img/dungeon_tileset.png")
  .add("ui", "assets/img/dungeon_ui.png")
  .load(setup)

function setup(loader, resources) {
  const textures = createTextures(resources.tileset.texture)

  state.textures = textures
  state.viewport = viewport
  state.app = app

  const tiles = generateDungeon()

  state.tiles = tiles
  state.walkableTiles = createWalkableLevelMap(tiles, 100, 100)

  const player = createEntity(new Player(250, 240))
  initInput(player)

  createLevel(tiles, player)

  const hud = new HUD(player)

  app.ticker.add(createGameLoop(player, hud))
}

function createGameLoop(player, hud) {
  return function gameLoop(dt) {
    controlPlayer(player)
    updateViewport(player)
    updateEntities(dt)
    hud.update()
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

  if (VIEWPORT_DEBUG) viewport.drag().pinch()

  viewport.sortableChildren = true
  app.stage.addChild(viewport)

  return viewport
}

function updateViewport(player) {
  if (!VIEWPORT_DEBUG) {
    viewport.x = -player.pos.x + 256
    viewport.y = -player.pos.y + 256
  }
}
