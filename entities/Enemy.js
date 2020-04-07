import drawSprite from "../lib/sprite"
import { findEntities } from "../lib/entities"
import Entity from "./Entity"

export default class Enemy extends Entity {
  constructor(x, y, health = 1, flipped = true) {
    super(x, y)
    this.health = health
    this.maxHealth = health
    this.flipped = flipped
    this.speed = 20
    this.tags = ["enemy"]
  }

  draw(ctx) {
    const x = Math.round(this.x)
    const y = Math.round(this.y)

    ctx.beginPath()
    ctx.ellipse(x, y, 6, 3, 0, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()

    drawSprite(ctx, "necromancer_idle_anim", x, y, {
      flipped: this.flipped,
      anchor: [8, 20],
    })
    drawSprite(
      ctx,
      this.health === 1 ? "ui_heart_full" : "ui_heart_empty",
      x - 8,
      y - 33
    )
  }

  takeHit() {
    this.health = 0
  }

  update(dt) {
    this.moveTowardsPlayer(dt)
    this.checkPlayerHit()
  }

  moveTowardsPlayer(dt) {
    const player = findEntities("player")[0]
    if (player) {
      const horizontal = this.x > player.x ? -1 : this.x < player.x ? 1 : 0
      const vertical = this.y > player.y ? -1 : this.y < player.y ? 1 : 0

      if (horizontal === 1) this.flipped = false
      if (horizontal === -1) this.flipped = true

      const isMovingDiagonally = horizontal !== 0 && vertical !== 0
      const diagonalModifier = isMovingDiagonally ? 1 / Math.sqrt(2) : 1

      this.x = this.x + diagonalModifier * horizontal * this.speed * dt

      this.y = this.y + diagonalModifier * vertical * this.speed * dt
    }
  }

  checkPlayerHit() {
    const player = findEntities("player")[0]
    const HIT_RADIUS = 20
    const DAMAGE = 1

    if (
      player &&
      Math.abs(player.x - this.x) < HIT_RADIUS &&
      Math.abs(player.y - this.y) < HIT_RADIUS
    ) {
      player.takeHit(1)
    }
  }
}
