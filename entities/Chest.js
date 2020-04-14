import Entity from "./Entity"
import { findEntities, createEntity } from "../lib/entities"
import Weapon from "./Weapon"
import Potion from "./Potion"
import SpeedPotion from "./relics/SpeedPotion"
import HeartPotion from "./relics/HeartPotion"
import Thorns from "./relics/Thorns"
import Spikes from "./relics/Spikes"
import { sample } from "lodash"

export default class Chest extends Entity {
  constructor(x, y) {
    super(x, y, { sprites: "chest_empty_open_anim" })
    this.sprites.main.anchor.set(0.5, 0.5)
    this.sprites.main.stop()
    this.sprites.main.loop = false
    this.pickupRadius = 16
    this.relicDropRate = 0.2
    this.potionDropRate = 0.4
    this.weaponDropRate = 0.4
    this.open = false
  }

  update(dt) {
    super.update(dt)
    this.checkPlayerInteraction()
  }

  checkPlayerInteraction() {
    const player = findEntities("player")[0]

    if (
      !this.open &&
      player &&
      this.pos.distance(player.pos) < this.pickupRadius &&
      player.pickupIntent
    ) {
      this.sprites.main.play()
      this.sprites.main.onComplete = this.spawnItem.bind(this)
      this.open = true
    }
  }

  spawnItem() {
    const x = this.pos.x
    const y = this.pos.y + 16

    const relics = findEntities("relic")
    const relicTypes = [Spikes, SpeedPotion, HeartPotion, Thorns]

    const unusedRelicTypes = relicTypes.filter(
      (relicType) => !relics.some((it) => it instanceof relicType)
    )

    const relicClass = sample(unusedRelicTypes)

    const { create } = pickRandom([
      {
        rate: relicClass ? this.relicDropRate : 0,
        create: (x, y) => new relicClass(x, y),
      },
      {
        rate: this.weaponDropRate,
        create: (x, y) => Weapon.createRandom(x, y),
      },
      {
        rate: this.potionDropRate,
        create: (x, y) => new Potion(x, y),
      },
    ])

    if (create) createEntity(create(x, y))
  }
}

function pickRandom(array) {
  const rnd = Math.random()

  let baseRate = 0

  const totalRate = array.map((it) => it.rate).reduce((a, b) => a + b)

  for (let i = 0; i < array.length; i++) {
    if (rnd < (baseRate + array[i].rate) / totalRate) return array[i]
    baseRate += array[i].rate
  }
  return null
}
