import Entity from "./Entity"
import { findEntities } from "../lib/entities"
import { goToNextLevel } from "../index"

export default class Ladder extends Entity {
  tags = ["ladder"]
  interactRadius = 12

  constructor(x, y) {
    super(x, y, { sprites: "floor_ladder" })
  }

  update(dt) {
    super.update(dt)
    this.checkPlayerCollision()
  }

  checkPlayerCollision() {
    const player = findEntities("player")[0]

    if (player && this.pos.distance(player.pos) < this.interactRadius) {
      goToNextLevel()
    }
  }
}
