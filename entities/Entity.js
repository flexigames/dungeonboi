import V from "../lib/vec2"
import state from "../lib/state"
import { createSprite } from "../lib/sprite"
import { destroyEntity } from "../lib/entities"
import { isObject } from "lodash"
import { SpriteCollider } from "../lib/crash"

export default class Entity {
  constructor(x, y, opts = {}) {
    let { sprites } = opts
    this.pos = V(x, y)
    this.tags = []

    if (!isObject(sprites)) sprites = { main: sprites }

    this.sprites = {}

    this.render(sprites)

    this.collider = new SpriteCollider(this.sprites.main, { entity: this }) // TODO: Change entity to only have one sprite
  }

  render(sprites) {
    Object.entries(sprites || this.sprites).forEach(
      ([spriteId, spriteName]) => {
        const sprite = createSprite(spriteName, this.pos.x, this.pos.y, {
          anchor: [0.5, 1],
        })

        this.sprites[spriteId] = sprite
      }
    )
  }

  update(dt) {
    Object.values(this.sprites).forEach((sprite) => {
      sprite.x = this.pos.x
      sprite.y = this.pos.y
      sprite.zIndex = this.zIndex || this.pos.y
    })
    this.collider.update()
  }

  destroy() {
    destroyEntity(this)
    this.collider.destroy()
    Object.values(this.sprites).forEach((sprite) =>
      state.viewport.removeChild(sprite)
    )
  }

  onCollision() {}

  survivesBetweenLevels() {
    return false
  }
}
