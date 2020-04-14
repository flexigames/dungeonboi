import * as PIXI from "pixi.js"
import state from './state'

export default class PauseMenu {
    constructor() {
        this.pausedText = new PIXI.Text("Paused\nPress P to unpause", {
            fontFamily: "Arial",
            fontSize: 20,
            fill: 0xffffff,
            align: 'center'
          })
          
        const screenWidth = state.app.renderer.screen.width
        const screenHeight = state.app.renderer.screen.height
        
        this.pausedText.position.x = screenWidth / 2
        this.pausedText.position.y = screenHeight / 2 - 32
        this.pausedText.anchor.set(0.5)

        const rectangle = new PIXI.Graphics()
        rectangle.beginFill(0x483B3A)
        rectangle.alpha = 0.7
        rectangle.zIndex = 100000000
        rectangle.drawRect(0, 0, screenWidth, screenHeight)
        rectangle.endFill()
        this.background = rectangle


        state.app.stage.addChild(rectangle)
        state.app.stage.addChild(this.pausedText)

        this.setVisible(false)
    }

    setVisible(visible) {
        this.pausedText.visible = visible
        this.background.visible = visible
    }
}