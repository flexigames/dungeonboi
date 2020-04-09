import V from "../lib/vec2"
import Entity from "./Entity"
import { Howl } from "howler"
import * as PIXI from "pixi.js"
import state from '../lib/state'

export default class Character extends Entity {
  constructor(x, y, opts = {}) {
    const {
      maxHealth = 1,
      flipped = false,
      speed = 2,
      immunityTime = 500,
      sprites,
    } = opts
    super(x, y, { sprites })
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.flipped = flipped
    this.speed = speed
    this.direction = V(0, 0)
    this.immuneUntil = Date.now()
    this.immunityTime = immunityTime
    this.velocity = V(0, 0)
    this.friction = 0.92
    this.knockBackSpeed = 4
  }

  update(dt) {
    super.update(dt)
    this.updateVelocity(dt)
    this.handleMove(dt)
    if (this.health <= 0 && !this.isStunned()) {
      this.onDeath()
      this.destroy()
    }

    Object.values(this.sprites).forEach(
      (sprite) => (sprite.scale.x = this.flipped ? -1 : 1)
    )
  }

  onDeath() {
    new Howl({ src: "assets/audio/death.wav" }).play()
  }

  updateVelocity(dt) {
    this.setPosition(this.pos.add(this.velocity.multiply(dt)))
    this.velocity = this.velocity.multiply(this.friction)
  }

  isMoving() {
    return !this.direction.equals(V(0, 0))
  }

  handleMove(dt) {
    this.setPosition(this.pos.add(this.direction.multiply(this.speed * dt)))
  }

  setPosition(newPos) {
    if (state.walkableTiles[Math.floor(newPos.y / 16)][Math.floor(newPos.x / 16)]) {
      this.pos = newPos
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
    Object.values(this.sprites).forEach(
      (sprite) => (sprite.filters = [negativeFilter])
    )
  }

  takeHit(damage = 1, attackerPos) {
    this.setSpriteStunned()

    if (Date.now() > this.immuneUntil) {
      new Howl({ src: "assets/audio/hit.wav", volume: 0.2 }).play()
      this.health = Math.max(0, this.health - damage)
      this.immuneUntil = Date.now() + this.immunityTime
      setTimeout(
        () =>
          Object.values(this.sprites).forEach(
            (sprite) => (sprite.filters = [])
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
