import { createSprite } from "./sprite"
import { times } from "lodash"
import state from "./state"
import * as PIXI from "pixi.js"

export default class HUD {
  constructor(player) {
    this.player = player

    this.fullTexture = state.textures["ui_heart_full"]
    this.emptyTexture = state.textures["ui_heart_empty"]

    this.sprites = times(player.maxHealth).map((i) =>
      createSprite("ui_heart_full", 20 + i * 20, 20, { stage: state.app.stage })
    )

    this.xpText = new PIXI.Text(player.xp, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    })
    this.xpText.position.x = 50
    this.xpText.position.y = 50

    state.app.stage.addChild(this.xpText)
  }

  update() {
    this.sprites.forEach((sprite, i) => {
      sprite.texture =
        i + 1 <= this.player.health ? this.fullTexture : this.emptyTexture
    })

    this.xpText.text = this.player.xp
  }
}
