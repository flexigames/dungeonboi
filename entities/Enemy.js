import { findEntities, createEntity } from "../lib/entities"
import Character from "./Character"
import Corpse from "./Corpse"
import V from "../lib/vec2"
import { slice, sample } from "lodash"
import Potion from "./Potion"
import state from "../lib/state"

const enemyTypes = [
  {
    sprites: "necromancer_idle_anim",
    baseHealthModifier: 2,
    speedModifier: 0.4,
    attackRadius: 10,
    damageModifier: 1,
  },
  {
    sprites: "goblin_idle_anim",
    baseHealthModifier: 1,
    speedModifier: 0.6,
    attackRadius: 6,
    damageModifier: 1,
  },
  {
    sprites: "imp_idle_anim",
    baseHealthModifier: 2,
    speedModifier: 0.7,
    attackRadius: 10,
    damageModifier: 1.2,
  },
  {
    sprites: "muddy_idle_anim",
    baseHealthModifier: 6,
    speedModifier: 0.2,
    attackRadius: 10,
    damageModifier: 1.2,
  },
  {
    sprites: "orc_warrior_idle_anim",
    baseHealthModifier: 6,
    speedModifier: 0.2,
    attackRadius: 10,
    damageModifier: 2,
  },
  {
    sprites: "big_demon_idle_anim",
    baseHealthModifier: 10,
    speedModifier: 0.3,
    attackRadius: 16,
    damageModifier: 2,
  },
]

export default class Enemy extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      speed: 0.5,
      baseHealth: 2,
      sprites: "necromancer_idle_anim",
      ...opts,
    })
    const { attackRadius = 10, damage = 1 } = opts
    this.tags = ["enemy"]
    this.followDistance = 150
    this.xpGain = 10
    this.attackRadius = attackRadius
    this.potionDropRate = 0.2
    this.damage = 1
  }

  static createRandom(x, y) {
    const enemyType = sample(
      slice(enemyTypes, 0, Math.min(state.level + 1, enemyTypes.length))
    )

    return new Enemy(x, y, {
      ...enemyType,
      baseHealth: (1 + 0.2 * state.level) * enemyType.baseHealthModifier,
      speed: (1 + 0.2 * state.level) * enemyType.speedModifier,
      damage: Math.floor((1 + 0.05 * state.level) * enemyType.damageModifier),
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

    if (
      player &&
      this.pos.distance(player.pos) < this.attackRadius &&
      Date.now() > this.immuneUntil
    ) {
      player.takeHit(this.damage, this.pos)
    }
  }
}
