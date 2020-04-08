import drawSprite from "../lib/sprite"
import { findEntities } from "../lib/entities"
import Character from "./Character"
import V from "../lib/vec2"
import { Howl } from "howler"

export default class Player extends Character {
  constructor(x, y) {
    super(x, y, { maxHealth: 3 })
    this.tags = ["player"]
    this.isAttacking = false
    this.attackRadius = 15
  }

  draw(ctx) {
    const x = Math.round(this.pos.x)
    const y = Math.round(this.pos.y)

    this.drawShadow(ctx, 5)
    this.drawKnight(ctx, x, y)
    this.drawSword(ctx, x, y)
  }

  drawKnight(ctx, x, y) {
    ctx.save()
    if (this.isStunned()) {
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

  update(dt) {
    this.updateVelocity(dt)

    if (
      Math.abs(Math.round(this.velocity.x * dt)) < 10 &&
      Math.abs(Math.round(this.velocity.y * dt)) < 10
    ) {
      this.handleMove(dt)
    }
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

    new Howl({
      src: "assets/audio/sword.mp3",
    }).play()

    enemiesInRange.forEach((enemy) => enemy.takeHit(1, this.pos))
  }

  getAttackPoint() {
    return this.pos.add(V(this.flipped ? -1 : 1, 0).multiply(8)).add(V(0, -7))
  }
}
