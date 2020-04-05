import { animateSprite } from "./sprite"

export default class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw(ctx) {
    animateSprite(ctx, "wizzard_m_idle_anim", 140, 240)
  }

  update() {}
}
