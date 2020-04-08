import Entity from "./Entity"
import { drawSprite } from "../lib/sprite"
import { findEntities, destroyEntity } from "../lib/entities"
import { Howl } from "howler"

export default class Potion extends Entity {
  tags = ["potion"]
  pickupRadius = 8

  update() {
    this.checkPlayerCollision()
  }

  draw(ctx) {
    this.drawShadow(ctx, 3)
    drawSprite(ctx, "flask_red", this.pos.x, this.pos.y, { anchor: [8, 14] })
  }

  checkPlayerCollision() {
    const player = findEntities("player")[0]

    if (player && this.pos.distance(player.pos) < this.pickupRadius) {
      new Howl({
        src: "assets/audio/potion.wav",
        volume: 0.3,
      }).play()
      player.gainHealth(1)
      destroyEntity(this)
    }
  }
}
