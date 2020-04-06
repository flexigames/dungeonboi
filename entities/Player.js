import { animateSprite } from "../lib/sprite"

export default class Player {
  constructor(x, y, speed = 20, flipped = false) {
    this.x = x
    this.y = y
    this.speed = speed;
    this.direction = [0,0]
    this.flipped = flipped
  }

  draw(ctx) {
    animateSprite(ctx, this.isMoving() ? "wizzard_m_idle_anim" : "wizzard_m_run_anim", this.x, this.y, this.flipped)
  }

  update(dt) {
    const diagonalModifier = this.direction[0] !== 0 && this.direction[1] !== 0 ? 0.7 : 1
    this.x = diagonalModifier * this.direction[0] * this.speed * dt
    this.y = diagonalModifier * this.direction[1] * this.speed * dt
  }
  
  setDirection(horizontal, vertical) {
    this.direction = [horizontal, vertical]
  }
  
  isMoving() {
    return this.direction[0] === 0 && this.direction[1] === 0 
  }
}
