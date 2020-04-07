import drawSprite from "../lib/sprite"
import { findEntities } from "../lib/entities"
import Entity from "./Entity"
import V from "../lib/vec2"

export default class Player extends Entity {
  constructor(x, y, speed = 100, flipped = true) {
    super(x, y)
    this.speed = speed
    this.direction = V(0, 0)
    this.flipped = flipped
    this.isAttacking = false
    this.maxHealth = 3
    this.health = this.maxHealth
    this.tags = ["player"]
    this.immuneUntil = Date.now()

    this.velocity = V(0, 0)
    this.friction = 0.92
    this.attackRadius = 15
    this.immunityTime = 500
  }

  drawDebugAttackRadius() {
    const attackPoint = this.getAttackPoint()
    ctx.beginPath()
    ctx.ellipse(
      attackPoint.x,
      attackPoint.y,
      this.attackRadius,
      this.attackRadius,
      0,
      0,
      2 * Math.PI
    )
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)"
    ctx.fill()
  }

  draw(ctx) {
    const x = Math.round(this.pos.x)
    const y = Math.round(this.pos.y)

    this.drawShadow(ctx, x, y)
    this.drawKnight(ctx, x, y)
    this.drawSword(ctx, x, y)
  }

  drawShadow(ctx, x, y) {
    ctx.beginPath()
    ctx.ellipse(x, y + 1, 5, 3, 0, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()
  }

  drawKnight(ctx, x, y) {
    ctx.save()
    if (Date.now() < this.immuneUntil) {
      ctx.filter = "invert()"
    }
    drawSprite(
      ctx,
      this.isMoving() ? "knight_m_run_anim" : "knight_m_idle_anim",
      x,
      y,
      {
        flipped: this.flipped,
        delay: this.isMoving() ? 100 : 200,
        anchor: [8, 27],
      }
    )
    ctx.restore()
  }

  drawSword(ctx, x, y) {
    ctx.save()
    if (Date.now() < this.immuneUntil) {
      ctx.filter = "invert()"
    }
    drawSprite(
      ctx,
      "weapon_regular_sword",
      x + (this.flipped ? 1 : -1) * 3,
      y - 7,
      {
        flipped: this.flipped,
        rotation: this.isAttacking ? 90 : 0,
        anchor: [5, 18],
      }
    )
    ctx.restore()
  }

  update(dt) {
    this.pos = this.pos.add(this.velocity.multiply(dt))

    if (
      Math.abs(Math.round(this.velocity.x * dt)) < 10 &&
      Math.abs(Math.round(this.velocity.y * dt)) < 10
    ) {
      this.handleMove(dt)
    }

    this.velocity = this.velocity.multiply(this.friction)
  }

  isMoving() {
    return !this.direction.equals(V(0, 0))
  }

  setDirection(horizontal, vertical) {
    if (horizontal === 1) this.flipped = false
    if (horizontal === -1) this.flipped = true
    this.direction =
      horizontal === 0 && vertical === 0
        ? V(0, 0)
        : V(horizontal, vertical).normalize()
  }

  handleMove(dt) {
    this.pos = this.pos.add(this.direction.multiply(this.speed * dt))
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)

    const enemies = findEntities("enemy")

    const attackPoint = this.getAttackPoint()

    const enemiesInRange = enemies.filter(
      (enemy) => attackPoint.distance(enemy.pos) < this.attackRadius
    )

    enemiesInRange.forEach((enemy) => enemy.takeHit())
  }

  getAttackPoint() {
    return this.pos.add(V(this.flipped ? -1 : 1, 0).multiply(8)).add(V(0, -7))
  }

  takeHit(damage, fromDirection) {
    if (Date.now() > this.immuneUntil) {
      this.health = Math.max(0, this.health - damage)
      this.immuneUntil = Date.now() + this.immunityTime
      this.velocity = fromDirection.multiply(-1).normalize().multiply(200)
    }
  }

  gainHealth(points = 1) {
    this.health = Math.min(this.health + points, this.maxHealth)
  }
}
