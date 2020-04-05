import createGame from "crtrdg-gameloop"
import drawLevel from "./lib/level"
import drawSprite, {animateSprite} from "./lib/sprite"
import drawUI from "./lib/ui"

const game = createGame()

game.canvas.height = 512
game.canvas.width = 512

game.on("draw", function(ctx, dt) {
  drawLevel(ctx)
  animateSprite(ctx, "wizzard_m_idle_anim", 140, 140)
  animateSprite(ctx, "ogre_idle_anim", 100, 100)
  drawUI(ctx)
})

game.start()
