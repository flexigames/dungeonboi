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
    animateSprite(ctx, "wizzard_m_idle_anim", this.x, this.y, this.flipped)
  }

  update(dt) {
    const diagonalModifier =
      this.direction[0] !== 0 && this.direction[1] !== 0 ? 0.7 : 1
    this.x +=
      (this.flipped ? -1 : 1) *
      diagonalModifier *
      this.direction[0] *
      this.speed *
      dt
    this.y += diagonalModifier * this.direction[1] * this.speed * dt
  }

  flip() {
    this.flipped = !this.flipped
  }

  setDirection(horizontal, vertical) {
    this.direction = [horizontal, vertical]
  }
}
