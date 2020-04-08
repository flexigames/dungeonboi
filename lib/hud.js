import { createSprite } from "./sprite"
import { times } from "lodash"
import state from "./state"

export default class HUD {
  constructor(player) {
    this.player = player

    this.fullTexture = state.textures["ui_heart_full"]
    this.emptyTexture = state.textures["ui_heart_empty"]

    this.sprites = times(player.maxHealth).map((i) => createSprite("ui_heart_full", 20 + i * 20, 20, { stage: state.app.stage }))
  }

  update() {
    this.sprites.forEach((sprite, i) => {
      sprite.texture =
        i + 1 <= this.player.health ? this.fullTexture : this.emptyTexture
    })
  }
}
