import drawSprite from "../lib/sprite"
import { findEntitiesWithTag } from "../index"

export default class Player {
  constructor(x, y, speed = 100, flipped = true) {
    this.x = x
    this.y = y
    this.speed = speed
    this.direction = [0, 0]
    this.flipped = flipped
    this.isAttacking = false
    this.tags = ["player"]
  }

  draw(ctx) {
    drawSprite(
      ctx,
      this.isMoving() ? "knight_m_run_anim" : "knight_m_idle_anim",
      Math.round(this.x),
      Math.round(this.y),
      {
        flipped: this.flipped,
        delay: this.isMoving() ? 100 : 200,
      }
    )
    drawSprite(
      ctx,
      "weapon_regular_sword",
      Math.round(this.x + 2),
      Math.round(this.y + 20),
      {
        flipped: this.flipped,
        rotation: this.isAttacking ? 90 : 0,
        anchor: [5, 18],
      }
    )
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
    setInterval(() => {
      this.isAttacking = false
    }, 300)

    const enemies = findEntitiesWithTag("enemy")

    const enemiesInRange = enemies.filter((enemy) => {
      return Math.abs(this.x - enemy.x) < 20 && Math.abs(this.y - enemy.y)
    })

    enemiesInRange.forEach((enemy) => enemy.takeHit())
  }
}
