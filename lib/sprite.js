import tilesList from "../tiles_list_v1.3.txt"
import { Texture, Rectangle, Sprite, AnimatedSprite } from "pixi.js"
import state from "./state"
import { times, isArray } from "lodash"

const tileset = new Image(512, 512)
tileset.src = "assets/img/dungeon_tileset.png"

export function createTextures(tilesetTexture) {
  return Object.fromEntries(
    tilesList.split("\n").map((line) => {
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
  )
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
