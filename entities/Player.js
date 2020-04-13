import Character from "./Character"
import Weapon from "./Weapon"
import V from "../lib/vec2"
import { createEntity } from "../lib/entities"
import crash from "../lib/crash"
import { changeTexture } from "../lib/sprite"
import { ParticleContainer, Texture, TilingSprite } from "pixi.js"
import dustEmitterConfig from "../dust-emitter.json"
import state from "../lib/state"
import { Emitter } from "pixi-particles"

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

    this.createParticles()
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

  createParticles() {
    const particleContainer = new ParticleContainer()
    particleContainer.zIndex = this.pos.y - 1
    particleContainer.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    })
    state.viewport.addChild(particleContainer)
    this.particleContainer = particleContainer

    const emitter = new Emitter(
      particleContainer,
      state.textures.dust,
      dustEmitterConfig
    )
    this.particleEmitter = emitter
  }

  updateParticles(dt) {
    this.particleEmitter.update((dt * 16) / 1000)
    this.particleContainer.zIndex = this.pos.y - 1
  }

  spawnParticles() {
    this.particleEmitter.emit = true
    this.particleEmitter.resetPositionTracking()
    this.particleEmitter.updateOwnerPos(this.pos.x, this.pos.y)
  }

  update(dt) {
    super.update(dt)

    this.updateParticles(dt)

    if (this.moving && Math.random() > 0.95) this.spawnParticles()

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
    changeTexture(this.sprites.main, "knight_m_run_anim")
    this.spawnParticles()
  }

  onEndMove() {
    changeTexture(this.sprites.main, "knight_m_idle_anim")
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
}
