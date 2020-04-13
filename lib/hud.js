import { createSprite } from "./sprite"
import { times } from "lodash"
import state from "./state"
import * as PIXI from "pixi.js"

function createHudSprite(name, x, y) {
  const sprite = createSprite(name, x, y, { stage: state.app.stage })
  sprite.scale = { x: 2, y: 2 }
  return sprite
}

export default class HUD {
  constructor(player) {
    this.player = player

    this.fullTexture = state.textures["ui_heart_full"]
    this.emptyTexture = state.textures["ui_heart_empty"]

    this.healthSprites = times(player.maxHealthLimit).map((i) =>
      createHudSprite("ui_heart_full", 20 + i * 32, 20)
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
    const posX = 26

    const progressBarWidth = 200
    this.progresssMaxWidth = progressBarWidth - 14
    createHudSprite("progressbar_left", 20, posY, { stage: state.app.stage })
    const middle = createHudSprite("progressbar_middle", 27, posY, {
      stage: state.app.stage,
    })
    middle.width = this.progresssMaxWidth
    createHudSprite("progressbar_right", progressBarWidth + 7, posY, {
      stage: state.app.stage,
    })

    const bottomRectangle = new PIXI.Graphics()
    bottomRectangle.beginFill(0x483b3a)
    bottomRectangle.drawRect(0, 0, progressBarWidth - 11, 10)
    bottomRectangle.endFill()
    bottomRectangle.x = posX
    bottomRectangle.y = posY + 2
    state.app.stage.addChild(bottomRectangle)

    const rectangle = new PIXI.Graphics()
    rectangle.beginFill(0x4ba747)
    rectangle.drawRect(0, 0, 64, 10)
    rectangle.endFill()
    rectangle.x = posX
    rectangle.y = posY + 2
    state.app.stage.addChild(rectangle)

    this.xpBar = rectangle

    this.xpText = new PIXI.Text(this.player.xp, {
      fontFamily: "Arial",
      fontSize: 8,
      fill: 0xffffff,
    })
    this.xpText.position.x = 27
    this.xpText.position.y = posY + 2

    state.app.stage.addChild(this.xpText)
  }

  update() {
    this.healthSprites.forEach((sprite, i) => {
      sprite.visible = i + 1 <= this.player.maxHealth
      sprite.texture =
        i + 1 <= this.player.health ? this.fullTexture : this.emptyTexture
    })

    this.xpText.text = `${this.player.xp}/${this.player.xpLimit}`

    this.xpBar.width =
      ((this.player.xp - this.player.previousXpLimit) /
        (this.player.xpLimit - this.player.previousXpLimit)) *
      (this.progresssMaxWidth + 3)

    const weapon = this.player.weapon
    this.weaponText.text = weapon ? `${weapon.name}  (+${weapon.damage})` : ""

    this.levelText.text = `Level: ${state.level + 1}`
  }
}
