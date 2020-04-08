import Entity from './Entity'
import drawSprite from "../lib/sprite"

export default class eadEnemy extends Entity {
    draw(ctx) {
        this.drawShadow(ctx, 6)
        drawSprite(
            ctx,
            "skelet_dead",
            Math.round(this.pos.x),
            Math.round(this.pos.y),
            {
              anchor: [8, 15],
            }
          )
    }
}