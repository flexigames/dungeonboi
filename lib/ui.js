import drawSprite from "../lib/sprite"
import { findEntities } from "../lib/entities"
import { times } from "loadsh"

function drawUI(ctx) {
  const player = findEntities("player")[0]

  for (let i = 0; i < player.maxHealth; i++) {
    drawSprite(
      ctx,
      i + 1 <= player.health ? "ui_heart_full" : "ui_heart_empty",
      20 + i * 20,
      20,
      { scale: 1 }
    )
  }
}

export default drawUI
