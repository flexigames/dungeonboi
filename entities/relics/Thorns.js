import Relic from "./Relic"

export default class Thorns extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "ui_heart_empty", ...opts })
  }

  onPlayerHit(damage, attackPos, attacker) {
    attacker.tryHit(damage, attackPos, this.player)
  }

  onRemoval() {}
}
