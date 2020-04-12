import { createLevel, createWalkableLevelMap } from "./lib/level"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import { createEntity, clearEntities, updateEntities } from "./lib/entities"
import * as PIXI from "pixi.js"
import { Viewport } from "pixi-viewport"
import { createTextures } from "./lib/sprite"
import state from "./lib/state"
import HUD from "./lib/hud"
import generateDungeon from "./lib/dungeon"
import { compact } from "lodash"
import Phaser from "phaser"

const VIEWPORT_DEBUG = false

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [HelloWorldScene],
}

const game = new Phaser.Game(config)

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
  state.level = 0

  const player = createEntity(new Player(0, 0))
  state.player = player
  initInput(player)

  startLevel(player)

  const hud = new HUD(player)

  app.ticker.add(createGameLoop(player, hud))
}

function createGameLoop(player, hud) {
  return function gameLoop(dt) {
    controlPlayer(player)
    updateViewport(player)
    updateEntities(dt)
    if (player.health <= 0) {
      state.level = 0
      player.reset()
      restart(player)
    }
    hud.update()
  }
}

export function goToNextLevel() {
  state.level += 1
  restart(state.player)
}

function restart(player) {
  state.viewport.removeChildren()
  const survivingEntities = compact([player, player.weapon])
  clearEntities()
  survivingEntities.forEach(createEntity)
  startLevel(player)

  state.viewport.addChild(player.sprites.run)
  state.viewport.addChild(player.sprites.idle)
  if (player.weapon) state.viewport.addChild(player.weapon.sprites.main)
}

function startLevel(player) {
  const tiles = generateDungeon()

  state.tiles = tiles
  state.walkableTiles = createWalkableLevelMap(tiles, 100, 100)

  createLevel(tiles, player)
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
  viewport.scale.x = 2
  viewport.scale.y = 2

  console.log(viewport)
  if (VIEWPORT_DEBUG) viewport.drag().pinch()

  viewport.sortableChildren = true
  app.stage.addChild(viewport)

  return viewport
}

function updateViewport(player) {
  if (!VIEWPORT_DEBUG) {
    viewport.x = (-player.pos.x + 256 / 2) * 2
    viewport.y = (-player.pos.y + 256 / 2) * 2
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene")
  }

  preload() {
    this.load.image("tileset", "assets/img/dungeon_tileset.png")
    this.load.image("ui", "assets/img/dungeon_ui.png")
  }

  create() {}
}
