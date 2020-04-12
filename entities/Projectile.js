import Entity from "./Entity"
import V from "../lib/vec2"
import { findEntities } from "../lib/entities"
import state from "../lib/state"

export default class Projectile extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprites: "weapon_knife",
      ...opts,
    })
    const {
      direction = V(1, 0),
      damage = 1,
      targetTags = ["enemy"],
      hitRadius = 8,
      speed = 3,
    } = opts

    this.direction = direction
    this.speed = speed
    this.targetTags = targetTags
    this.damage = damage
    this.hitRadius = hitRadius
  }

  update(dt) {
    super.update(dt)

    this.handleMove(dt)
    this.checkCollision()

    if (this.pos.x < 0 || this.pos.x > 16 * 100) {
      this.destroy()
    }
  }

  handleMove(dt) {
    this.move(this.direction.multiply(this.speed * dt))
  }

  move(direction) {
    const newPos = this.pos.add(direction)
    const checkPosBack =
      direction.x === 0 ? newPos : newPos.add(V(direction.x < 0 ? 6 : -6, 0))
    const checkPosFront =
      direction.x === 0 ? newPos : newPos.add(V(direction.x < 0 ? -6 : 6, 0))

    if (isWalkable(checkPosFront) || isWalkable(checkPosBack)) {
      this.pos = newPos
    } else {
      this.destroy()
    }
  }

  checkCollision() {
    findEntities(this.targetTags).forEach((target) => {
      if (this && target && this.pos.distance(target.pos) < this.hitRadius) {
        target.takeHit(this.damage, this.pos)
        this.destroy()
      }
    })
  }
}

function isWalkable(pos) {
  const xTiles = state.walkableTiles[Math.floor(pos.y / 16)]
  if (!xTiles) return false
  return xTiles[Math.floor(pos.x / 16)]
}
