import drawSprite from "../lib/sprite"
import { findEntities, destroyEntity } from "../lib/entities"
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
    const x = Math.round(this.pos.x)
    const y = Math.round(this.pos.y)

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
    destroyEntity(this)
  }

  update(dt) {
    this.moveTowardsPlayer(dt)
    this.checkPlayerHit()
  }

  moveTowardsPlayer(dt) {
    const player = findEntities("player")[0]
    if (player) {
      const direction = player.pos.subtract(this.pos)
      if (direction.x > 0) this.flipped = false
      if (direction.x < 0) this.flipped = true

      this.pos = this.pos.add(direction.normalize().multiply(this.speed * dt))
    }
  }

  checkPlayerHit() {
    const player = findEntities("player")[0]
    const HIT_RADIUS = 10
    const DAMAGE = 1

    if (player && this.pos.distance(player.pos) < HIT_RADIUS) {
      player.takeHit(DAMAGE, this.pos.subtract(player.pos).normalize())
    }
  }
}
