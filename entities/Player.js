import drawSprite from "../lib/sprite"
import { findEntities } from "../lib/entities"
import Entity from "./Entity"

export default class Player extends Entity {
  constructor(x, y, speed = 100, flipped = true) {
    super(x, y)
    this.speed = speed
    this.direction = [0, 0]
    this.flipped = flipped
    this.isAttacking = false
    this.maxHealth = 3
    this.health = this.maxHealth
    this.tags = ["player"]
    this.immuneUntil = Date.now()
  }

  draw(ctx) {
    const x = Math.round(this.x)
    const y = Math.round(this.y)

    ctx.beginPath()
    ctx.ellipse(x, y + 1, 5, 3, 0, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()

    drawSprite(
      ctx,
      this.isMoving() ? "knight_m_run_anim" : "knight_m_idle_anim",
      x,
      y,
      {
        flipped: this.flipped,
        delay: this.isMoving() ? 100 : 200,
        anchor: [8, 27],
      }
    )
    drawSprite(ctx, "weapon_regular_sword", x - 6, y - 7, {
      flipped: this.flipped,
      rotation: this.isAttacking ? 90 : 0,
      anchor: [5, 18],
    })
  }

  update(dt) {
    this.handleMove(dt)
  }

  isMoving() {
    return this.direction[0] !== 0 || this.direction[1] !== 0
  }

  setDirection(horizontal, vertical) {
    if (horizontal === 1) this.flipped = false
    if (horizontal === -1) this.flipped = true
    this.direction = [horizontal, vertical]
  }

  handleMove(dt) {
    const isMovingDiagonally =
      this.direction[0] !== 0 && this.direction[1] !== 0
    const diagonalModifier = isMovingDiagonally ? 1 / Math.sqrt(2) : 1

    this.x = this.x + diagonalModifier * this.direction[0] * this.speed * dt

    this.y = this.y + diagonalModifier * this.direction[1] * this.speed * dt
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)

    const enemies = findEntities("enemy")

    const enemiesInRange = enemies.filter((enemy) => {
      return Math.abs(this.x - enemy.x) < 20 && Math.abs(this.y - enemy.y)
    })

    enemiesInRange.forEach((enemy) => enemy.takeHit())
  }

  takeHit(damage) {
    if (Date.now() > this.immuneUntil) {
      this.health -= damage
      this.immuneUntil = Date.now() + 1000
    }
  }
}
