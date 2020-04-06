import drawSprite from "../lib/sprite"

export default class Enemy {
  constructor(x, y, health = 1, flipped = true) {
    this.x = x
    this.y = y
    this.health = health
    this.flipped = flipped
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

  takeHit() {}

  update(dt) {}
}
