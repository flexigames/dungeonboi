import * as PIXI from "pixi.js"
import state from './state'

export default class MainMenu {
    constructor() {
        this.container = new PIXI.Container()
        state.app.stage.addChild(this.container)

        this.width = state.app.renderer.screen.width
        this.height = state.app.renderer.screen.height

        this.createBackground()
        this.createButton('Start Game')

        this.setVisible(false)

        this.onStart = () => {}
    }

    createButton(text) {
        const rectangle = new PIXI.Graphics()
        rectangle.lineStyle(2, 0xFFFFFF, 1)
        rectangle.beginFill(0x483B3A)
        rectangle.interactive = true
        rectangle.buttonMode= true
        rectangle.drawRect(this.width / 2 - 100, this.height / 2 - 49, 200, 32)
        rectangle.endFill()
        this.container.addChild(rectangle)

        rectangle.on('mouseup', () => this.onStart())

        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Press Start 2P',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center'
          })
          
        
        buttonText.position.x = this.width / 2
        buttonText.position.y = this.height / 2 - 32
        buttonText.anchor.set(0.5)

        this.container.addChild(buttonText)
    }

    createBackground() {
        const rectangle = new PIXI.Graphics()
        rectangle.beginFill(0x483B3A)
        rectangle.alpha = 0.7
        rectangle.drawRect(0, 0, this.width, this.height)
        rectangle.endFill()
        this.container.addChild(rectangle)

    }

    setVisible(visible) {
        this.container.visible = visible
    }
}