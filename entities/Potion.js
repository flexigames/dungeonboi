import Entity from "./Entity"
import { drawSprite } from "../lib/sprite"
import { findEntities, destroyEntity } from "../lib/entities"

export default class Potion extends Entity {
  tags = ["potion"]

  update() {
    this.checkPlayerCollision()
  }

  draw(ctx) {
    drawSprite(ctx, "flask_red", this.pos.x, this.pos.y, { anchor: [8, 14] })
  }

  checkPlayerCollision() {
    const player = findEntities("player")[0]
    const RADIUS = 4

    if (player && this.pos.distance(player.pos) < RADIUS) {
      player.gainHealth(1)
      destroyEntity(this)
    }
  }
}
