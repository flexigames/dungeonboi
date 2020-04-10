import Entity from "./Entity"
import { findEntities } from "../lib/entities"
import V from "../lib/vec2"
import {sample} from 'lodash'

const weapons = [
  {sprites: 'weapon_regular_sword', attackRadius: 17, damage: 1},
  {sprites: 'weapon_big_hammer', attackRadius: 32, damage: 1},
  {sprites: 'weapon_axe', attackRadius: 17, damage: 2},
  {sprites: 'weapon_knife', attackRadius: 12, damage: 2},
  {sprites: 'weapon_baton_with_spikes', attackRadius: 17, damage: 2}
]

export default class Weapon extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprites: "weapon_regular_sword",
      ...opts
    })

    const {
      damage = 1,
      attackRadius = 17,
      sound = "assets/audio/sword.mp3",
    } = opts

    this.damage = damage
    this.sound = sound
    this.attackRadius = attackRadius
    this.isAttacking = false
    this.attackLeft = false
    this.pickupRadius = 10
    this.carried = false
  }

  static createRandom(x, y) {
    return new Weapon(x, y, sample(weapons))
  }

  update(dt) {
    super.update(dt)

    this.sprites.main.scale.x = this.attackLeft ? -1 : 1

    this.sprites.main.angle = this.isAttacking
      ? this.attackLeft
        ? -90
        : 90
      : 0

    if (!this.carried) this.checkPlayerCollision()
  }

  attack(targetTags) {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)

    const targets = findEntities(targetTags)

    const attackPoint = this.getAttackPoint()

    const targetsInRange = targets.filter(
      (target) => attackPoint.distance(target.pos) < this.attackRadius
    )

    new Howl({ src: [this.sound] }).play()

    targetsInRange.forEach((enemy) => enemy.takeHit(this.damage, this.pos))
  }

  getAttackPoint() {
    return this.pos
      .add(V(this.attackLeft ? -1 : 1, 0).multiply(8))
      .add(V(0, -7))
  }

  checkPlayerCollision() {
    const player = findEntities("player")[0]

    if (
      player &&
      this.pos.distance(player.pos) < this.pickupRadius &&
      player.pickupIntent
    ) {
      this.carried = true
      player.pickupIntent = false
      if (player.weapon) player.weapon.carried = false
      player.weapon = this
    }
  }
}
