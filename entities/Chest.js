import Entity from "./Entity"
import { findEntities, createEntity } from "../lib/entities"
import Weapon from "./Weapon"
import SpeedPotion from "./relics/SpeedPotion"
import HeartPotion from "./relics/HeartPotion"
import { sample } from "lodash"

export default class Chest extends Entity {
  constructor(x, y) {
    super(x, y, { sprites: "chest_empty_open_anim" })
    this.sprites.main.anchor.set(0.5, 0.5)
    this.sprites.main.stop()
    this.sprites.main.loop = false
    this.pickupRadius = 16
    this.relicDropRate = 0.15
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
    const relicTypes = [SpeedPotion, HeartPotion]

    const unusedRelicTypes = relicTypes.filter(
      (relicType) => !relics.some((it) => it instanceof relicType)
    )

    const relicClass = sample(unusedRelicTypes)

    if (Math.random() < (relicClass ? 1 - this.relicDropRate : 1)) {
      return createEntity(Weapon.createRandom(x, y))
    } else {
      return createEntity(new relicClass(x, y))
    }
  }
}
