import { createSprite } from "./sprite"
import { times } from "lodash"
import state from "./state"
import * as PIXI from "pixi.js"

export default class HUD {
  constructor(player) {
    this.player = player

    this.fullTexture = state.textures["ui_heart_full"]
    this.emptyTexture = state.textures["ui_heart_empty"]

    this.sprites = times(player.maxHealthLimit).map((i) =>{
      const sprite  = createSprite("ui_heart_full", 20 + i * 32, 20, { stage: state.app.stage })
      sprite.scale = {x: 2, y: 2}
      return sprite
    }
    )

    this.createXpBar()

    this.createWeaponInfo()

    this.createLevelInfo()
  }

  createWeaponInfo() {
    this.weaponText = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
    })
    this.weaponText.position.x = 23
    this.weaponText.position.y = 70

    state.app.stage.addChild(this.weaponText)
  }

  createLevelInfo() {
    this.levelText = new PIXI.Text("Level: 1", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
    })
    this.levelText.position.x = 23
    this.levelText.position.y = 90

    state.app.stage.addChild(this.levelText)
  }

  createXpBar() {
    const posY = 52
    const bottomRectangle = new PIXI.Graphics()
    bottomRectangle.beginFill(0x483b3a)
    bottomRectangle.drawRect(0, 0, 100, 10)
    bottomRectangle.endFill()
    bottomRectangle.x = 20
    bottomRectangle.y = posY
    state.app.stage.addChild(bottomRectangle)

    const rectangle = new PIXI.Graphics()
    rectangle.beginFill(0x4ba747)
    rectangle.drawRect(0, 0, 64, 10)
    rectangle.endFill()
    rectangle.x = 20
    rectangle.y = posY
    state.app.stage.addChild(rectangle)

    this.xpBar = rectangle

    this.xpText = new PIXI.Text(this.player.xp, {
      fontFamily: "Arial",
      fontSize: 8,
      fill: 0xffffff,
    })
    this.xpText.position.x = 23
    this.xpText.position.y = posY

    state.app.stage.addChild(this.xpText)
  }

  update() {
    this.sprites.forEach((sprite, i) => {
      sprite.visible = i + 1 <= this.player.maxHealth
      sprite.texture =
        i + 1 <= this.player.health ? this.fullTexture : this.emptyTexture
    })

    this.xpText.text = `${this.player.xp}/${this.player.xpLimit}`

    this.xpBar.width =
      ((this.player.xp - this.player.previousXpLimit) / this.player.xpLimit) *
      100

    const weapon = this.player.weapon
    this.weaponText.text = weapon ? `${weapon.name}  (+${weapon.damage})` : ""

    this.levelText.text = `Level: ${state.level + 1}`
  }
}
