export default class Entity {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.tags = []
  }

  draw(ctx) {}

  update(dt) {}
}
