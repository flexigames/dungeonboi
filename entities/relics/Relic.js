import Entity from "../Entity"
import state from "../../lib/state"
import { findEntities } from "../../lib/entities"
import { random } from "lodash"

export default class Relic extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, opts)
    const { name = "Relic" } = opts
    this.player = findEntities("player")[0]
    this.name = name
    this.pickupRadius = 16
    this.pickedUp = false
    this.tags = ["relic"]
  }

  onPickup() {
    this.pickedUp = true
    this.pos.x = random(100, 200)
    this.pos.y = random(0, 100)
    state.viewport.removeChild(this.sprites.main)
  }

  onRemoval() {}

  update(dt) {
    super.update(dt)
    if (!this.pickedUp) this.checkPlayerPickup()
  }

  checkPlayerPickup() {
    if (
      this.player &&
      this.pos.distance(this.player.pos) < this.pickupRadius &&
      this.player.pickupIntent
    ) {
      this.onPickup()
    }
  }

  destroy() {
    this.onRemoval()
    super.destroy()
  }

  survivesBetweenLevels() {
    return this.pickedUp
  }
}
