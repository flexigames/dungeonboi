import { createSprite } from "./sprite"
import { random, times } from "lodash"
import state from "./state"
import * as PIXI from "pixi.js"
import { goToNextLevel } from ".."



export default class HUD {
  constructor(player) {
    this.player = player

    this.fullTexture = state.textures["heart_full"]
    this.emptyTexture = state.textures["heart_empty"]

    this.container = new PIXI.Container()
    this.container.visible = false
    state.app.stage.addChild(this.container)

    this.width = state.app.renderer.screen.width
    this.height = state.app.renderer.screen.height

    const fog = new PIXI.Graphics()
    fog.beginFill()
    fog.beginFill(0xE9CB90)
    fog.drawRect(0, 0, state.app.renderer.screen.width, state.app.renderer.screen.height)
    fog.endFill()
    fog.alpha = 0.1
    this.container.addChild(fog)


    const light = this.createHudSprite("light", 0, 0)
    light.width = state.app.renderer.screen.width
    light.height = state.app.renderer.screen.height
    light.alpha = 0.8

    this.createXpBar()
    this.createHearts()
    this.createWeaponInfo()
    this.createLevelInfo()
  }

  setVisible(visible) {
    this.container.visible = visible
  }

  createHearts() {
    this.createBorder({ x: 10, y: 8, width: 218, height: 26 })
    this.healthSprites = times(this.player.maxHealthLimit).map((i) => {
      const sprite = this.createHudSprite("heart_full", 24 + i * 20, 18)
      sprite.scale = { x: 2, y: 2 }
      return sprite
    })
  }

  createHudSprite(name, x, y) {
    const sprite = createSprite(name, x, y, { stage: this.container })
    sprite.scale = { x: 2, y: 2 }
    return sprite
  }

  createWeaponInfo() {
    this.weaponText = new PIXI.Text("", {
      fontFamily: 'Press Start 2P',
      fontSize: 16,
      fill: 0xFDF7ED,
    })
    this.weaponText.position.x = 24
    this.weaponText.position.y = this.height - 70

    this.container.addChild(this.weaponText)
  }

  createLevelInfo() {
    this.levelText = new PIXI.Text("Floor 1", {
      fontFamily: 'Press Start 2P',
      fontSize: 16,
      fill: 0xFDF7ED,
    })
    this.levelText.position.x = this.width - 140
    this.levelText.position.y = 22

    this.container.addChild(this.levelText)
  }

  createBorder({ x, y, width, height }) {
    const bottomRectangle = new PIXI.Graphics()
    bottomRectangle.beginFill(0x483b3a)
    bottomRectangle.drawRect(x, y, width, height + 16)
    bottomRectangle.endFill()
    this.container.addChild(bottomRectangle)


    this.createHudSprite("border_top_left", x, y)
    this.createHudSprite("border_top_right", x + width - 8, y)
    this.createHudSprite("border_bottom_left", x, y + height)
    this.createHudSprite("border_bottom_right", x + width - 8, y + height)

    const borderTop = this.createHudSprite("border_top", x + 8, y)
    borderTop.width = width - 16

    const borderBottom = this.createHudSprite("border_bottom", x + 16, y + height)
    borderBottom.width = width - 16

    const borderLeft = this.createHudSprite("border_left", x, y + 8)
    borderLeft.height = height - 8

    const borderRight = this.createHudSprite("border_right", x + width - 8, y + 8)
    borderRight.height = height - 8

  }

  createXpBar() {
    const progressBarWidth = 226

    const posX = 16
    const posY = 52

    this.progresssMaxWidth = progressBarWidth - 14
    this.createHudSprite("progressbar_left", posX - 5, posY)
    const middle = this.createHudSprite("progressbar_middle", posX, posY)
    middle.width = this.progresssMaxWidth
    this.createHudSprite("progressbar_right", posX + progressBarWidth - 20, posY)

    const bottomRectangle = new PIXI.Graphics()
    bottomRectangle.beginFill(0x483b3a)
    bottomRectangle.drawRect(0, 0, progressBarWidth - 11, 10)
    bottomRectangle.endFill()
    bottomRectangle.x = posX
    bottomRectangle.y = posY + 2
    this.container.addChild(bottomRectangle)


    const rectangleGlance = new PIXI.Graphics()
    rectangleGlance.beginFill(0x5ED45A)
    rectangleGlance.drawRect(0, 0, 64, 10)
    rectangleGlance.endFill()
    rectangleGlance.x = posX
    rectangleGlance.y = posY + 2
    this.container.addChild(rectangleGlance)

    const rectangle = new PIXI.Graphics()
    rectangle.beginFill(0x4ba747)
    rectangle.drawRect(0, 0, 64, 8)
    rectangle.endFill()
    rectangle.x = posX
    rectangle.y = posY + 4
    this.container.addChild(rectangle)

    const rectangleShadow = new PIXI.Graphics()
    rectangleShadow.beginFill(0x337331)
    rectangleShadow.drawRect(0, 0, 64, 2)
    rectangleShadow.endFill()
    rectangleShadow.x = posX
    rectangleShadow.y = posY + 10
    this.container.addChild(rectangleShadow)

    

    this.xpBar = rectangle
    this.xpBarShadow = rectangleShadow
    this.xpBarGlance = rectangleGlance
    this.xpBarShadow.width  = 0
    this.xpBar.width = 0
    this.xpBarGlance.width = 0
  }

  update() {

    this.healthSprites.forEach((sprite, i) => {
      sprite.visible = i + 1 <= this.player.maxHealth
      sprite.texture =
        i + 1 <= this.player.health ? this.fullTexture : this.emptyTexture
    })

    
    this.xpBar.width =
      ((this.player.xp - this.player.previousXpLimit) /
        (this.player.xpLimit - this.player.previousXpLimit)) *
      (this.progresssMaxWidth + 3)
    this.xpBarShadow.width = this.xpBar.width 
    this.xpBarGlance.width = this.xpBar.width

    const weapon = this.player.weapon
    this.weaponText.text = weapon ? `${weapon.name} (+${weapon.damage})` : ""

    this.levelText.text = `Floor ${state.level + 1}`
  }
}
