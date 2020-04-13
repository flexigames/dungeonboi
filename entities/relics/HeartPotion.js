import Relic from "./Relic"

export default class HeartPotion extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "ui_heart_full", ...opts })
  }

  onPickup() {
    super.onPickup()

    this.player.maxHealth += 1
    this.player.health += 1
  }

  onRemoval() {
    this.player.maxHealth = this.player.baseHealth
  }
}
