import { animateSprite } from "./sprite"

export default class Player {
  constructor(x, y, speed = 20, flipped = false) {
    this.x = x
    this.y = y
    this.speed = speed;
    this.direction = [0,0]
    this.flipped = flipped
  }

  draw(ctx) {
    animateSprite(ctx, "wizzard_m_idle_anim", 140, 240)
  }

  update() {
    
  }
  
  move(horizontal, vertical) {
    this.direction = [horizontal, vertical]
  }
}
