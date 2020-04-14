import Relic from "./Relic"
import { findEntities } from "../../lib/entities"

export default class Compass extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "flask_big_green", ...opts })
    const { angle = 0 } = opts

    this.angle = angle
  }

  update(dt) {
    const ladder = findEntities("ladder")[0]

    super.update(dt)

    this.angle =
      (Math.atan2(ladder.pos.y - this.pos.y, ladder.pos.x - this.pos.x) * 180) /
      Math.PI
    this.sprites.main.angle = this.angle
  }

  onPickup() {
    super.onPickup()

    this.player.speed *= 1.5
  }

  onRemoval() {
    this.player.speed = this.player.baseSpeed
  }
}
