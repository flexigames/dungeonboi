import createGame from "crtrdg-gameloop"
import drawLevel from "./lib/level"
import drawSprite from "./lib/sprite"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  drawSprite(ctx, "wizzard_m_idle_anim", 100, 100)
})

game.start()
