import Entity from "./Entity"
import { findEntities } from "../lib/entities"
import { Howl } from "howler"
import Chest from '../entities/Chest'

export default class Potion extends Entity {
  tags = ["potion"]
  pickupRadius = 8

  constructor(x, y) {
    super(x, y, { sprites: "flask_red" })
  }

  update(dt) {
    super.update(dt)
    this.checkPlayerCollision()
  }

  checkPlayerCollision() {
    const player = findEntities("player")[0]

    if (player && this.pos.distance(player.pos) < this.pickupRadius) {
      new Howl({
        src: "assets/audio/potion.wav",
        volume: 0.3,
      }).play()
      player.gainHealth(1)
      this.destroy()
    }
  }
}
