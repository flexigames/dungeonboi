import drawSprite from "../lib/sprite"
import { findEntities, destroyEntity } from "../lib/entities"
import Character from "./Character"
import V from "../lib/vec2"

export default class Enemy extends Character {
  constructor(x, y) {
    super(x, y, { speed: 20 })
    this.tags = ["enemy"]
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

  update(dt) {
    this.controlEnemy()
    this.handleMove(dt)
    this.checkPlayerHit()
  }

  controlEnemy() {
    const player = findEntities("player")[0]
    if (player && this.pos.distance(player.pos) < this.followDistance) {
      const direction = player.pos.subtract(this.pos)
      this.setDirection(direction.x, direction.y)
    } else {
      this.direction = V(0, 0)
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
