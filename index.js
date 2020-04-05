import createGame from "crtrdg-gameloop"
import drawLevel from "./lib/level"
import {animateSprite} from "./lib/sprite"
import drawUI from "./lib/ui"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  animateSprite(ctx, "wizzard_m_idle_anim", 140, 240)
  animateSprite(ctx, "ogre_idle_anim", 320, 240, true)
  drawUI(ctx)
})

game.start()
