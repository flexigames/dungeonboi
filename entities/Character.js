import V from "../lib/vec2"
import Entity from "./Entity"
import { Howl } from "howler"
import * as PIXI from "pixi.js"
import state from "../lib/state"
import { shakeScreen } from "../index"
import Particles from "../lib/particles"

export default class Character extends Entity {
  constructor(x, y, opts = {}) {
    const {
      flipped = false,
      speed = 2,
      baseSpeed = 2,
      baseHealth = 1,
      immunityTime = 500,
      sprites,
    } = opts
    super(x, y, { sprites })
    this.baseHealth = baseHealth
    this.maxHealth = baseHealth
    this.health = baseHealth
    this.flipped = flipped
    this.speed = speed
    this.baseSpeed = baseSpeed
    this.direction = V(0, 0)
    this.immuneUntil = Date.now()
    this.immunityTime = immunityTime
    this.velocity = V(0, 0)
    this.friction = 0.92
    this.knockBackSpeed = 4
    this.moving = false

    this.bloodParticles = new Particles("blood", { zIndex: this.pos.y - 1 })
  }

  update(dt) {
    super.update(dt)
    this.updateVelocity(dt)
    this.handleMove(dt)
    this.bloodParticles.move(this.pos)
    this.bloodParticles.update(dt, this.pos.y - 1)
    if (this.health <= 0 && !this.isStunned()) {
      this.onDeath()
      this.destroy()
    }

    Object.values(this.sprites).forEach(
      (sprite) => (sprite.scale.x = this.flipped ? -1 : 1)
    )

    const lastMoving = this.moving
    this.moving = this.isMoving()
    if (this.moving !== lastMoving) {
      if (this.moving) {
        this.onStartMove()
      } else {
        this.onEndMove()
      }
    }
  }

  onStartMove() {}
  onEndMove() {}

  onDeath() {
    new Howl({ src: "assets/audio/death.wav" }).play()
  }

  updateVelocity(dt) {
    this.move(this.velocity.multiply(dt))
    this.velocity = this.velocity.multiply(this.friction)
  }

  isMoving() {
    return !this.direction.equals(V(0, 0))
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
    } else if (isWalkable(V(newPos.x, this.pos.y))) {
      this.pos.x = newPos.x
    } else if (
      isWalkable(V(this.pos.x - 6, newPos.y)) ||
      isWalkable(V(this.pos.x + 6, newPos.y))
    ) {
      this.pos.y = newPos.y
    }
  }

  setDirection(horizontal, vertical) {
    if (horizontal > 0) this.flipped = false
    if (horizontal < 0) this.flipped = true
    this.direction =
      horizontal === 0 && vertical === 0
        ? V(0, 0)
        : V(horizontal, vertical).normalize()
  }

  setSpriteStunned() {
    const negativeFilter = new PIXI.filters.ColorMatrixFilter()
    negativeFilter.negative()
    Object.values(this.sprites).forEach((sprite) => (sprite.tint = 0xfb1010))
  }

  takeHit(damage = 1, attackerPos) {
    this.setSpriteStunned()

    if (Date.now() > this.immuneUntil) {
      shakeScreen(100)
      this.bloodParticles.spawn(this.pos)
      new Howl({ src: "assets/audio/hit.wav", volume: 0.2 }).play()
      this.health = Math.max(0, this.health - damage)
      this.immuneUntil = Date.now() + this.immunityTime
      setTimeout(
        () =>
          Object.values(this.sprites).forEach(
            (sprite) => (sprite.tint = 0xffffff)
          ),
        this.immunityTime
      )
      const fromDirection = attackerPos.subtract(this.pos).normalize()
      this.velocity = fromDirection
        .multiply(-1)
        .normalize()
        .multiply(this.knockBackSpeed)
    }
  }

  gainHealth(points = 1) {
    this.health = Math.min(this.health + points, this.maxHealth)
  }

  isStunned() {
    return Date.now() < this.immuneUntil
  }
}

function isWalkable(pos) {
  const xTiles = state.walkableTiles[Math.floor(pos.y / 16)]
  if (!xTiles) return false
  return xTiles[Math.floor(pos.x / 16)]
}
