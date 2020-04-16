import tilesList from "../tiles_list_v1.3.txt"
import { Texture, Rectangle, Sprite, AnimatedSprite } from "pixi.js"
import state from "./state"
import { times, isArray } from "lodash"
import crash from './crash'

const tileset = new Image(512, 512)
tileset.src = "assets/img/dungeon_tileset.png"

export function createTextures(tilesetTexture, uiTexture) {
  return Object.fromEntries(createTileSetTextures(tilesetTexture)
    .concat(createUiTextures(uiTexture))
  )
}

function createUiTextures(uiTexture) {
  const entries = [
    { x: 25, y: 121, width: 7, height: 7, name: 'progressbar_left' },
    { x: 32, y: 121, width: 7, height: 7, name: 'progressbar_middle' },
    { x: 39, y: 121, width: 7, height: 7, name: 'progressbar_right' },
    { x: 25, y: 73, width: 8, height: 8, name: 'border_top_left' },
    { x: 39, y: 73, width: 8, height: 8, name: 'border_top_right' },
    { x: 25, y: 87, width: 8, height: 8, name: 'border_bottom_left' },
    { x: 39, y: 87, width: 8, height: 8, name: 'border_bottom_right' },
    { x: 25, y: 81, width: 8, height: 6, name: 'border_left' },
    { x: 39, y: 81, width: 8, height: 6, name: 'border_right' },
    { x: 33, y: 73, width: 6, height: 8, name: 'border_top' },
    { x: 33, y: 87, width: 6, height: 8, name: 'border_bottom' },
  ]
  return entries.map(({ x, y, width, height, name }) => [name, new Texture(uiTexture, new Rectangle(x, y, width, height))])
}

function createTileSetTextures(tilesetTexture) {
  return tilesList.split("\n").map((line) => {
    const [name, sx, sy, swidth, sheight, frames] = line.split(" ")
    if (frames) {
      return [
        name,
        times(parseInt(frames)).map(
          (frame) =>
            new Texture(
              tilesetTexture,
              new Rectangle(
                parseInt(sx) + frame * parseInt(swidth),
                parseInt(sy),
                parseInt(swidth),
                parseInt(sheight)
              )
            )
        ),
      ]
    }
    return [
      name,
      new Texture(
        tilesetTexture,
        new Rectangle(
          parseInt(sx),
          parseInt(sy),
          parseInt(swidth),
          parseInt(sheight)
        )
      ),
    ]
  })
}

export function createSprite(name, x, y, opts = {}) {
  const { anchor, stage, zIndex } = opts
  const texture = state.textures[name]

  let sprite
  if (isArray(texture)) {
    sprite = new AnimatedSprite(texture)
    sprite.play()
    sprite.animationSpeed = 0.1
  } else {
    sprite = new Sprite(texture)
  }

  if (anchor) sprite.anchor.set(anchor[0], anchor[1])
  if (zIndex) sprite.zIndex = zIndex

  sprite.x = x
  sprite.y = y

  const container = stage || state.viewport
  container.addChild(sprite)

  return sprite
}

export function changeTexture(sprite, name) {
  const texture = state.textures[name]
  if (isArray(texture)) {
    sprite.textures = texture
    sprite.play()
  } else {
    sprite.texture = texture
  }
}
