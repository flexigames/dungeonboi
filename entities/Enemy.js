import { findEntities, createEntity } from "../lib/entities"
import Character from "./Character"
import Corpse from "./Corpse"
import V from "../lib/vec2"
import {sample} from 'lodash'

const enemies = [
  {sprites: "necromancer_idle_anim", maxHealth: 2, speed: 0.5, attackRadius: 10},
  {sprites: "big_demon_idle_anim", maxHealth: 5, speed: 0.25, attackRadius: 16}
]

export default class Enemy extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      speed: 0.5,
      maxHealth: 2,
      sprites: "necromancer_idle_anim",
      ...opts
    })
    const {attackRadius =  10} = opts
    this.tags = ["enemy"]
    this.followDistance = 150
    this.xpGain = 10
    this.attackRadius = attackRadius
  }

  static createRandom(x, y) {
    return new Enemy(x, y, sample(enemies))
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
    const DAMAGE = 1

    if (
      player &&
      this.pos.distance(player.pos) < this.attackRadius &&
      Date.now() > this.immuneUntil
    ) {
      player.takeHit(DAMAGE, this.pos)
    }
  }
}
