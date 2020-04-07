import Entity from "./Entity"
import { drawSprite } from "../lib/sprite"

export default class Potion extends Entity {
  tags = ["potion"]

  draw(ctx) {
    drawSprite(ctx, "flask_red", this.x, this.y)
  }
}
