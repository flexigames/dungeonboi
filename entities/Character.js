import V from "../lib/vec2"
import { destroyEntity } from "../lib/entities"
import Entity from "./Entity"

export default class Character extends Entity {
  constructor(x, y, opts = {}) {
    const {
      maxHealth = 1,
      flipped = false,
      speed = 100,
      immunityTime = 500,
    } = opts
    super(x, y)
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.flipped = flipped
    this.speed = speed
    this.direction = V(0, 0)
    this.immuneUntil = Date.now()
    this.immunityTime = immunityTime
    this.velocity = V(0, 0)
    this.friction = 0.92
  }

  update(dt) {
    this.updateVelocity(dt)
    this.handleMove(dt)
  }

  updateVelocity(dt) {
    this.pos = this.pos.add(this.velocity.multiply(dt))
    this.velocity = this.velocity.multiply(this.friction)
  }

  isMoving() {
    return !this.direction.equals(V(0, 0))
  }

  handleMove(dt) {
    this.pos = this.pos.add(this.direction.multiply(this.speed * dt))
  }

  setDirection(horizontal, vertical) {
    if (horizontal === 1) this.flipped = false
    if (horizontal === -1) this.flipped = true
    this.direction =
      horizontal === 0 && vertical === 0
        ? V(0, 0)
        : V(horizontal, vertical).normalize()
  }

  takeHit(damage = 1, attackerPos) {
    if (Date.now() > this.immuneUntil && this.health - damage > 0) {
      this.health = Math.max(0, this.health - damage)
      this.immuneUntil = Date.now() + this.immunityTime
      const fromDirection = attackerPos.subtract(this.pos).normalize()
      this.velocity = fromDirection.multiply(-1).normalize().multiply(200)
      console.log(this.velocity)
    } else {
      destroyEntity(this)
    }
  }

  gainHealth(points = 1) {
    this.health = Math.min(this.health + points, this.maxHealth)
  }
}
