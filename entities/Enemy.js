import { findEntities, createEntity } from "../lib/entities"
import Character from "./Character"
import Corpse from "./Corpse"
import V from "../lib/vec2"

export default class Enemy extends Character {
  constructor(x, y) {
    super(x, y, {
      speed: 0.5,
      maxHealth: 2,
      sprites: "necromancer_idle_anim",
    })
    this.tags = ["enemy"]
    this.followDistance = 150
    this.xpGain = 10
  }

  onDeath() {
    super.onDeath()
    const player = findEntities("player")[0]
    player.increaseXP(this.xpGain)
    createEntity(new Corpse(this.pos.x, this.pos.y))
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
