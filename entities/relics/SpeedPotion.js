import Relic from "./Relic"

export default class SpeedPotion extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "flask_big_green", ...opts })
  }

  onPickup() {
    super.onPickup()

    this.player.speed *= 1.5
  }

  onRemoval() {
    this.player.speed = this.player.baseSpeed
  }
}
