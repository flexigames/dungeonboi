import Character from "./Character"
import Weapon from "./Weapon"
import V from "../lib/vec2"
import { createEntity } from "../lib/entities"
import crash from '../lib/crash'
import { changeTexture } from '../lib/sprite'
import { TilingSprite } from "pixi.js"

export default class Player extends Character {
  constructor(x, y) {
    super(x, y, {
      maxHealth: 3,
      sprites: { main: "knight_m_idle_anim" },
    })
    this.tags = ["player"]
    this.pickupIntent = false
    this.xp = 0
    this.xpTarget = 0
    this.xpLimit = 100
    this.previousXpLimit = 0
    this.maxHealthLimit = 10
    const weapon = createEntity(Weapon.createRandom(this.pos.x, this.pos.y - 6))
    weapon.carried = true
    this.weapon = weapon
  }

  reset() {
    this.pickupIntent = false
    this.xp = 0
    this.xpTarget = 0
    this.xpLimit = 100
    this.previousXpLimit = 0
    this.maxHealth = 3
    this.health = 3
    this.velocity = V(0, 0)
    this.immuneUntil = Date.now()
    const weapon = createEntity(Weapon.createRandom(this.pos.x, this.pos.y - 6))
    weapon.carried = true
    this.weapon = weapon
  }

  update(dt) {
    super.update(dt)

    if (this.weapon) {
      this.weapon.pos.x = this.pos.x
      this.weapon.pos.y = this.pos.y - 6
      this.weapon.zIndex = this.pos.y + 1
      this.weapon.attackLeft = this.flipped
    }

    if (this.xp < this.xpTarget) {
      this.xp++
      if (this.xp >= this.xpLimit) {
        this.maxHealth = Math.min(this.maxHealthLimit, this.maxHealth + 1)
        this.health = this.maxHealth
        this.previousXpLimit = this.xpLimit
        this.xpLimit = this.xpLimit + this.xpLimit * 2
      }
    }
  }

  onStartMove() {
    changeTexture(this.sprites.main, 'knight_m_run_anim')
  }

  onEndMove() {
    changeTexture(this.sprites.main, 'knight_m_idle_anim')
  }

  setPickupIntent(intent) {
    this.pickupIntent = intent
  }

  attack() {
    if (this.weapon) this.weapon.attack("enemy")
  }

  increaseXP(amount) {
    this.xpTarget += amount
  }

  onCollision(entity) {
    // console.log(entity.tags, Date.now())
  }
}
