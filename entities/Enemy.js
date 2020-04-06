import drawSprite from "../lib/sprite"
import { findEntitiesWithTag } from "../lib/entities"

export default class Enemy {
  constructor(x, y, health = 1, flipped = true) {
    this.x = x
    this.y = y
    this.health = health
    this.flipped = flipped
    this.speed = 20
    this.tags = ["enemy"]
  }

  draw(ctx) {
    drawSprite(
      ctx,
      "necromancer_idle_anim",
      Math.round(this.x),
      Math.round(this.y),
      {
        flipped: this.flipped,
      }
    )
    drawSprite(
      ctx,
      this.health === 1 ? "ui_heart_full" : "ui_heart_empty",
      Math.round(this.x),
      Math.round(this.y - 12)
    )
  }

  takeHit() {
    this.health = 0
  }

  update(dt) {
    const player = findEntitiesWithTag("player")[0]
    if (player) {
      const horizontal = this.x > player.x ? -1 : this.x < player.x ? 1 : 0
      const vertical = this.y > player.x ? -1 : this.y < player.y ? 1 : 0

      const isMovingDiagonally = horizontal !== 0 && vertical !== 0
      const diagonalModifier = isMovingDiagonally ? 1 / Math.sqrt(2) : 1

      this.x = this.x + diagonalModifier * horizontal * this.speed * dt

      this.y = this.y + diagonalModifier * vertical * this.speed * dt
    }
  }
}
