import Relic from "./Relic"

export default class Thorns extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "rose", ...opts })
  }

  onPlayerHit(damage, attackPos, attacker) {
    attacker.tryHit(damage, attackPos, this.player)
  }

  onRemoval() {}
}
