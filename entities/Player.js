import { createEntity } from "../lib/entities"
import Character from "./Character"
import Weapon from "./Weapon"

export default class Player extends Character {
  constructor(x, y) {
    super(x, y, {
      maxHealth: 3,
      sprites: { idle: "knight_m_idle_anim", run: "knight_m_run_anim" },
    })
    this.tags = ["player"]
    this.pickupIntent = false
    this.xp = 0
  }

  update(dt) {
    super.update(dt)

    this.sprites.run.visible = this.isMoving()
    this.sprites.idle.visible = !this.isMoving()

    if (this.weapon) {
      this.weapon.pos.x = this.pos.x
      this.weapon.pos.y = this.pos.y - 6
      this.weapon.zIndex = this.pos.y + 1
      this.weapon.attackLeft = this.flipped
    }
  }

  setPickupIntent(intent) {
    this.pickupIntent = intent
  }

  attack() {
    if (this.weapon) this.weapon.attack("enemy")
  }

  increaseXP(amount) {
    this.xp += amount
  }
}
