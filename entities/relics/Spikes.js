import Relic from "./Relic"
import { createEntity } from "../../lib/entities"
import Projectile from "../Projectile"
import V from "../../lib/vec2"

export default class Spikes extends Relic {
  constructor(x, y, opts = {}) {
    super(x, y, { sprites: "spikes", ...opts })
  }

  onPlayerHit() {
    createEntity(
      new Projectile(this.player.pos.x, this.player.pos.y, { angle: 90 })
    )
    createEntity(
      new Projectile(this.player.pos.x, this.player.pos.y, {
        angle: 180,
        direction: V(0, 1),
      })
    )
    createEntity(
      new Projectile(this.player.pos.x, this.player.pos.y, {
        angle: 270,
        direction: V(-1, 0),
      })
    )
    createEntity(
      new Projectile(this.player.pos.x, this.player.pos.y, {
        angle: 0,
        direction: V(0, -1),
      })
    )
  }

  onRemoval() {}
}
