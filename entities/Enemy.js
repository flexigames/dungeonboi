import drawSprite from "../lib/sprite"
import { findEntities, destroyEntity, createEntity } from "../lib/entities"
import Character from "./Character"
import DeadEnemy from "./DeadEnemy"
import V from "../lib/vec2"

export default class Enemy extends Character {
  constructor(x, y) {
    super(x, y, { speed: 20, maxHealth: 2 })
    this.tags = ["enemy"]
    this.followDistance = 150
  }

  draw(ctx) {
    const x = Math.round(this.pos.x)
    const y = Math.round(this.pos.y)

    this.drawShadow(ctx, 6)
    this.drawNecromancer(ctx, x, y)
    this.drawHeart(ctx, x, y)
  }

  onDeath() {
    const dead = new DeadEnemy(this.pos.x, this.pos.y)
    createEntity(dead)
  }

  drawNecromancer(ctx, x, y) {
    ctx.save()
    if (this.isStunned()) {
      ctx.filter = "invert()"
    }
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
    ctx.restore()
  }

  drawHeart(ctx, x, y) {
    drawSprite(
      ctx,
      this.health > 0 ? "ui_heart_full" : "ui_heart_empty",
      x,
      y - 33
    )
    drawSprite(
      ctx,
      this.health > 1 ? "ui_heart_full" : "ui_heart_empty",
      x - 16,
      y - 33
    )
  }

  update(dt) {
    super.update(dt)

    this.controlEnemy()
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

    if (
      player &&
      this.pos.distance(player.pos) < HIT_RADIUS &&
      Date.now() > this.immuneUntil
    ) {
      player.takeHit(DAMAGE, this.pos)
    }
  }
}
