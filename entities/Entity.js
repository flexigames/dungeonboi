import V from "../lib/vec2"

export default class Entity {
  constructor(x, y) {
    this.pos = V(x, y)
    this.tags = []
  }

  draw(ctx) {}

  update(dt) {}

  drawShadow(ctx, shadowWidth = 5) {
    ctx.beginPath()
    ctx.ellipse(Math.round(this.pos.x), Math.round(this.pos.y), shadowWidth, 3, 0, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()
  }
}
