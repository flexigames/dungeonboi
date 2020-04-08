import { findEntities } from "../lib/entities"
import Character from "./Character"
import V from "../lib/vec2"
import { Howl } from "howler"

export default class Player extends Character {
  constructor(x, y) {
    super(x, y, {
      maxHealth: 3,
      sprites: { idle: "knight_m_idle_anim", run: "knight_m_run_anim" },
    })
    this.tags = ["player"]
    this.isAttacking = false
    this.attackRadius = 17
    this.debug = false
  }

  update(dt) {
    super.update(dt)

    this.sprites.run.visible = this.isMoving()
    this.sprites.idle.visible = !this.isMoving()
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
