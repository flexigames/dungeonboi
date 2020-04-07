import V from "../lib/vec2"

export default class Entity {
  constructor(x, y) {
    this.pos = V(x, y)
    this.tags = []
  }

  draw(ctx) {}

  update(dt) {}
}
