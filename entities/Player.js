import { animateSprite } from "../lib/sprite"

export default class Player {
  constructor(x, y, speed = 100, flipped = true) {
    this.x = x
    this.y = y
    this.speed = speed
    this.direction = [0, 0]
    this.flipped = flipped
  }

  draw(ctx) {
    animateSprite(
      ctx,
      this.isMoving() ? "wizzard_m_idle_anim" : "wizzard_m_run_anim",
      Math.round(this.x),
      Math.round(this.y),
      this.flipped,
      this.isMoving() ? 100 : 200
    )
  }

  update(dt) {
    const isMovingDiagonally =
      this.direction[0] !== 0 && this.direction[1] !== 0
    const diagonalModifier = isMovingDiagonally ? 1 / Math.sqrt(2) : 1

    this.x = this.x + diagonalModifier * this.direction[0] * this.speed * dt

    this.y = this.y + diagonalModifier * this.direction[1] * this.speed * dt
  }

  isMoving() {
    return this.direction[0] !== 0 || this.direction[1] !== 0
  }

  setDirection(horizontal, vertical) {
    if (horizontal === 1) this.flipped = false
    if (horizontal === -1) this.flipped = true
    this.direction = [horizontal, vertical]
  }
}
