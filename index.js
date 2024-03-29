import { createLevel, createWalkableLevelMap } from "./lib/level"
import Player from "./entities/Player"
import { initInput, controlPlayer } from "./lib/input"
import {
  createEntity,
  clearEntities,
  updateEntities,
  getSurvivingEntities,
} from "./lib/entities"
import * as PIXI from "pixi.js"
import { Viewport } from "pixi-viewport"
import { createTextures } from "./lib/sprite"
import state from "./lib/state"
import HUD from "./lib/hud"
import PauseMenu from './lib/pauseMenu'
import MainMenu from './lib/mainMenu'
import generateDungeon from "./lib/dungeon"
import { random, compact } from "lodash"
import crash from "./lib/crash"
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Press Start 2P']
  },
  active: startPIXI
})



crash.onCollision((a, b) => {
  a.data.entity.onCollision(b.data.entity)
  b.data.entity.onCollision(a.data.entity)
})

const VIEWPORT_DEBUG = false

let gameState = 'mainmenu'

function startPIXI() {
  const app = createApp()
  const viewport = createViewport()

  app.loader
    .add("tileset", "assets/img/dungeon_tileset.png")
    .add("ui", "assets/img/dungeon_ui.png")
    .add("dust", "assets/img/dust.png")
    .add("rose", "assets/img/rose.png")
    .add("spikes", "assets/img/spikes.png")
    .add("light", "assets/img/light.png")
    .add("heart_empty", "assets/img/heart_empty.png")
    .add("heart_full", "assets/img/heart_full.png")
    .load(setup)

    function setup(loader, resources) {
      const textures = createTextures(
        resources.tileset.texture,
        resources.ui.texture
      )
      textures.dust = resources.dust.texture
      textures.rose = resources.rose.texture
      textures.spikes = resources.spikes.texture
      textures.light = resources.light.texture
      textures['heart_empty'] = resources.heart_empty.texture
      textures['heart_full'] = resources.heart_full.texture
    
      state.textures = textures
      state.viewport = viewport
      state.app = app
      state.level = 0
    
      const player = createEntity(new Player(0, 0))
    
      state.player = player
      initInput(player, { onPause, onEnter })
    
      const pauseMenu = new PauseMenu()
      const mainMenu = new MainMenu()
      mainMenu.setVisible(true)
      mainMenu.onStart = startPlaying
      const hud = new HUD(player)
    
      function onPause() {
        gameState = gameState === 'paused' ? 'playing' : 'paused'
        pauseMenu.setVisible(gameState === 'paused')
      }
    
      function onEnter() {
        if (gameState === 'mainmenu') startPlaying()
      }
    
      function startPlaying() {
        gameState = 'playing'
        mainMenu.setVisible(false)
        hud.setVisible(true)
      }
    
      startLevel(player)
    
      app.ticker.add(createGameLoop(player, hud))
    }

    function createViewport() {
      const viewport = new Viewport({
        interaction: app.renderer.plugins.interaction,
      })
      viewport.scale.x = 2
      viewport.scale.y = 2
    
      if (VIEWPORT_DEBUG) viewport.drag().pinch()
    
      viewport.sortableChildren = true
      app.stage.addChild(viewport)
    
      viewport.offsetX = 0
      viewport.offsetY = 0
    
      return viewport
    }

    function updateViewport(player) {
      if (!VIEWPORT_DEBUG) {
        viewport.x = (-player.pos.x + 256 / 2) * 2 + viewport.offsetX
        viewport.y = (-player.pos.y + 256 / 2) * 2 + viewport.offsetY
      }
    }

    function createGameLoop(player, hud) {
      return function gameLoop(dt) {
        if (gameState === 'playing') {
          crash.check()
          controlPlayer(player)
          updateViewport(player)
          updateEntities(dt)
    
          randomizeViewportOffsetForScreenShake()
    
          if (player.health <= 0) {
            restart(player)
          }
          hud.update()
        }
      }
    }
}





export function goToNextLevel() {
  state.viewport.removeChildren()
  crash.clear()
  const survivingEntities = getSurvivingEntities()
  clearEntities(survivingEntities.filter((it) => it.tags.includes("relic")))
  survivingEntities.forEach((entity) => {
    if (!entity.tags.includes("relic")) {
      createEntity(entity)
      crash.insert(entity.collider.collider)
    }
  })
  state.level += 1
  startLevel(state.player)

  state.viewport.addChild(state.player.stepParticles.container)
  state.viewport.addChild(state.player.sprites.main)
  if (state.player.weapon)
    state.viewport.addChild(state.player.weapon.sprites.main)
}

function randomizeViewportOffsetForScreenShake() {
  if (state.viewport.shake) {
    state.viewport.offsetX = random(-8, 8)
    state.viewport.offsetY = random(-8, 8)
  } else {
    state.viewport.offsetX = 0
    state.viewport.offsetY = 0
  }
}

function restart(player) {
  state.level = 0
  clearEntities()
  player.reset()
  state.viewport.removeChildren()
  crash.clear()
  const entity = createEntity(player)
  crash.insert(entity.collider.collider)
  startLevel(player)

  state.viewport.addChild(player.stepParticles.container)
  state.viewport.addChild(player.sprites.main)
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
    backgroundColor: 0x150A21,
    antialias: false,
  })

  document.body.appendChild(app.view)

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  return app
}

export function shakeScreen(durationMS) {
  state.viewport.shake = true
  setTimeout(() => {
    state.viewport.shake = false
  }, durationMS)
}
