import drawSprite from "../lib/sprite"
import { findEntities, destroyEntity } from "../lib/entities"
import Entity from "./Entity"
import V from "../lib/vec2"

export default class Enemy extends Entity {
  constructor(x, y, health = 1, flipped = true) {
    super(x, y)
    this.health = health
    this.maxHealth = health
    this.flipped = flipped
    this.speed = 20
    this.tags = ["enemy"]
    this.direction = V(0, 0)
    this.followDistance = 150
  }

  draw(ctx) {
    const x = Math.round(this.pos.x)
    const y = Math.round(this.pos.y)

    ctx.beginPath()
    ctx.ellipse(x, y, 6, 3, 0, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()

    drawSprite(
      ctx,
      this.isMoving() ? "necromancer_run_anim" : "necromancer_idle_anim",
      x,
      y,
      {
        flipped: this.flipped,
        anchor: [8, 20],
        delay: this.isMoving() ? 100 : 200,
      }
    )
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
    this.controlEnemy()
    this.handleMove(dt)
    this.checkPlayerHit()
  }

  controlEnemy() {
    const player = findEntities("player")[0]
    if (player && this.pos.distance(player.pos) < this.followDistance) {
      this.direction = player.pos.subtract(this.pos)
      if (this.direction.x > 0) this.flipped = false
      if (this.direction.x < 0) this.flipped = true
    } else {
      this.direction = V(0, 0)
    }
  }

  handleMove(dt) {
    this.pos = this.pos.add(
      this.direction.normalize().multiply(this.speed * dt)
    )
  }

  isMoving() {
    return !this.direction.equals(V(0, 0))
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
