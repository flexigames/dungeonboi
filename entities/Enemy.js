import { findEntities, createEntity } from "../lib/entities"
import Character from "./Character"
import Corpse from "./Corpse"
import V from "../lib/vec2"
import { sample } from "lodash"
import Potion from "./Potion"
import state from "../lib/state"

const enemyTypes = [
  {
    sprites: "necromancer_idle_anim",
    maxHealthModifier: 2,
    speedModifier: 0.5,
    attackRadius: 10,
  },
  {
    sprites: "big_demon_idle_anim",
    maxHealthModifier: 5,
    speedModifier: 0.25,
    attackRadius: 16,
  },
]

export default class Enemy extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      speed: 0.5,
      maxHealth: 2,
      sprites: "necromancer_idle_anim",
      ...opts,
    })
    const { attackRadius = 10 } = opts
    this.tags = ["enemy"]
    this.followDistance = 150
    this.xpGain = 10
    this.attackRadius = attackRadius
    this.potionDropRate = 0.2
  }

  static createRandom(x, y) {
    const enemyType = sample(enemyTypes)

    return new Enemy(x, y, {
      ...enemyType,
      maxHealth: (1 + 0.2 * state.level) * enemyType.maxHealthModifier,
      speed: (1 + 0.2 * state.level) * enemyType.speedModifier,
    })
  }

  onDeath() {
    super.onDeath()
    const player = findEntities("player")[0]
    if (Math.random() < this.potionDropRate) {
      createEntity(new Potion(this.pos.x, this.pos.y))
    }
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
