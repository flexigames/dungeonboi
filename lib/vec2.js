export default (x, y) => new Vec2(x, y)

export class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  multiply(other) {
    if (other instanceof Vec2)
      return new Vec2(this.x * other.x, this.y * other.y)

    return new Vec2(this.x * other, this.y * other)
  }

  divide(other) {
    if (other instanceof Vec2)
      return new Vec2(this.x / other.x, this.y / other.y)

    return new Vec2(this.x / other, this.y / other)
  }

  add(other) {
    if (other instanceof Vec2)
      return new Vec2(this.x + other.x, this.y + other.y)

    return new Vec2(this.x + other, this.y + other)
  }

  subtract(other) {
    if (other instanceof Vec2)
      return new Vec2(this.x - other.x, this.y - other.y)

    return new Vec2(this.x - other, this.y - other)
  }

  sub(other) {
    return this.subtract(other)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const length = this.length()
    if (length === 0) return new Vec2(0, 0)
    return this.divide(new Vec2(length, length))
  }

  distance(other) {
    return this.subtract(other).abs().length()
  }

  round() {
    return this.math("round")
  }

  abs() {
    return this.math("abs")
  }

  math(fn) {
    return new Vec2(Math[fn](this.x), Math[fn](this.y))
  }

  equals(other) {
    return this.x === other.x && this.y === other.y
  }
}
