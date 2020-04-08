import Entity from "./Entity"
import { findEntities } from "../lib/entities"
import V from "../lib/vec2"

export default class Weapon extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, opts)

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

  update(dt) {
    super.update(dt)

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
