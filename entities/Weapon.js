import Entity from "./Entity"
import { findEntities } from "../lib/entities"
import V from "../lib/vec2"
import { random, round, slice, sample } from "lodash"
import state from "../lib/state"
import { Polygon, Rectangle } from "yy-intersects"

const adjectives = [
  "Lousy",
  "Rusty",
  "Sticky",
  "Regular",
  "Shining",
  "Formidable",
  "Mighty",
  "Powerful",
]

const weaponTypes = [
  {
    name: "Sword",
    sprites: "weapon_regular_sword",
    attackRadius: 16,
    damageMultiplier: 1,
  },
  {
    name: "Big Hammer",
    sprites: "weapon_big_hammer",
    attackRadius: 32,
    damageMultiplier: 0.7,
  },
  {
    name: "Axe",
    sprites: "weapon_axe",
    attackRadius: 16,
    damageMultiplier: 1.5,
  },
  {
    name: "Knife",
    sprites: "weapon_knife",
    attackRadius: 12,
    damageMultiplier: 3,
  },
  {
    name: "Baton",
    sprites: "weapon_baton_with_spikes",
    attackRadius: 16,
    damageMultiplier: 1.3,
  },
]

export default class Weapon extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprites: "weapon_regular_sword",
      ...opts,
    })

    const {
      damage = 1,
      attackRadius = 17,
      sound = "assets/audio/sword.mp3",
      name = "Sword",
    } = opts

    this.name = name
    this.damage = damage
    this.sound = sound
    this.attackRadius = attackRadius
    this.isAttacking = false
    this.attackLeft = false
    this.pickupRadius = 10
    this.carried = false
  }

  static createRandom(x, y) {
    const level = state.level
    const adjective = sample(
      slice(
        adjectives,
        Math.min(level, adjectives.length - 1),
        Math.min(level + 1, adjectives.length)
      )
    )
    const weaponType = sample(weaponTypes)
    const damage = Math.max(
      1,
      round(random(3) + (level - 1) * weaponType.damageMultiplier)
    )

    return new Weapon(x, y, {
      ...weaponType,
      name: `${adjective} ${weaponType.name}`,
      damage,
    })
  }

  update(dt) {
    super.update(dt)

    this.sprites.main.scale.x = this.attackLeft ? -1 : 1

    if (!this.isAttacking) {
      this.sprites.main.angle = this.attackLeft ? 20 : -20
    }

    if (this.isAttacking) {
      this.sprites.main.angle += 20 * (this.attackLeft ? -1 : 1) * dt
    }

    if (
      this.attackLeft
        ? this.sprites.main.angle <= -200
        : this.sprites.main.angle >= 200
    ) {
      this.sprites.main.angle = -20
      this.isAttacking = false
    }

    if (!this.carried) this.checkPlayerCollision()
  }

  attack(targetTags) {
    this.isAttacking = true

    const targets = findEntities(targetTags)

    const targetsInRange = targets.filter((target) => {
      console.log(this.sprites.main, target.sprites.main)
      const weaponRectangle = new Rectangle(this.sprites.main)
      const targetRectangle = new Rectangle(target.sprites.main)

      console.log({ weaponRectangle, targetRectangle })
      return weaponRectangle.collidesRectangle(targetRectangle)
    })

    new Howl({ src: [this.sound] }).play()

    targetsInRange.forEach((enemy) => enemy.takeHit(this.damage, this.pos))
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
